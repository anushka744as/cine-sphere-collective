import { useState, useEffect } from "react";
import { User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-bold tracking-tight text-foreground z-50">
            CINESPHERE
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-10">
            <a 
              href="/" 
              className={`text-sm tracking-wide transition-opacity ${
                isActive('/') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Home
            </a>
            <a 
              href="/featured" 
              className={`text-sm tracking-wide transition-opacity ${
                isActive('/featured') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Featured
            </a>
            <a
              href="/movies"
              className={`text-sm tracking-wide transition-opacity ${
                isActive('/movies') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Films
            </a>
            <a 
              href="/about" 
              className={`text-sm tracking-wide transition-opacity ${
                isActive('/about') ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              About
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
                  className="text-foreground opacity-60 hover:opacity-100"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-foreground/20 hover:bg-foreground hover:text-background"
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
                className="border-foreground/20 hover:bg-foreground hover:text-background"
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
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background z-40 pt-24">
          <div className="container mx-auto px-6 py-8 space-y-6">
            <button
              onClick={() => handleNavigation('/')}
              className={`block w-full text-left text-2xl py-3 ${
                isActive('/') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('/featured')}
              className={`block w-full text-left text-2xl py-3 ${
                isActive('/featured') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => handleNavigation('/movies')}
              className={`block w-full text-left text-2xl py-3 ${
                isActive('/movies') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              Films
            </button>
            <button
              onClick={() => handleNavigation('/about')}
              className={`block w-full text-left text-2xl py-3 ${
                isActive('/about') ? 'opacity-100' : 'opacity-60'
              }`}
            >
              About
            </button>

            <div className="pt-8 border-t border-border space-y-4">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-foreground/20"
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-foreground/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => handleNavigation("/auth")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
