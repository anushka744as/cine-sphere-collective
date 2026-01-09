import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Film } from "@/data/dummyFilms";

// Extended movie type that matches actual DB schema (not in generated types)
interface ExtendedMovie {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  youtube_video_id?: string | null;
  thumbnail_url: string | null;
  category: string;
  genre: string | null;
  duration: string | null;
  views: number | null;
  status: string | null;
  uploaded_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  year?: number | null;
  country?: string | null;
  language?: string | null;
  director?: string | null;
  director_bio?: string | null;
  cinematographer?: string | null;
  cast_members?: string[] | null;
  awards?: string[] | null;
  characteristics?: string[] | null;
  is_featured?: boolean | null;
}

export const useFilms = () => {
  return useQuery({
    queryKey: ["films"],
    queryFn: async (): Promise<Film[]> => {
      const { data, error } = await supabase
        .from("movies")
        .select("*");

      if (error) {
        throw error;
      }

      // Cast to extended type since generated types don't include new columns
      const movies = data as unknown as ExtendedMovie[];

      // Map Supabase data to Film interface
      return (movies || []).map((movie) => ({
        id: movie.id,
        title: movie.title,
        director: movie.director || "Unknown Director",
        directorBio: movie.director_bio || "",
        directorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        year: movie.year || new Date().getFullYear(),
        duration: movie.duration || "0min",
        category: movie.category,
        genre: movie.genre || "",
        description: movie.description || "",
        thumbnail: movie.thumbnail_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=800",
        videoUrl: movie.youtube_url,
        youtubeVideoId: movie.youtube_video_id || "",
        characteristics: movie.characteristics || [],
        awards: movie.awards || [],
        cast: movie.cast_members || [],
        cinematographer: movie.cinematographer ? [movie.cinematographer] : [],
        country: movie.country || "Unknown",
        language: movie.language || "Unknown",
        isFeatured: movie.is_featured || false,
      }));
    },
  });
};
