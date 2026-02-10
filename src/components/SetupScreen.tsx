import { useState } from 'react';
import { Heart, Users, Calendar, Sparkles, Baby } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import { sanitizeInput } from '@/lib/sanitize';
import { ThemeSwitcher, ThemeType } from './enhanced/ThemeSwitcher';

interface SetupScreenProps {
  babyName: string;
  setBabyName: (name: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  selectedGender: 'boy' | 'girl' | null;
  setSelectedGender: (gender: 'boy' | 'girl') => void;
  enableVoting: boolean;
  setEnableVoting: (enable: boolean) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  revealMode: 'classic' | 'balloon' | 'box';
  setRevealMode: (mode: 'classic' | 'balloon' | 'box') => void;
  onContinue: () => void;
}

export const SetupScreen = ({
  babyName,
  setBabyName,
  dueDate,
  setDueDate,
  selectedGender,
  setSelectedGender,
  enableVoting,
  setEnableVoting,
  onContinue,
  theme,
  setTheme,
  revealMode,
  setRevealMode
}: SetupScreenProps) => {
  const [step, setStep] = useState(1);
  const [babyNameFocused, setBabyNameFocused] = useState(false);
  const [dueDateFocused, setDueDateFocused] = useState(false);
  const haptic = useHaptic();

  const handleGenderSelect = (gender: 'boy' | 'girl') => {
    haptic.medium();
    setSelectedGender(gender);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-neutral animate-fade-in">
      <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in border border-white/20">
        
        {/* Animated Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-float">
              <Baby className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold text-card-foreground mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Gender Reveal
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Create your magical moment! ✨
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-10 px-2">
          <StepIndicator number={1} label="Setup" active />
          <StepLine />
          <StepIndicator number={2} label="Voting" />
          <StepLine />
          <StepIndicator number={3} label="Reveal" />
        </div>

        <div className="space-y-6">
          {/* Baby Name Input */}
          <div className="relative">
            <label 
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none font-body font-medium",
                babyNameFocused || babyName
                  ? "text-xs -top-2 bg-card px-2 text-primary"
                  : "top-4 text-muted-foreground"
              )}
            >
              Baby Name (Optional)
            </label>
            <Input
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(sanitizeInput(e.target.value))}
              onFocus={() => setBabyNameFocused(true)}
              onBlur={() => setBabyNameFocused(false)}
              className="h-14 px-4 bg-background/50 border-2 border-border/50 focus:border-primary/50 transition-all rounded-xl font-body"
              maxLength={50}
            />
            {babyName && (
              <span className="absolute right-4 bottom-4 text-xs text-muted-foreground">
                {babyName.length}/50
              </span>
            )}
          </div>

          {/* Due Date Input */}
          <div className="relative">
            <label 
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none font-body font-medium",
                babyNameFocused || dueDateFocused || dueDate
                  ? "text-xs -top-2 bg-card px-2 text-primary"
                  : "top-4 text-muted-foreground"
              )}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Due Date (Optional)
            </label>
            <Input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(sanitizeInput(e.target.value))}
              onFocus={() => setDueDateFocused(true)}
              onBlur={() => setDueDateFocused(false)}
              placeholder="e.g., June 2026"
              className="h-14 px-4 pl-4 bg-background/50 border-2 border-border/50 focus:border-primary/50 transition-all rounded-xl font-body"
              maxLength={100}
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-body font-semibold text-muted-foreground uppercase tracking-wider mb-4 ml-1">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Select Gender *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Boy Card */}
              <GenderCard
                gender="boy"
                selected={selectedGender === 'boy'}
                onClick={() => handleGenderSelect('boy')}
                emoji="👶♂️"
                label="Boy"
              />

              {/* Girl Card */}
              <GenderCard
                gender="girl"
                selected={selectedGender === 'girl'}
                onClick={() => handleGenderSelect('girl')}
                emoji="👶♀️"
                label="Girl"
              />
            </div>
          </div>

          {/* Enable Voting Toggle */}
          <div 
            className="flex items-center space-x-3 p-5 bg-accent/5 rounded-2xl border-2 border-accent/20 group cursor-pointer hover:bg-accent/10 hover:border-accent/30 transition-all interactive"
            onClick={() => {
              setEnableVoting(!enableVoting);
              haptic.light();
            }}
          >
            <Checkbox
              id="voting"
              checked={enableVoting}
              onCheckedChange={(checked) => setEnableVoting(checked === true)}
              className="rounded-lg border-2 border-accent/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent h-6 w-6"
            />
            <label 
              htmlFor="voting" 
              className="text-base font-body font-semibold text-card-foreground flex items-center gap-2 cursor-pointer flex-1"
            >
              <Users className="w-5 h-5 text-accent" />
              Enable Guest Voting
            </label>
          </div>

          {/* Reveal Content (Step 4 Selection) */}
          <div className="space-y-6">
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
                
                <div className="space-y-4 pt-6 mt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-display font-bold text-card-foreground">Reveal Animation</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'classic', label: 'Classic Countdown', emoji: '⏱️' },
                      { id: 'balloon', label: 'Balloon Pop', emoji: '🎈' },
                      { id: 'box', label: 'Magic Box', emoji: '📦' }
                    ].map((mode) => (
                      <Button
                        key={mode.id}
                        variant="outline"
                        onClick={() => setRevealMode(mode.id as any)}
                        className={cn(
                          "h-auto py-4 flex flex-col gap-2 rounded-2xl border-2 transition-all",
                          revealMode === mode.id ? "border-primary bg-primary/5" : "border-border/50"
                        )}
                      >
                        <span className="text-2xl">{mode.emoji}</span>
                        <span className="text-[10px] font-display font-black uppercase tracking-widest">{mode.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <Button
              onClick={() => {
                if (step < 4) {
                  setStep(step + 1);
                  haptic.medium();
                } else {
                  onContinue();
                }
              }}
              disabled={step === 2 && !selectedGender}
              className="w-full h-16 bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 text-white font-display font-bold text-xl rounded-2xl transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              size="lg"
            >
              {step < 4 ? 'Next Step' : (enableVoting ? 'Create Reveal & Share' : 'Start Countdown')} 🎉
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const StepIndicator = ({ 
  number, 
  label, 
  active = false 
}: { 
  number: number; 
  label: string; 
  active?: boolean;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300",
      active
        ? "bg-primary text-white shadow-lg scale-110"
        : "bg-muted/50 text-muted-foreground border-2 border-border"
    )}>
      {number}
    </div>
    <span className={cn(
      "text-[10px] font-display font-black uppercase tracking-widest",
      active ? "text-primary" : "text-muted-foreground"
    )}>
      {label}
    </span>
  </div>
);

const StepLine = () => (
  <div className="flex-1 h-px bg-border/50 mt-5 mx-1" />
);

const GenderCard = ({
  gender,
  selected,
  onClick,
  emoji,
  label
}: {
  gender: 'boy' | 'girl';
  selected: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) => {
  const colors = gender === 'boy'
    ? {
        gradient: 'from-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-primary))]',
        ring: 'ring-[hsl(var(--boy-light))]',
        shadow: 'shadow-boy-primary/30'
      }
    : {
        gradient: 'from-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-primary))]',
        ring: 'ring-[hsl(var(--girl-light))]',
        shadow: 'shadow-girl-primary/30'
      };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center py-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden group interactive",
        selected
          ? `bg-gradient-to-br ${colors.gradient} text-white ring-4 ${colors.ring} shadow-2xl ${colors.shadow}`
          : "bg-background/40 hover:bg-background/60 text-foreground border-2 border-border/50 hover:border-border"
      )}
    >
      <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-125">
        {emoji}
      </div>
      <div className="font-display font-bold text-base tracking-widest uppercase">
        {label}
      </div>
      
      {selected && (
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
      )}
      
      {/* Preview hint */}
      {!selected && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
      )}
    </button>
  );
};
