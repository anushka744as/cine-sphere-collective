import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const Movies = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Movies</h1>
          <p className="text-muted-foreground">Browse our complete collection of cinematic content</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No movies available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <VideoCard
                key={movie.id}
                title={movie.title}
                thumbnail={movie.thumbnail_url || `https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800`}
                duration={movie.duration || "N/A"}
                views={movie.views?.toString() || "0"}
                category={movie.category}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
