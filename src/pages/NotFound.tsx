import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Home } from "lucide-react";
import { BackgroundParticles } from "@/components/BackgroundParticles";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundParticles />
      
      <div className="bg-card/70 dark:bg-card/40 rounded-3xl shadow-2xl p-12 max-w-md w-full animate-fade-in backdrop-blur-md border border-border/50 text-center relative z-10">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-6xl font-black text-card-foreground mb-4 bg-gradient-to-r from-primary via-accent to-boy-primary bg-clip-text text-transparent">404</h1>
        
        <p className="text-2xl font-bold text-card-foreground mb-4">Whoops! Page lost in the nursery.</p>
        
        <p className="text-muted-foreground font-medium mb-8">
          The link you followed might be broken, or the baby took the page for a nap!
        </p>
        
        <Button
          asChild
          className="w-full bg-gradient-to-r from-primary to-accent py-8 rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-1"
        >
          <a href="/">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
