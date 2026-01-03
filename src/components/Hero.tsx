import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-background">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
          poster="/placeholder.svg"
        >
          <source src="/videos/hero-section.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-none">
          Share Your
          <br />
          Films
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 mb-12 max-w-xl mx-auto leading-relaxed">
          A free platform where anyone can showcase their YouTube films and movies.
          Discover amazing content from creators worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8"
            onClick={() => navigate('/browse')}
          >
            Start Exploring
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-foreground/20 hover:bg-foreground/10 px-8"
            onClick={() => navigate('/about')}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
