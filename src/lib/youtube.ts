/**
 * YouTube API Integration Helper
 * 
 * To use YouTube Data API v3 for live view counts:
 * 1. Get API key from: https://console.developers.google.com/
 * 2. Enable YouTube Data API v3
 * 3. Add API key to your .env file as: VITE_YOUTUBE_API_KEY
 * 4. Uncomment the fetchYouTubeData function below
 */

// YouTube API Key (set in .env file)
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface YouTubeVideoData {
  viewCount: number;
  likeCount: number;
  duration: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Fetch YouTube video data using YouTube Data API v3
 * Requires VITE_YOUTUBE_API_KEY environment variable
 */
export const fetchYouTubeData = async (videoId: string): Promise<YouTubeVideoData | null> => {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured. Add VITE_YOUTUBE_API_KEY to your .env file.');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube data');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    
    return {
      viewCount: parseInt(video.statistics?.viewCount || '0'),
      likeCount: parseInt(video.statistics?.likeCount || '0'),
      duration: formatDuration(video.contentDetails?.duration || ''),
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      thumbnailUrl: video.snippet?.thumbnails?.maxresdefault?.url || 
                    video.snippet?.thumbnails?.high?.url || '',
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return null;
  }
};

/**
 * Convert YouTube duration format (PT1H2M3S) to readable format (1:02:03)
 */
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return '';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  const parts = [];
  if (hours) parts.push(hours);
  parts.push((minutes || '0').padStart(hours ? 2 : 1, '0'));
  parts.push((seconds || '0').padStart(2, '0'));

  return parts.join(':');
};

/**
 * Update movie with YouTube data in Supabase
 */
export const updateMovieWithYouTubeData = async (
  movieId: string,
  videoId: string,
  supabase: any
): Promise<boolean> => {
  const youtubeData = await fetchYouTubeData(videoId);
  
  if (!youtubeData) {
    return false;
  }

  const { error } = await supabase
    .from('movies')
    .update({
      youtube_views: youtubeData.viewCount,
      duration: youtubeData.duration,
      // Optionally update thumbnail if not set
      // thumbnail_url: youtubeData.thumbnailUrl,
    })
    .eq('id', movieId);

  if (error) {
    console.error('Error updating movie with YouTube data:', error);
    return false;
  }

  return true;
};

/**
 * Batch update all movies with YouTube data
 * Call this periodically (e.g., daily) to refresh view counts
 */
export const batchUpdateYouTubeData = async (supabase: any): Promise<void> => {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured. Skipping batch update.');
    return;
  }

  const { data: movies, error } = await supabase
    .from('movies')
    .select('id, youtube_video_id')
    .not('youtube_video_id', 'is', null);

  if (error) {
    console.error('Error fetching movies for batch update:', error);
    return;
  }

  console.log(`Updating YouTube data for ${movies.length} films...`);

  let updated = 0;
  let failed = 0;

  for (const movie of movies) {
    const success = await updateMovieWithYouTubeData(movie.id, movie.youtube_video_id, supabase);
    if (success) {
      updated++;
    } else {
      failed++;
    }
    
    // Add delay to avoid rate limiting (50 requests per second limit)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`Batch update complete: ${updated} updated, ${failed} failed`);
};

