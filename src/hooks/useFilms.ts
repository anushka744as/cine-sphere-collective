import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Film } from "@/data/dummyFilms";

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

            // Map Supabase data to Film interface
            return (data || []).map((movie) => ({
                id: movie.id,
                title: movie.title,
                director: movie.director || "Unknown Director",
                directorBio: movie.director_bio || "",
                directorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", // Placeholder as it is missing in DB
                year: movie.year || new Date().getFullYear(),
                duration: movie.duration || "0min",
                category: movie.category,
                genre: movie.genre || "",
                description: movie.description || "",
                thumbnail: movie.thumbnail_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=800", // Fallback
                videoUrl: movie.youtube_url,
                youtubeVideoId: movie.youtube_video_id || "",
                characteristics: movie.characteristics || [],
                awards: movie.awards || [],
                cast: movie.cast_members || [],
                cinematographer: Array.isArray(movie.cinematographer)
                    ? movie.cinematographer
                    : (movie.cinematographer ? [movie.cinematographer] : []),
                country: movie.country || "Unknown",
                language: movie.language || "Unknown",
                isFeatured: movie.is_featured || false,
            }));
        },
    });
};
