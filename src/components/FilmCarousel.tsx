import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Film } from "@/data/dummyFilms";
import { useWatchlist } from "@/hooks/useWatchlist";

interface FilmCarouselProps {
  films: Film[];
  onFilmClick: (film: Film) => void;
  title?: string;
  subtitle?: string;
}

const FilmCarousel = ({ films, onFilmClick, title, subtitle }: FilmCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleWatchlistToggle = (e: React.MouseEvent, film: Film) => {
    e.stopPropagation();
    if (isInWatchlist(film.id)) {
      removeFromWatchlist(film.id);
    } else {
      addToWatchlist(film);
    }
  };

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 border border-foreground/30 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "hover:bg-foreground hover:text-background"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 border border-foreground/30 flex items-center justify-center transition-all ${
                canScrollRight
                  ? "hover:bg-foreground hover:text-background"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {films.map((film, index) => {
          const inWatchlist = isInWatchlist(film.id);
          return (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer flex-shrink-0 w-[300px] md:w-[400px] relative"
              onClick={() => onFilmClick(film)}
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-4">
                <img
                  src={film.thumbnail}
                  alt={film.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300" />
                
                {/* Watchlist Button */}
                <button
                  onClick={(e) => handleWatchlistToggle(e, film)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                    inWatchlist
                      ? 'bg-foreground text-background'
                      : 'bg-background/50 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100'
                  }`}
                  title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {inWatchlist ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium group-hover:opacity-70 transition-opacity">
                  {film.title}
                </h3>
                <p className="text-sm text-foreground/50">
                  {film.director} • {film.year}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FilmCarousel;
