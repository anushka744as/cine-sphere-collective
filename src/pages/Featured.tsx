import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2, Film } from "lucide-react";
import { motion } from "framer-motion";

const Featured = () => {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMovies();
  }, []);

  const fetchFeaturedMovies = async () => {
    try {
      // Fetch ONLY featured films marked by admin
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

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
      <motion.div 
        className="pt-24 pb-12 bg-gradient-to-b from-background via-card/20 to-background"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Featured Films
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Handpicked by our team. Exceptional storytelling. Constantly updated with new featured selections.
          </p>
        </div>
      </motion.div>

      {/* Collections */}
      {loading ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      ) : featuredMovies.length === 0 ? (
        <motion.div 
          className="container mx-auto px-4 py-20 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Star className="h-20 w-20 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-2xl font-semibold mb-2">No Featured Films Yet</h3>
          <p className="text-muted-foreground">Admin will feature exceptional films soon!</p>
        </motion.div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured by CineSphere Team
                </Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Exceptional Films
              </h2>
              <p className="text-lg text-muted-foreground">
                Outstanding films that showcase the best of cinematic storytelling
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Featured;

