import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully! You can now sign in.");
      setIsSignUp(false);
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <img
            src="/logo.png"
            alt="Mushroom Studios"
            className="mx-auto mb-4 h-12 w-12 rounded-full object-contain"
          />
          <a href="/" className="text-xl font-bold tracking-tight">
            Mushroom Studios
          </a>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-foreground/50">
              {isSignUp ? 'Sign up to start sharing films' : 'Sign in to your account'}
            </p>
          </div>

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground/70">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="bg-card border-border focus:border-foreground/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-foreground/70">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="bg-card border-border focus:border-foreground/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm text-foreground/70">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="bg-card border-border focus:border-foreground/30"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-foreground text-background hover:bg-foreground/90" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground/70">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="bg-card border-border focus:border-foreground/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-foreground/70">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="bg-card border-border focus:border-foreground/30"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-foreground text-background hover:bg-foreground/90" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-foreground/50 hover:text-foreground transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            
            <div>
              <a href="/" className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
