import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";
import { Loader2, Film, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [recentMovies, setRecentMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch featured films (top viewed)
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .order('views', { ascending: false, nullsFirst: false })
        .limit(6);

      if (featuredError) throw featuredError;
      setFeaturedMovies(featured || []);

      // Fetch trending (most viewed)
      const { data: trending, error: trendingError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .order('views', { ascending: false, nullsFirst: false })
        .limit(3);

      if (trendingError) throw trendingError;
      setTrendingMovies(trending || []);

      // Fetch recent films
      const { data: recent, error: recentError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(9);

      if (recentError) throw recentError;
      setRecentMovies(recent || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayMovies = featuredMovies.length > 0 ? featuredMovies : recentMovies;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Featured Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
              {featuredMovies.length > 0 ? 'Curated Selection' : 'Latest Additions'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {featuredMovies.length > 0 ? 'Featured Films' : 'Recent Films'}
            </h2>
          </div>
          <Button 
            variant="ghost" 
            className="hidden md:flex items-center gap-2 text-foreground/60 hover:text-foreground"
            onClick={() => navigate('/movies')}
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
          </div>
        ) : displayMovies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="h-12 w-12 mx-auto mb-4 text-foreground/20" />
            <p className="text-foreground/50">No films yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMovies.map((movie, index) => (
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

        <Button 
          variant="outline" 
          className="md:hidden mt-8 w-full border-foreground/20"
          onClick={() => navigate('/movies')}
        >
          View All Films
        </Button>
      </section>

      {/* Trending Section */}
      {trendingMovies.length > 0 && (
        <section className="bg-card/30 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">Popular Now</p>
              <h2 className="text-3xl md:text-4xl font-bold">Trending Films</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingMovies.map((movie, index) => (
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
          </div>
        </section>
      )}

      {/* Editorial Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-sm bg-card/50 p-12 md:p-20">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">Join the Community</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your Story</h2>
            <p className="text-foreground/60 mb-8 leading-relaxed">
              Have a film on YouTube? Submit it to CineSphere and reach an audience passionate about cinema. 
              It's completely free.
            </p>
            <Button 
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={() => navigate('/auth')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
