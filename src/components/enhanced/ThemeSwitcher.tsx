import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Palette, Sun, Waves, History, Zap } from 'lucide-react';

export type ThemeType = 'default' | 'sunset' | 'ocean' | 'vintage' | 'modern';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const ThemeSwitcher = ({ currentTheme, onThemeChange }: ThemeSwitcherProps) => {
  const themes: { id: ThemeType; label: string; icon: any; colors: string[] }[] = [
    { 
      id: 'default', 
      label: 'Classic', 
      icon: Palette, 
      colors: ['bg-[hsl(280,70%,65%)]', 'bg-[hsl(45,90%,60%)]', 'bg-[hsl(175,60%,55%)]'] 
    },
    { 
      id: 'sunset', 
      label: 'Sunset', 
      icon: Sun, 
      colors: ['bg-[hsl(25,90%,65%)]', 'bg-[hsl(350,80%,60%)]', 'bg-[hsl(50,100%,65%)]'] 
    },
    { 
      id: 'ocean', 
      label: 'Ocean', 
      icon: Waves, 
      colors: ['bg-[hsl(195,90%,50%)]', 'bg-[hsl(220,80%,55%)]', 'bg-[hsl(170,80%,45%)]'] 
    },
    { 
      id: 'vintage', 
      label: 'Vintage', 
      icon: History, 
      colors: ['bg-[hsl(30,40%,60%)]', 'bg-[hsl(150,25%,55%)]', 'bg-[hsl(40,50%,70%)]'] 
    },
    { 
      id: 'modern', 
      label: 'Modern', 
      icon: Zap, 
      colors: ['bg-[hsl(260,85%,60%)]', 'bg-[hsl(280,70%,50%)]', 'bg-[hsl(190,90%,55%)]'] 
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-5 h-5 text-primary" />
        <span className="font-display font-bold text-card-foreground">App Identity & Colors</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant="outline"
            onClick={() => onThemeChange(theme.id)}
            className={cn(
              "h-auto py-4 flex flex-col gap-3 transition-all duration-300 rounded-2xl border-2 hover:bg-muted/50",
              currentTheme === theme.id 
                ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                : "border-border/50 bg-background/50"
            )}
          >
            <div className="relative group">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner",
                currentTheme === theme.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                <theme.icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="space-y-2 text-center">
              <span className="text-xs font-display font-black uppercase tracking-widest leading-none">
                {theme.label}
              </span>
              <div className="flex justify-center -space-x-1.5 pt-1">
                {theme.colors.map((color, i) => (
                  <div 
                    key={i} 
                    className={cn("w-3 h-3 rounded-full border border-white/20 shadow-sm", color)} 
                  />
                ))}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
