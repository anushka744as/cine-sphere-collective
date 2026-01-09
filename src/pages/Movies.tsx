import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmGrid from "@/components/FilmGrid";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { useRef } from "react";
import { useFilms } from "@/hooks/useFilms";
import { Film } from "@/data/dummyFilms";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "All" },
  { id: "drama", label: "Drama" },
  { id: "romance", label: "Romance" },
  { id: "biography", label: "Biography" },
  { id: "documentary", label: "Documentary" },
  { id: "war", label: "War" },
  { id: "thriller", label: "Thriller" },
  { id: "comedy", label: "Comedy" },
  { id: "fantasy", label: "Fantasy" },
];

const Movies = () => {
  const { data: films = [], isLoading, error } = useFilms();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeOverlay = () => {
    setSelectedFilm(null);
  };

  const filteredFilms = selectedCategory === "all"
    ? films
    : films.filter(film => film.category.toLowerCase() === selectedCategory);

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
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
            Browse Collection
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            All Films
          </h1>
          <p className="text-lg text-foreground/60 max-w-xl mb-12">
            Explore our complete collection from creators worldwide
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`border-foreground/20 ${selectedCategory === category.id
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "hover:bg-foreground/10"
                  }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Films Grid */}
      <FilmGrid films={filteredFilms} onFilmClick={handleFilmClick} />

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

export default Movies;
