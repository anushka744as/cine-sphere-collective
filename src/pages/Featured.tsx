import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmGrid from "@/components/FilmGrid";
import FilmCarousel from "@/components/FilmCarousel";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { useFilms } from "@/hooks/useFilms";
import { Film } from "@/data/dummyFilms";

const Featured = () => {
  const { data: films = [], isLoading, error } = useFilms();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeOverlay = () => {
    setSelectedFilm(null);
  };

  const featuredFilms = films.filter(f => f.isFeatured).slice(0, 6);
  const staffPicks = films.filter(f => !f.isFeatured).slice(0, 6);

  // Fallback if no films are marked as featured
  const displayFeatured = featuredFilms.length > 0 ? featuredFilms : films.slice(0, 6);
  const displayStaffPicks = staffPicks.length > 0 ? staffPicks : films.slice(6, 12);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Error loading films. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
            Curated Selection
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Featured Films
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Hand-picked films that showcase exceptional storytelling,
            cinematography, and artistic vision from around the world.
          </p>
        </div>
      </section>

      {/* Featured Films Grid */}
      <FilmGrid
        films={displayFeatured}
        onFilmClick={handleFilmClick}
        title="This Week"
        subtitle="Editor's Pick"
      />

      {/* Staff Picks Carousel */}
      <div className="border-t border-foreground/10">
        <FilmCarousel
          films={displayStaffPicks}
          onFilmClick={handleFilmClick}
          title="Staff Picks"
          subtitle="Recommended"
        />
      </div>

      <Footer />

      {/* Film Detail Overlay */}
      {selectedFilm && (
        <FilmDetailOverlay
          film={selectedFilm}
          onClose={closeOverlay}
          onSelectFilm={setSelectedFilm}
          availableFilms={films}
        />
      )}
    </div>
  );
};

export default Featured;
