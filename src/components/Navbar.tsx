import { useState } from "react";
import { Film, Search, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    if (!confirm("Are you sure you want to sign out?")) {
      return;
    }
    
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 z-50">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold gradient-text">CineSphere</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="/" 
              className={`relative transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
              )}
            </a>
                <a 
                  href="/featured" 
                  className={`relative transition-colors ${
                    location.pathname === '/featured' 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Featured
                  {location.pathname === '/featured' && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </a>
                <a
                  href="/movies"
                  className={`relative transition-colors ${
                    location.pathname === '/movies' 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Films
                  {location.pathname === '/movies' && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </a>
            <a 
              href="/about" 
              className={`relative transition-colors ${
                location.pathname === '/about' 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              About
              {location.pathname === '/about' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
              )}
            </a>
          </div>

          {/* Desktop Right side actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="text-foreground hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="glass"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="glass"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'hover:bg-accent'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('/featured')}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/featured' 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'hover:bg-accent'
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => handleNavigation('/movies')}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/movies' 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'hover:bg-accent'
                  }`}
                >
                  Films
                </button>
                <button
                  onClick={() => handleNavigation('/about')}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/about' 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'hover:bg-accent'
                  }`}
                >
                  About
                </button>
              </div>

              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleNavigation("/dashboard")}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => handleNavigation("/auth")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
