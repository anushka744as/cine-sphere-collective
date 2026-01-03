import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Loader2, Film } from "lucide-react";

const Featured = () => {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMovies();
  }, []);

  const fetchFeaturedMovies = async () => {
    try {
      // Fetch approved films ordered by views (as featured)
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .order('views', { ascending: false, nullsFirst: false })
        .limit(12);

      if (featuredError) throw featuredError;
      setFeaturedMovies(featured || []);
    } catch (error) {
      console.error('Error fetching featured movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">Curated by Our Team</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Featured Films
          </h1>
          <p className="text-lg text-foreground/60 max-w-xl">
            Handpicked selections showcasing exceptional storytelling
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
          </div>
        ) : featuredMovies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="h-12 w-12 mx-auto mb-4 text-foreground/20" />
            <h3 className="text-xl font-medium mb-2">No Featured Films Yet</h3>
            <p className="text-foreground/50">Check back soon for curated selections</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredMovies.map((movie, index) => (
              <VideoCard 
                key={movie.id}
                id={movie.id}
                title={movie.title}
                thumbnail={movie.thumbnail_url || `https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800`}
                duration={movie.duration || new Date(movie.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                category={movie.category}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Featured;
