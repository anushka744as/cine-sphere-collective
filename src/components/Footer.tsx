import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div
              className="flex items-center gap-4 cursor-pointer mb-4"
              onClick={() => handleNavigation('/')}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 shadow-lg">
                <img
                  src="/logo.png"
                  alt="Mushroom Studios"
                  className="h-full w-full rounded-full object-contain"
                  aria-hidden="true"
                />
              </span>
              <div>
                <div className="text-xl font-bold tracking-tight">Mushroom Studios</div>
                <p className="text-xs uppercase tracking-wide text-foreground/50">Free film showcase</p>
              </div>
            </div>
            <p className="text-sm text-foreground/50 leading-relaxed">
              Free platform for filmmakers to showcase their YouTube films.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-foreground/50 mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/featured')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Featured
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/movies')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  All Films
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-foreground/50 mb-6">Community</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Submit Film
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/auth')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-foreground/50 mb-6">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/privacy')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/terms')}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/40">
            © 2026 Mushroom Studios. All rights reserved.
          </p>
          <p className="text-sm text-foreground/40">
            Made for filmmakers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
