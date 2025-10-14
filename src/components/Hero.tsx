import { Play, Info, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video with Overlay - Brighter and More Visible */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-125 saturate-110"
          poster="/placeholder.svg"
          style={{ filter: 'brightness(1.3) saturate(1.1) contrast(1.05)' }}
        >
          <source src="/videos/hero-section.mp4" type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          Your browser does not support the video tag.
        </video>
        {/* Lighter overlay for more video visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-background/20" />
        
        {/* 3D Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-primary/20"
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Film className="w-24 h-24" style={{ transform: 'rotateY(25deg)' }} />
          </motion.div>
          
          <motion.div
            className="absolute top-40 right-20 text-secondary/20"
            animate={{ 
              y: [0, 40, 0],
              rotate: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotateX(25deg)' }}>
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </motion.div>
          
          <motion.div
            className="absolute bottom-32 left-1/4 text-primary/15"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotateZ(45deg)' }}>
              <circle cx="12" cy="12" r="10" opacity="0.5"/>
              <circle cx="12" cy="12" r="6" opacity="0.8"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Share Your
            <span className="block gradient-text">Films</span>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A free platform where anyone can showcase their YouTube films and movies.
            Share your creativity, discover amazing content, and connect with cinema lovers worldwide.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform w-full sm:w-auto"
              onClick={() => navigate('/browse')}
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start Exploring
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass backdrop-blur-md hover:scale-105 transition-transform w-full sm:w-auto"
              onClick={() => navigate('/about')}
            >
              <Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
