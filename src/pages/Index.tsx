import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import FilmGrid from "@/components/FilmGrid";
import FilmCarousel from "@/components/FilmCarousel";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { SearchBar } from "@/components/SearchBar";
import { dummyFilms, Film } from "@/data/dummyFilms";
import { ArrowRight, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Film[]>(dummyFilms);

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeOverlay = () => {
    setSelectedFilm(null);
  };

  const handleSearchResults = useCallback((results: Film[]) => {
    setSearchResults(results);
  }, []);

  // Split films into sections
  const featuredFilms = dummyFilms.slice(0, 6);
  const newReleases = dummyFilms.slice(3, 9);
  const curatedPicks = dummyFilms.slice(6, 12);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <Navbar />

      {/* Search Toggle Button */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="fixed top-6 right-24 z-50 p-2 text-foreground/70 hover:text-foreground transition-colors"
      >
        {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-0 right-0 z-40"
          >
            <SearchBar
              films={dummyFilms}
              onSearchResults={handleSearchResults}
              onClose={() => setShowSearch(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showSearch && searchResults.length < dummyFilms.length ? (
        /* Search Results View */
        <div className="pt-48 pb-24 px-6 lg:px-12 container mx-auto">
          <p className="text-sm text-foreground/50 mb-6">
            {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((film) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer"
                onClick={() => handleFilmClick(film)}
              >
                <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                  <img
                    src={film.thumbnail}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium mb-1">{film.title}</h3>
                <p className="text-sm text-foreground/50">
                  {film.director} • {film.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Normal View */
        <>
          {/* Hero Carousel */}
          <HeroCarousel onFilmClick={handleFilmClick} />

          {/* Featured Films Grid */}
          <FilmGrid
            films={featuredFilms}
            onFilmClick={handleFilmClick}
            title="Featured Films"
            subtitle="Film & TV"
          />

          {/* New Releases Carousel */}
          <div className="border-t border-foreground/10">
            <FilmCarousel
              films={newReleases}
              onFilmClick={handleFilmClick}
              title="New Releases"
              subtitle="Just Added"
            />
          </div>

          {/* Curated Picks Carousel */}
          <div className="border-t border-foreground/10">
            <FilmCarousel
              films={curatedPicks}
              onFilmClick={handleFilmClick}
              title="Curated Picks"
              subtitle="Editor's Choice"
            />
          </div>

          {/* Editorial Section */}
          <section className="border-t border-foreground/10 py-24">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                  Join the Community
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Share Your Story</h2>
                <p className="text-lg text-foreground/60 mb-10 leading-relaxed">
                  Have a film on YouTube? Submit it to CineSphere and reach an audience
                  passionate about cinema. It's completely free.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="group inline-flex items-center gap-3 text-foreground border border-foreground/30 px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  <span className="text-sm uppercase tracking-widest">Get Started</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />

      {/* Film Detail Overlay */}
      {selectedFilm && (
        <FilmDetailOverlay
          film={selectedFilm}
          onClose={closeOverlay}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </motion.div>
  );
};

export default Index;
