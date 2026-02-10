import { Users, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VotingScreenProps {
  votes: { boy: number; girl: number };
  hasVoted: boolean;
  onVote: (vote: 'boy' | 'girl') => void;
  isHost: boolean;
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  onStartCountdown: () => void;
}

export const VotingScreen = ({
  votes,
  hasVoted,
  onVote,
  isHost,
  shareUrl,
  copied,
  onCopyLink,
  onStartCountdown
}: VotingScreenProps) => {
  const totalVotes = votes.boy + votes.girl;
  const boyPercentage = totalVotes > 0 ? Math.round((votes.boy / totalVotes) * 100) : 0;
  const girlPercentage = totalVotes > 0 ? Math.round((votes.girl / totalVotes) * 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card/70 dark:bg-card/40 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in backdrop-blur-md border border-border/50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-black text-card-foreground mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Guess the Gender!</h1>
          <p className="text-muted-foreground font-medium tracking-tight">Voter turnout: {totalVotes}</p>
        </div>

        {isHost && (
          <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-boy-primary/10 rounded-2xl border border-primary/20 shadow-inner group transition-all hover:bg-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-bold text-card-foreground tracking-tight">Share with Guests</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 text-sm bg-background/50 border-border/50 rounded-xl"
              />
              <Button
                onClick={onCopyLink}
                className="rounded-xl px-5 transition-all bg-primary hover:bg-primary/90"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-2 uppercase font-black tracking-widest pl-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              LIVE SHARING ACTIVE
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => onVote('boy')}
            disabled={hasVoted}
            className={`flex flex-col items-center py-10 rounded-2xl font-black text-xl transition-all duration-300 transform relative overflow-hidden shadow-lg group ${
              hasVoted
                ? 'bg-muted/50 cursor-not-allowed text-muted-foreground/50 border border-border/20 grayscale-[0.5]'
                : 'bg-gradient-to-br from-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-primary))] text-white hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-boy-primary/30'
            }`}
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💙</div>
            <div className="relative z-10 uppercase tracking-widest text-sm">Team Boy</div>
            {!hasVoted && (
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </button>
          
          <button
            onClick={() => onVote('girl')}
            disabled={hasVoted}
            className={`flex flex-col items-center py-10 rounded-2xl font-black text-xl transition-all duration-300 transform relative overflow-hidden shadow-lg group ${
              hasVoted
                ? 'bg-muted/50 cursor-not-allowed text-muted-foreground/50 border border-border/20 grayscale-[0.5]'
                : 'bg-gradient-to-br from-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-primary))] text-white hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-girl-primary/30'
            }`}
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💗</div>
            <div className="relative z-10 uppercase tracking-widest text-sm">Team Girl</div>
            {!hasVoted && (
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </button>
        </div>

        {totalVotes > 0 && (
          <div className="mb-8 p-6 bg-background/40 backdrop-blur-sm rounded-2xl border border-border/50 shadow-inner">
            <div className="flex justify-between mb-3 text-xs font-black uppercase tracking-widest">
              <span className="text-boy-primary flex items-center gap-1.5 font-black">
               <span className="w-2 h-2 rounded-full bg-boy-primary"></span>
               Boy: {boyPercentage}%
              </span>
              <span className="text-girl-primary flex items-center gap-1.5 font-black">
                Girl: {girlPercentage}%
                <span className="w-2 h-2 rounded-full bg-girl-primary"></span>
              </span>
            </div>
            <div className="flex h-5 bg-muted/50 rounded-full overflow-hidden p-1 border border-border/30 shadow-inner">
              <div
                className="bg-boy-primary transition-all duration-1000 ease-out rounded-full shadow-lg"
                style={{ width: `${boyPercentage}%` }}
              />
              <div
                className="bg-girl-primary transition-all duration-1000 ease-out rounded-full shadow-lg"
                style={{ width: `${girlPercentage}%` }}
              />
            </div>
          </div>
        )}

        {isHost && (
          <Button
            onClick={onStartCountdown}
            className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-xl hover:shadow-primary/20 text-white font-black py-8 text-xl rounded-2xl transition-all transform hover:-translate-y-1"
            size="lg"
          >
            READY TO REVEAL! 🎉
          </Button>
        )}

        {!isHost && (
          <div className="text-center group">
            <p className="text-muted-foreground text-sm font-medium animate-pulse group-hover:text-primary transition-colors">
              Waiting for the host to start the big reveal...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
