import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Trash2, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Film } from "@/data/dummyFilms";
import { Button } from "@/components/ui/button";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <Navbar />

      <main className="container mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
              Your Collection
            </p>
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-4">
              <Bookmark className="h-10 w-10" />
              Watchlist
            </h1>
          </div>
          {watchlist.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Clear your entire watchlist?")) {
                  clearWatchlist();
                }
              }}
              className="border-foreground/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <Bookmark className="h-16 w-16 mx-auto mb-6 text-foreground/20" />
            <h2 className="text-2xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-foreground/50 mb-8">
              Browse films and add them to your watchlist to save them for later.
            </p>
            <Button onClick={() => window.location.href = "/movies"} className="bg-foreground text-background">
              Browse Films
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchlist.map((film, index) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedFilm(film)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                    <img
                      src={film.thumbnail}
                      alt={film.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{film.title}</h3>
                  <p className="text-sm text-foreground/50">
                    {film.director} • {film.year}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(film.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  title="Remove from watchlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {selectedFilm && (
        <FilmDetailOverlay
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </motion.div>
  );
};

export default Watchlist;
