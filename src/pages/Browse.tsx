import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Loader2, Film } from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  { id: "nature", label: "Nature & Wildlife" },
  { id: "history", label: "History" },
  { id: "science", label: "Science & Technology" },
  { id: "culture", label: "Culture & Society" },
  { id: "true-crime", label: "True Crime" },
  { id: "biography", label: "Biography" },
  { id: "travel", label: "Travel & Adventure" },
];

const Browse = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('movies')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.ilike('category', `%${selectedCategory}%`);
      }

      const { data, error } = await query;
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
      
      {/* Header */}
      <motion.div 
        className="pt-24 pb-8 bg-gradient-to-b from-background to-card/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Browse Films
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover films from creators worldwide - all free to watch
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto bg-card/50 p-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : movies.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Film className="h-20 w-20 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-2xl font-semibold mb-2">No Films Found</h3>
                <p className="text-muted-foreground">No films in this category yet.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie, index) => (
                  <VideoCard 
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    thumbnail={movie.thumbnail_url || `https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800`}
                    duration={movie.duration || new Date(movie.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    views={movie.youtube_views?.toString() || movie.views?.toString() || "0"}
                    category={movie.category}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Load More - Hidden if no content */}
      {!loading && movies.length > 0 && (
        <motion.div 
          className="container mx-auto px-4 py-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" size="lg" className="glass">
            Load More Films
          </Button>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Browse;

