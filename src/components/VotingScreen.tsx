import { useState } from 'react';
import { Users, Share2, Copy, Check, QrCode, MessageCircle, Mail, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHaptic } from '@/hooks/useHaptic';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VotingScreenProps {
  votes: { boy: number; girl: number };
  hasVoted: boolean;
  onVote: (vote: 'boy' | 'girl') => void;
  isHost: boolean;
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  onStartCountdown: () => void;
  eventId: string;
}

export const VotingScreen = ({
  votes,
  hasVoted,
  onVote,
  isHost,
  shareUrl,
  copied,
  onCopyLink,
  onStartCountdown,
  eventId
}: VotingScreenProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [votingFor, setVotingFor] = useState<'boy' | 'girl' | null>(null);
  const haptic = useHaptic();

  const totalVotes = votes.boy + votes.girl;
  const boyPercentage = totalVotes > 0 ? Math.round((votes.boy / totalVotes) * 100) : 0;
  const girlPercentage = totalVotes > 0 ? Math.round((votes.girl / totalVotes) * 100) : 0;

  const handleVote = (team: 'boy' | 'girl') => {
    setVotingFor(team);
    haptic.medium();
    storage.trackEngagement(eventId, 'guest_id', `vote_${team}`); // guestId would be managed in session
    setTimeout(() => {
      onVote(team);
      setTimeout(() => setVotingFor(null), 500);
    }, 200);
  };

  const handleRefresh = async () => {
    // Refresh would reload vote data
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const { containerRef, pullProgress, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      storage.trackEngagement(eventId, 'guest_id', 'poll_refresh');
      await handleRefresh();
    },
  });

  const shareOptions = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-500',
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Join my gender reveal party! ${shareUrl}`)}`, '_blank');
      }
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'bg-blue-500',
      onClick: () => {
        window.open(`mailto:?subject=Gender Reveal Party&body=${encodeURIComponent(`You're invited! ${shareUrl}`)}`, '_blank');
      }
    },
    {
      icon: QrCode,
      label: 'QR Code',
      color: 'bg-purple-500',
      onClick: () => {
        // Would open QR code component
        alert('QR Code feature - implement with qrcode.react package');
      }
    },
    {
      icon: LinkIcon,
      label: 'Copy Link',
      color: 'bg-gray-500',
      onClick: onCopyLink
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 gradient-neutral relative overflow-hidden"
    >
      {/* Pull to Refresh Indicator */}
      {pullProgress > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center pt-4 z-50"
          style={{ opacity: pullProgress }}
        >
          <div className={cn(
            "w-8 h-8 rounded-full border-4 border-primary border-t-transparent",
            isRefreshing && "animate-spin"
          )} />
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center animate-float">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-black text-card-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Make Your Guess!
          </h1>
          <p className="text-muted-foreground font-body text-lg flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} so far
          </p>
        </div>

        {/* Share Section (Host Only) */}
        {isHost && (
          <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-2xl border-2 border-primary/20 animate-scale-in group transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-display font-bold text-card-foreground tracking-tight">
                Invite Your Guests
              </span>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 text-sm bg-background/70 border-border/50 rounded-xl font-body"
              />
              <Button
                onClick={onCopyLink}
                className="rounded-xl px-5 transition-all bg-primary hover:bg-primary/90 shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Share Options */}
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full rounded-xl border-2 border-primary/30 hover:bg-primary/10 font-body font-semibold"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  More Share Options
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Share Your Event</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-4">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.label}
                      variant="outline"
                      className={cn(
                        "h-24 flex flex-col gap-2 border-2",
                        option.color.replace('bg-', 'hover:bg-').replace('-500', '-50'),
                        option.color.replace('bg-', 'hover:border-')
                      )}
                      onClick={() => {
                        option.onClick();
                        setShowShareDialog(false);
                      }}
                    >
                      <option.icon className="w-6 h-6" />
                      <span className="font-body font-semibold text-xs">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-2 uppercase font-display font-black tracking-widest pl-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              LIVE SHARING ACTIVE
            </p>
          </div>
        )}

        {/* Voting Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Boy Button */}
          <VoteButton
            team="boy"
            emoji="💙"
            label="Team Boy"
            disabled={hasVoted}
            isVoting={votingFor === 'boy'}
            onClick={() => handleVote('boy')}
          />

          {/* Girl Button */}
          <VoteButton
            team="girl"
            emoji="💗"
            label="Team Girl"
            disabled={hasVoted}
            isVoting={votingFor === 'girl'}
            onClick={() => handleVote('girl')}
          />
        </div>

        {/* Vote Results */}
        {totalVotes > 0 && (
          <div className="mb-8 p-6 bg-background/60 backdrop-blur-sm rounded-2xl border-2 border-border/50 shadow-inner animate-slide-in-bottom">
            <div className="flex justify-between mb-4 text-sm font-display font-black uppercase tracking-widest">
              <div className="flex items-center gap-2 text-[hsl(var(--boy-primary))]">
                <span className="w-3 h-3 rounded-full bg-[hsl(var(--boy-primary))] shadow-lg"></span>
                Boy: {boyPercentage}%
              </div>
              <div className="flex items-center gap-2 text-[hsl(var(--girl-primary))]">
                Girl: {girlPercentage}%
                <span className="w-3 h-3 rounded-full bg-[hsl(var(--girl-primary))] shadow-lg"></span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-8 bg-muted/50 rounded-full overflow-hidden p-1 border-2 border-border/30 shadow-inner">
              <div className="absolute inset-1 flex rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[hsl(var(--boy-primary))] to-[hsl(var(--boy-secondary))] transition-all duration-1000 ease-out shadow-lg flex items-center justify-center"
                  style={{ width: `${boyPercentage}%` }}
                >
                  {boyPercentage > 10 && (
                    <span className="text-white text-xs font-bold drop-shadow">
                      {votes.boy}
                    </span>
                  )}
                </div>
                <div
                  className="bg-gradient-to-r from-[hsl(var(--girl-primary))] to-[hsl(var(--girl-secondary))] transition-all duration-1000 ease-out shadow-lg flex items-center justify-center"
                  style={{ width: `${girlPercentage}%` }}
                >
                  {girlPercentage > 10 && (
                    <span className="text-white text-xs font-bold drop-shadow">
                      {votes.girl}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Vote Count */}
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-display font-black text-[hsl(var(--boy-primary))]">
                  {votes.boy}
                </div>
                <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  Team Boy
                </div>
              </div>
              <div className="w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-display font-black text-[hsl(var(--girl-primary))]">
                  {votes.girl}
                </div>
                <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  Team Girl
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Host Control */}
        {isHost && (
          <Button
            onClick={() => {
              haptic.success();
              onStartCountdown();
            }}
            className="w-full h-16 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-display font-black text-xl rounded-2xl transition-all transform hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group"
            size="lg"
          >
            <span className="relative z-10">READY TO REVEAL! 🎉</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
        )}

        {/* Guest Waiting */}
        {!isHost && (
          <div className="text-center group">
            <div className="inline-block p-4 bg-muted/50 rounded-full mb-3 animate-pulse">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-body text-sm group-hover:text-primary transition-colors">
              Waiting for the host to start the big reveal...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Component

const VoteButton = ({
  team,
  emoji,
  label,
  disabled,
  isVoting,
  onClick
}: {
  team: 'boy' | 'girl';
  emoji: string;
  label: string;
  disabled: boolean;
  isVoting: boolean;
  onClick: () => void;
}) => {
  const colors = team === 'boy'
    ? {
        gradient: 'from-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-primary))]',
        shadow: 'shadow-boy-primary/30'
      }
    : {
        gradient: 'from-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-primary))]',
        shadow: 'shadow-girl-primary/30'
      };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center py-12 rounded-2xl font-display font-black text-xl transition-all duration-300 transform shadow-lg overflow-hidden group",
        disabled
          ? "bg-muted/50 cursor-not-allowed text-muted-foreground/50 border-2 border-border/20 grayscale-[0.5]"
          : `bg-gradient-to-br ${colors.gradient} text-white hover:scale-105 active:scale-95 hover:shadow-2xl ${colors.shadow}`,
        isVoting && "scale-95"
      )}
    >
      <div className={cn(
        "text-6xl mb-4 transition-transform duration-300",
        !disabled && "group-hover:scale-125",
        isVoting && "scale-150"
      )}>
        {isVoting ? '⏳' : emoji}
      </div>
      <div className="relative z-10 uppercase tracking-widest text-sm">
        {isVoting ? 'Voting...' : label}
      </div>
      
      {!disabled && !isVoting && (
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}

      {isVoting && (
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      )}
    </button>
  );
};
