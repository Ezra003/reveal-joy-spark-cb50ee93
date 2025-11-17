import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RevealScreenProps {
  gender: 'boy' | 'girl';
  babyName: string;
  votes: { boy: number; girl: number };
  enableVoting: boolean;
  isHost: boolean;
  onReset: () => void;
}

export const RevealScreen = ({
  gender,
  babyName,
  votes,
  enableVoting,
  isHost,
  onReset
}: RevealScreenProps) => {
  const isBoy = gender === 'boy';
  
  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${
        isBoy 
          ? 'bg-gradient-to-br from-[hsl(var(--boy-primary))] via-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-light))]' 
          : 'bg-gradient-to-br from-[hsl(var(--girl-primary))] via-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-light))]'
      }`}
    >
      <div className="text-center animate-fade-in">
        <PartyPopper className="w-24 h-24 mx-auto mb-6 text-white animate-bounce drop-shadow-2xl" />
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl animate-scale-in">
          It's a {isBoy ? 'Boy!' : 'Girl!'}
        </h1>
        {babyName && (
          <p className="text-3xl md:text-5xl text-white font-semibold mb-8 drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Welcome {babyName}!
          </p>
        )}
        <div className="text-8xl mb-8 animate-bounce drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
          {isBoy ? '💙' : '💗'}
        </div>
        
        {enableVoting && votes.boy + votes.girl > 0 && (
          <div className="bg-white bg-opacity-90 rounded-2xl p-6 mb-6 max-w-md mx-auto">
            <h3 className="font-bold text-card-foreground mb-3">Final Results:</h3>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-3xl font-bold text-[hsl(var(--boy-primary))]">{votes.boy}</div>
                <div className="text-sm text-muted-foreground">Team Boy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[hsl(var(--girl-primary))]">{votes.girl}</div>
                <div className="text-sm text-muted-foreground">Team Girl</div>
              </div>
            </div>
          </div>
        )}

        {isHost && (
          <Button
            onClick={onReset}
            variant="secondary"
            className="bg-white text-card-foreground px-8 py-6 text-lg font-bold hover:bg-white/90 shadow-xl transform hover:scale-105"
            size="lg"
          >
            Start Over
          </Button>
        )}
      </div>
    </div>
  );
};
