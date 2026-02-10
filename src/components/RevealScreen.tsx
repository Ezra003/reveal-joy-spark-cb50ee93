import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RevealScreenProps {
  gender: 'boy' | 'girl';
  babyName: string;
  dueDate?: string;
  votes: { boy: number; girl: number };
  enableVoting: boolean;
  isHost: boolean;
  onReset: () => void;
}

export const RevealScreen = ({
  gender,
  babyName,
  dueDate,
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
      <div className="text-center animate-scale-in max-w-2xl px-4">
        <PartyPopper className="w-24 h-24 mx-auto mb-6 text-white animate-bounce drop-shadow-2xl" />
        
        <h1 className="text-7xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter">
          It's a {isBoy ? 'Boy!' : 'Girl!'}
        </h1>
        
        {babyName && (
          <p className="text-4xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Welcome {babyName}!
          </p>
        )}

        {dueDate && (
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Arriving {dueDate}
          </p>
        )}

        <div className="text-9xl mb-10 animate-bounce drop-shadow-2xl" style={{ animationDelay: '0.7s' }}>
          {isBoy ? '💙' : '💗'}
        </div>
        
        {enableVoting && votes.boy + votes.girl > 0 && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 max-w-md mx-auto border border-white/30 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-sm">Final Votes</h3>
            <div className="flex justify-around text-center">
              <div className="group">
                <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{votes.boy}</div>
                <div className="text-xs font-bold text-white/80 uppercase mt-1">Team Boy</div>
              </div>
              <div className="w-px h-12 bg-white/20 mx-2" />
              <div className="group">
                <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{votes.girl}</div>
                <div className="text-xs font-bold text-white/80 uppercase mt-1">Team Girl</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '1.1s' }}>
          {isHost && (
            <Button
              onClick={onReset}
              variant="secondary"
              className="bg-white text-card-foreground px-10 py-8 text-xl font-black hover:bg-white/90 shadow-2xl transition-all transform hover:scale-105 rounded-2xl min-w-[200px]"
              size="lg"
            >
              Start Over
            </Button>
          )}
          
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="bg-white/10 text-white border-white/40 px-10 py-8 text-xl font-black hover:bg-white/20 shadow-2xl transition-all transform hover:scale-105 rounded-2xl min-w-[200px] backdrop-blur-sm"
            size="lg"
          >
            Save Result
          </Button>
        </div>
      </div>
    </div>
  );
};
