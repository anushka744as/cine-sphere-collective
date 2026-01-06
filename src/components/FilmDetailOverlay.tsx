import { useState } from "react";
import { X, Play, ArrowLeft } from "lucide-react";
import { Film } from "@/data/dummyFilms";

interface FilmDetailOverlayProps {
  film: Film;
  onClose: () => void;
}

const FilmDetailOverlay = ({ film, onClose }: FilmDetailOverlayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm uppercase tracking-widest">Back</span>
      </button>

      {isPlaying ? (
        /* Video Player Mode */
        <div className="w-full h-full flex items-center justify-center bg-black">
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <iframe
            src={`${film.videoUrl}?autoplay=1`}
            title={film.title}
            className="w-full h-full max-w-[90vw] max-h-[90vh] aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        /* Film Detail Mode */
        <div className="relative w-full h-full overflow-hidden">
          {/* Background Image */}
          <img
            src={film.thumbnail}
            alt={film.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Details */}
                <div className="max-w-xl">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none">
                    {film.title}
                  </h1>

                  {/* Two column description layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <p className="text-foreground/70 leading-relaxed">
                      {film.description}
                    </p>
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      This film resonates because it reflects life as it is: honest, emotional, and deeply human. 
                      Leaning on the beauty of natural light and a naturalistic shooting style, audiences are 
                      transported to the story's emotional core.
                    </p>
                  </div>

                  {/* Characteristics */}
                  <div className="mb-10">
                    <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                      Characteristics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {film.characteristics.map((char) => (
                        <span
                          key={char}
                          className="px-4 py-2 border border-foreground/30 text-xs uppercase tracking-wider"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-8 text-sm text-foreground/60">
                    <span>Directed by {film.director}</span>
                    <span>{film.year}</span>
                    <span>{film.duration}</span>
                  </div>
                </div>

                {/* Right Column - Play Button */}
                <div className="flex items-center justify-center lg:justify-end">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-foreground/30 flex items-center justify-center hover:border-foreground hover:bg-foreground transition-all duration-300"
                  >
                    <Play className="h-12 w-12 md:h-16 md:w-16 text-foreground group-hover:text-background transition-colors fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmDetailOverlay;
