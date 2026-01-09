import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Film } from "@/data/dummyFilms";
interface HeroCarouselProps {
  onFilmClick: (film: Film) => void;
  films: Film[];
}

const HeroCarousel = ({ onFilmClick, films }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use first 5 films for hero
  const heroFilms = films.slice(0, 5);

  const goToNext = useCallback(() => {
    if (isTransitioning || heroFilms.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % heroFilms.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [heroFilms.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || heroFilms.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + heroFilms.length) % heroFilms.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [heroFilms.length, isTransitioning]);

  useEffect(() => {
    if (heroFilms.length === 0) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext, heroFilms.length]);

  if (heroFilms.length === 0) return null;

  const currentFilm = heroFilms[currentIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background Images */}
      {heroFilms.map((film, index) => (
        <div
          key={film.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={film.thumbnail}
            alt={film.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Slide indicator */}
            <p className="text-sm text-foreground/60 mb-4 font-mono">
              {String(currentIndex + 1).padStart(2, "0")}/{String(heroFilms.length).padStart(2, "0")}
            </p>

            {/* Title */}
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
            >
              {currentFilm.title}
            </h1>

            {/* Director */}
            <p
              className={`text-lg md:text-xl text-foreground/70 mb-8 transition-all duration-500 delay-100 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
            >
              Directed by {currentFilm.director}
            </p>

            {/* CTA */}
            <button
              onClick={() => onFilmClick(currentFilm)}
              className={`group inline-flex items-center gap-3 text-foreground border border-foreground/30 px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"
                }`}
            >
              <span className="text-sm uppercase tracking-widest">Watch Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-12 flex gap-4">
        <button
          onClick={goToPrev}
          className="w-12 h-12 border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="w-12 h-12 border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / heroFilms.length) * 100}%` }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
