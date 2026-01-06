import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmGrid from "@/components/FilmGrid";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { dummyFilms, Film } from "@/data/dummyFilms";

const Browse = () => {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeOverlay = () => {
    setSelectedFilm(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
            Discover
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            Browse Films
          </h1>
        </div>
      </section>

      {/* Films Grid */}
      <FilmGrid films={dummyFilms} onFilmClick={handleFilmClick} />

      <Footer />

      {/* Film Detail Overlay */}
      {selectedFilm && (
        <FilmDetailOverlay 
          film={selectedFilm} 
          onClose={closeOverlay}
          onSelectFilm={setSelectedFilm}
        />
      )}
    </div>
  );
};

export default Browse;
