import { useState } from "react";
import { X, Play, ArrowLeft } from "lucide-react";
import { Film, dummyFilms } from "@/data/dummyFilms";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilmDetailOverlayProps {
  film: Film;
  onClose: () => void;
  onSelectFilm?: (film: Film) => void;
}

const FilmDetailOverlay = ({ film, onClose, onSelectFilm }: FilmDetailOverlayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Get related films (excluding current film)
  const relatedFilms = dummyFilms.filter(f => f.id !== film.id).slice(0, 8);

  const handleSelectRelatedFilm = (selectedFilm: Film) => {
    setIsPlaying(false);
    if (onSelectFilm) {
      onSelectFilm(selectedFilm);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Close button - fixed position with proper z-index */}
      <button
        onClick={onClose}
        className="fixed top-6 left-6 z-[60] flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors bg-background/50 backdrop-blur-sm px-3 py-2 rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm uppercase tracking-widest">Back</span>
      </button>

      {isPlaying ? (
        /* Video Player Mode - Full screen */
        <div className="w-full h-full flex items-center justify-center bg-black">
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/50 backdrop-blur-sm rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          <iframe
            src={`${film.videoUrl}?autoplay=1`}
            title={film.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        /* Film Detail Mode - Two column layout */
        <div className="flex h-full">
          {/* Left Column - Main Content */}
          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full">
              <div className="pb-12">
                {/* Hero Section with Video Preview */}
                <div className="relative aspect-video w-full">
                  <img
                    src={film.thumbnail}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-foreground/50 flex items-center justify-center group-hover:border-foreground group-hover:bg-foreground transition-all duration-300">
                      <Play className="h-8 w-8 md:h-10 md:w-10 text-foreground group-hover:text-background transition-colors fill-current ml-1" />
                    </div>
                  </button>
                </div>

                {/* Content Section */}
                <div className="px-6 lg:px-12 pt-8">
                  {/* Title Section - with proper top margin */}
                  <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                      {film.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
                      <span>{film.year}</span>
                      <span>•</span>
                      <span>{film.duration}</span>
                      <span>•</span>
                      <span>{film.category}</span>
                      {film.country && (
                        <>
                          <span>•</span>
                          <span>{film.country}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-10">
                    <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl">
                      {film.description}
                    </p>
                  </div>

                  {/* Characteristics Tags */}
                  <div className="mb-10">
                    <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                      Characteristics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {film.characteristics.map((char) => (
                        <span
                          key={char}
                          className="px-4 py-2 border border-foreground/30 text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors cursor-default"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Awards Section */}
                  {film.awards && film.awards.length > 0 && (
                    <div className="mb-10">
                      <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                        Awards & Recognition
                      </p>
                      <div className="space-y-2">
                        {film.awards.map((award, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
                            <span className="text-foreground/70">{award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Director Section */}
                  <div className="mb-10 p-6 border border-foreground/20 rounded-lg">
                    <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                      Director
                    </p>
                    <div className="flex gap-6">
                      <img
                        src={film.directorImage}
                        alt={film.director}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{film.director}</h3>
                        <p className="text-foreground/70 leading-relaxed">
                          {film.directorBio}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cast & Crew */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {film.cast && film.cast.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                          Cast
                        </p>
                        <div className="space-y-1">
                          {film.cast.map((actor, index) => (
                            <p key={index} className="text-foreground/70">{actor}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                        Technical Details
                      </p>
                      <div className="space-y-2 text-foreground/70">
                        {film.cinematographer && (
                          <p><span className="text-foreground/50">Cinematographer:</span> {film.cinematographer}</p>
                        )}
                        {film.language && (
                          <p><span className="text-foreground/50">Language:</span> {film.language}</p>
                        )}
                        <p><span className="text-foreground/50">Runtime:</span> {film.duration}</p>
                        <p><span className="text-foreground/50">Release Year:</span> {film.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Paragraph */}
                  <div className="mb-10 max-w-3xl">
                    <p className="text-foreground/60 leading-relaxed">
                      This film resonates because it reflects life as it is: honest, emotional, and deeply human.
                      Leaning on the beauty of natural light and a naturalistic shooting style, audiences are
                      transported to the story's emotional core. The director's vision creates an immersive
                      experience that lingers long after the credits roll, inviting viewers to reflect on their
                      own experiences and connections.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - More Videos Sidebar */}
          <div className="hidden lg:block w-80 xl:w-96 border-l border-foreground/10 bg-background/50">
            <ScrollArea className="h-full">
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-6">
                  More Films
                </p>
                <div className="space-y-4">
                  {relatedFilms.map((relatedFilm) => (
                    <button
                      key={relatedFilm.id}
                      onClick={() => handleSelectRelatedFilm(relatedFilm)}
                      className="w-full group text-left"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded mb-2">
                        <img
                          src={relatedFilm.thumbnail}
                          alt={relatedFilm.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <h4 className="font-medium text-sm group-hover:text-foreground/80 transition-colors line-clamp-1">
                        {relatedFilm.title}
                      </h4>
                      <p className="text-xs text-foreground/50">
                        {relatedFilm.director} • {relatedFilm.year}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmDetailOverlay;
