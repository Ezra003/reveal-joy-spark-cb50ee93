import { Heart, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SetupScreenProps {
  babyName: string;
  setBabyName: (name: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  selectedGender: 'boy' | 'girl' | null;
  setSelectedGender: (gender: 'boy' | 'girl') => void;
  enableVoting: boolean;
  setEnableVoting: (enable: boolean) => void;
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
  onContinue
}: SetupScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card/70 dark:bg-card/40 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in backdrop-blur-md border border-border/50">
        {/* Progress Stepper */}
        <div className="flex justify-between mb-8 px-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">1</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Setup</span>
          </div>
          <div className="flex-1 h-px bg-border/50 mt-4 mx-2" />
          <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs border border-border">2</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Voting</span>
          </div>
          <div className="flex-1 h-px bg-border/50 mt-4 mx-2" />
          <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs border border-border">3</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reveal</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-card-foreground mb-2 bg-gradient-to-r from-primary via-accent to-boy-primary bg-clip-text text-transparent">Gender Reveal</h1>
          <p className="text-muted-foreground font-medium">Create your magical moment!</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1">
                Baby Name
              </label>
              <Input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="Optional..."
                className="bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1">
                Due Date
              </label>
              <Input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Expected..."
                className="bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 ml-1">
              Select Gender
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedGender('boy')}
                className={`flex flex-col items-center py-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg relative overflow-hidden group ${
                  selectedGender === 'boy'
                    ? 'bg-gradient-to-br from-[hsl(var(--boy-primary))] to-[hsl(var(--boy-secondary))] text-white ring-2 ring-[hsl(var(--boy-light))] shadow-xl shadow-boy-primary/30'
                    : 'bg-background/40 hover:bg-background/60 text-foreground border border-border/50'
                }`}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">👶‍♂️</div>
                <div className="font-bold text-sm tracking-widest uppercase">Boy</div>
                {selectedGender === 'boy' && (
                  <div className="absolute inset-0 animate-pulse bg-white/10"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedGender('girl')}
                className={`flex flex-col items-center py-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg relative overflow-hidden group ${
                  selectedGender === 'girl'
                    ? 'bg-gradient-to-br from-[hsl(var(--girl-primary))] to-[hsl(var(--girl-secondary))] text-white ring-2 ring-[hsl(var(--girl-light))] shadow-xl shadow-girl-primary/30'
                    : 'bg-background/40 hover:bg-background/60 text-foreground border border-border/50'
                }`}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">👶‍♀️</div>
                <div className="font-bold text-sm tracking-widest uppercase">Girl</div>
                {selectedGender === 'girl' && (
                  <div className="absolute inset-0 animate-pulse bg-white/10"></div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-accent/5 rounded-2xl border border-border/50 group cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setEnableVoting(!enableVoting)}>
            <Checkbox
              id="voting"
              checked={enableVoting}
              onCheckedChange={(checked) => setEnableVoting(checked === true)}
              className="rounded-md border-primary/50 data-[state=checked]:bg-primary"
            />
            <label htmlFor="voting" className="text-sm font-semibold text-card-foreground flex items-center gap-2 cursor-pointer flex-1">
              <Users className="w-4 h-4 text-primary" />
              Enable Guest Voting
            </label>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-white font-bold py-7 text-lg rounded-2xl transition-all transform hover:-translate-y-1"
            size="lg"
          >
            Create Reveal
          </Button>
        </div>
      </div>
    </div>
  );
};
