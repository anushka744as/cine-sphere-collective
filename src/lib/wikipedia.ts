export interface AwardInfo {
  title: string;
  extract: string;
  thumbnail?: string;
  pageUrl: string;
}

export const fetchAwardInfo = async (awardName: string): Promise<AwardInfo | null> => {
  try {
    // Clean up the award name for the API
    const searchTerm = awardName
      .replace(/[-–—]/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      // Try a more generic search if the exact match fails
      const fallbackResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          searchTerm.split(' ').slice(0, 3).join(' ')
        )}`
      );

      if (!fallbackResponse.ok) {
        return null;
      }

      const fallbackData = await fallbackResponse.json();
      return {
        title: fallbackData.title,
        extract: fallbackData.extract,
        thumbnail: fallbackData.thumbnail?.source,
        pageUrl: fallbackData.content_urls?.desktop?.page || '',
      };
    }

    const data = await response.json();
    return {
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      pageUrl: data.content_urls?.desktop?.page || '',
    };
  } catch (error) {
    console.error('Error fetching award info:', error);
    return null;
  }
};
