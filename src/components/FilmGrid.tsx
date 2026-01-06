import { Film } from "@/data/dummyFilms";

interface FilmGridProps {
  films: Film[];
  onFilmClick: (film: Film) => void;
  title?: string;
  subtitle?: string;
}

const FilmGrid = ({ films, onFilmClick, title, subtitle }: FilmGridProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 lg:px-12">
        {(title || subtitle) && (
          <div className="mb-12">
            {subtitle && (
              <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {films.map((film, index) => (
            <div
              key={film.id}
              className="group cursor-pointer"
              onClick={() => onFilmClick(film)}
            >
              {/* Number and Title */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-foreground/40 text-sm font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium group-hover:opacity-70 transition-opacity">
                    {film.title}
                  </h3>
                  <p className="text-sm text-foreground/50">
                    Directed by {film.director}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={film.thumbnail}
                  alt={film.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmGrid;
