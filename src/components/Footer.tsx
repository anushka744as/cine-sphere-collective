import { Film, Github, Twitter, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
              <Film className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold gradient-text">CineSphere</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Free platform for filmmakers to showcase their YouTube films and movies to the world.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Explore</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <button onClick={() => handleNavigation('/')} className="hover:text-primary transition-colors text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/featured')} className="hover:text-primary transition-colors text-left">
                  Featured Films
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/movies')} className="hover:text-primary transition-colors text-left">
                  All Films
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Community</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <button onClick={() => handleNavigation('/dashboard')} className="hover:text-primary transition-colors text-left">
                  Submit Film
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/about')} className="hover:text-primary transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/auth')} className="hover:text-primary transition-colors text-left">
                  Sign In / Sign Up
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h3>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              <p>© 2025 CineSphere</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            Made with ❤️ for filmmakers and cinema lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
