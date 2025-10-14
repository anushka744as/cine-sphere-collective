import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Loader2, Film, Camera, Video, Clapperboard } from "lucide-react";

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [recentMovies, setRecentMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch featured films marked by admin
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (featuredError) throw featuredError;
      setFeaturedMovies(featured || []);

      // Fetch trending featured films (most YouTube views)
      const { data: trending, error: trendingError } = await supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('youtube_views', { ascending: false, nullsFirst: false })
        .order('views', { ascending: false })
        .limit(3);

      if (trendingError) throw trendingError;
      setTrendingMovies(trending || []);

      // Fetch recent films from database (for when no featured films exist)
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <Hero />
      
      {/* Floating 3D Cinema Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Film Strip Animation */}
        <motion.div
          className="absolute top-1/4 -left-20"
          animate={{ 
            x: [0, 100, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-96 bg-gradient-to-b from-primary/10 to-transparent border-l-4 border-r-4 border-primary/20 relative">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute w-full h-8 border-t-2 border-primary/20" style={{ top: `${i * 10}%` }}>
                <div className="w-3 h-3 bg-primary/30 rounded-full absolute -left-1.5 top-1/2 -translate-y-1/2"></div>
                <div className="w-3 h-3 bg-primary/30 rounded-full absolute -right-1.5 top-1/2 -translate-y-1/2"></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Camera Icon 3D */}
        <motion.div
          className="absolute top-1/3 right-10 text-secondary/10"
          animate={{ 
            y: [0, -50, 0],
            rotateY: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Camera className="w-40 h-40" style={{ transform: 'perspective(500px) rotateY(25deg)' }} />
        </motion.div>

        {/* Clapperboard Animation */}
        <motion.div
          className="absolute bottom-1/4 left-1/3 text-primary/15"
          animate={{ 
            rotate: [0, -10, 0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Clapperboard className="w-32 h-32" style={{ transform: 'perspective(500px) rotateX(15deg) rotateY(-15deg)' }} />
        </motion.div>

        {/* Video Icon Floating */}
        <motion.div
          className="absolute top-2/3 right-1/4 text-secondary/10"
          animate={{ 
            y: [0, 30, 0],
            x: [0, -20, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Video className="w-28 h-28" style={{ transform: 'perspective(500px) rotateZ(15deg)' }} />
        </motion.div>

        {/* Particle Effects */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
      
      {/* Featured Section - Show Featured films if available, otherwise show Recent */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10">
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {featuredMovies.length > 0 ? 'Featured Films' : 'Recent Films'}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {featuredMovies.length > 0 
              ? 'Handpicked selections from our collection' 
              : 'Latest additions from our community'}
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (featuredMovies.length === 0 && recentMovies.length === 0) ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No films yet. Be the first to share!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredMovies.length > 0 ? featuredMovies : recentMovies).map((movie, index) => (
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
      </section>

      {/* Trending Section - Only show if there are featured films */}
      {featuredMovies.length > 0 && (
        <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 bg-card/20 relative z-10" id="trending">
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Trending Films</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Most popular films this week</p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : trendingMovies.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No trending content yet</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
