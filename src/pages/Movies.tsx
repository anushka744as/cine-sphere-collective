import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import Footer from "@/components/Footer";
import { Loader2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "All" },
  { id: "nature", label: "Nature" },
  { id: "history", label: "History" },
  { id: "science", label: "Science" },
  { id: "culture", label: "Culture" },
  { id: "true-crime", label: "True Crime" },
  { id: "biography", label: "Biography" },
  { id: "travel", label: "Travel" },
  { id: "action", label: "Action" },
  { id: "comedy", label: "Comedy" },
  { id: "drama", label: "Drama" },
  { id: "horror", label: "Horror" },
  { id: "thriller", label: "Thriller" },
];

const Movies = () => {
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
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">Collection</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Films</h1>
          <p className="text-lg text-foreground/60">
            Browse our complete collection from creators worldwide
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id 
                  ? "bg-foreground text-background" 
                  : "border-foreground/20 hover:bg-foreground/10"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="h-12 w-12 mx-auto mb-4 text-foreground/20" />
            <h3 className="text-xl font-medium mb-2">No Films Found</h3>
            <p className="text-foreground/50">
              {selectedCategory === 'all' 
                ? 'Be the first to submit a film!' 
                : 'No films in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
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
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
