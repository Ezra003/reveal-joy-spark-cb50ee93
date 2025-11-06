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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--neutral-gradient-start))] via-[hsl(var(--neutral-gradient-mid))] to-[hsl(var(--neutral-gradient-end))] flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <Users className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Guess the Gender!</h1>
          <p className="text-muted-foreground">What do you think it will be?</p>
        </div>

        {isHost && (
          <div className="mb-6 p-4 bg-[hsl(var(--boy-light))]/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-[hsl(var(--boy-primary))]" />
              <span className="font-semibold text-card-foreground">Share with Guests</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                onClick={onCopyLink}
                variant="outline"
                className="px-4"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Share this link for guests to vote on their devices!</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onVote('boy')}
            disabled={hasVoted}
            className={`py-8 rounded-xl font-bold text-xl transition-all transform ${
              hasVoted
                ? 'bg-muted cursor-not-allowed text-muted-foreground'
                : 'bg-gradient-to-br from-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-primary))] hover:from-[hsl(var(--boy-primary))] hover:to-[hsl(var(--boy-secondary))] hover:scale-105 shadow-lg text-white'
            }`}
          >
            <div className="text-5xl mb-2">💙</div>
            <div>Team Boy</div>
          </button>
          <button
            onClick={() => onVote('girl')}
            disabled={hasVoted}
            className={`py-8 rounded-xl font-bold text-xl transition-all transform ${
              hasVoted
                ? 'bg-muted cursor-not-allowed text-muted-foreground'
                : 'bg-gradient-to-br from-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-primary))] hover:from-[hsl(var(--girl-primary))] hover:to-[hsl(var(--girl-secondary))] hover:scale-105 shadow-lg text-white'
            }`}
          >
            <div className="text-5xl mb-2">💗</div>
            <div>Team Girl</div>
          </button>
        </div>

        {totalVotes > 0 && (
          <div className="mb-6 p-4 bg-muted rounded-xl">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span className="text-[hsl(var(--boy-primary))]">Boy: {boyPercentage}%</span>
              <span className="text-[hsl(var(--girl-primary))]">Girl: {girlPercentage}%</span>
            </div>
            <div className="flex h-4 bg-background rounded-full overflow-hidden">
              <div
                className="bg-[hsl(var(--boy-primary))] transition-all duration-500"
                style={{ width: `${boyPercentage}%` }}
              />
              <div
                className="bg-[hsl(var(--girl-primary))] transition-all duration-500"
                style={{ width: `${girlPercentage}%` }}
              />
            </div>
            <p className="text-center text-muted-foreground text-sm mt-2">
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast
            </p>
          </div>
        )}

        {isHost && (
          <Button
            onClick={onStartCountdown}
            className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold py-6 text-lg"
            size="lg"
          >
            Ready to Reveal! 🎉
          </Button>
        )}

        {!isHost && (
          <div className="text-center text-muted-foreground text-sm">
            Waiting for host to start the reveal...
          </div>
        )}
      </div>
    </div>
  );
};
