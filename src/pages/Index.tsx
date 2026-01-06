import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import FilmGrid from "@/components/FilmGrid";
import FilmCarousel from "@/components/FilmCarousel";
import FilmDetailOverlay from "@/components/FilmDetailOverlay";
import { dummyFilms, Film } from "@/data/dummyFilms";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeOverlay = () => {
    setSelectedFilm(null);
  };

  // Split films into sections
  const featuredFilms = dummyFilms.slice(0, 6);
  const newReleases = dummyFilms.slice(3, 9);
  const curatedPicks = dummyFilms.slice(6, 12);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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

export default Index;
