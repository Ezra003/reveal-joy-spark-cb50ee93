import { Heart, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SetupScreenProps {
  babyName: string;
  setBabyName: (name: string) => void;
  selectedGender: 'boy' | 'girl' | null;
  setSelectedGender: (gender: 'boy' | 'girl') => void;
  enableVoting: boolean;
  setEnableVoting: (enable: boolean) => void;
  onContinue: () => void;
}

export const SetupScreen = ({
  babyName,
  setBabyName,
  selectedGender,
  setSelectedGender,
  enableVoting,
  setEnableVoting,
  onContinue
}: SetupScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--neutral-gradient-start))] via-[hsl(var(--neutral-gradient-mid))] to-[hsl(var(--neutral-gradient-end))] flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in backdrop-blur-sm border border-border/50">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <h1 className="text-3xl font-bold text-card-foreground mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Gender Reveal Setup</h1>
          <p className="text-muted-foreground">Prepare your magical moment!</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Baby's Name (Optional)
            </label>
            <Input
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Enter baby's name..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Select Gender
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedGender('boy')}
                className={`font-bold py-6 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg relative overflow-hidden ${
                  selectedGender === 'boy'
                    ? 'bg-gradient-to-br from-[hsl(var(--boy-primary))] to-[hsl(var(--boy-secondary))] text-white ring-4 ring-[hsl(var(--boy-light))] shadow-2xl shadow-[hsl(var(--boy-primary))]/30'
                    : 'bg-gradient-to-br from-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-light))] text-white hover:from-[hsl(var(--boy-primary))] hover:to-[hsl(var(--boy-secondary))] active:scale-95'
                }`}
              >
                <div className="text-4xl mb-2 transform transition-transform hover:scale-110">👶</div>
                <div className="relative z-10">Boy</div>
                {selectedGender === 'boy' && (
                  <div className="absolute inset-0 animate-pulse bg-white/10"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedGender('girl')}
                className={`font-bold py-6 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg relative overflow-hidden ${
                  selectedGender === 'girl'
                    ? 'bg-gradient-to-br from-[hsl(var(--girl-primary))] to-[hsl(var(--girl-secondary))] text-white ring-4 ring-[hsl(var(--girl-light))] shadow-2xl shadow-[hsl(var(--girl-primary))]/30'
                    : 'bg-gradient-to-br from-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-light))] text-white hover:from-[hsl(var(--girl-primary))] hover:to-[hsl(var(--girl-secondary))] active:scale-95'
                }`}
              >
                <div className="text-4xl mb-2 transform transition-transform hover:scale-110">👶</div>
                <div className="relative z-10">Girl</div>
                {selectedGender === 'girl' && (
                  <div className="absolute inset-0 animate-pulse bg-white/10"></div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
            <Checkbox
              id="voting"
              checked={enableVoting}
              onCheckedChange={(checked) => setEnableVoting(checked === true)}
            />
            <label htmlFor="voting" className="text-sm font-medium text-card-foreground flex items-center gap-2 cursor-pointer">
              <Users className="w-4 h-4" />
              Enable Guest Voting
            </label>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold py-6 text-lg"
            size="lg"
          >
            Continue to Reveal
          </Button>
        </div>
      </div>
    </div>
  );
};
