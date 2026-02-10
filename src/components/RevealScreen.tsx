import { useState, useEffect } from 'react';
import { PartyPopper, Download, Share2, RotateCcw, Volume2, VolumeX, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoUpload } from '@/components/enhanced/PhotoUpload';
import { useHaptic } from '@/hooks/useHaptic';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { BalloonPop } from '@/components/enhanced/BalloonPop';
import { BoxReveal } from '@/components/enhanced/BoxReveal';

interface RevealScreenProps {
  gender: 'boy' | 'girl';
  babyName: string;
  dueDate?: string;
  votes: { boy: number; girl: number };
  enableVoting: boolean;
  isHost: boolean;
  onReset: () => void;
  photos: { url: string; id: string }[];
  onPhotoUpload: (url: string) => void;
  revealMode?: 'classic' | 'balloon' | 'box';
}

export const RevealScreen = ({
  gender,
  babyName,
  dueDate,
  votes,
  enableVoting,
  isHost,
  onReset,
  photos,
  onPhotoUpload,
  revealMode = 'classic'
}: RevealScreenProps) => {
  const [showContent, setShowContent] = useState(revealMode === 'classic');
  const [revealInteractiveDone, setRevealInteractiveDone] = useState(false);
  const [emojiRain, setEmojiRain] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const haptic = useHaptic();
  
  // Optional: Celebration sound
  // const { play, toggleMute, isMuted: soundMuted } = useSound(
  //   gender === 'boy' ? '/sounds/boy-celebration.mp3' : '/sounds/girl-celebration.mp3'
  // );

  const isBoy = gender === 'boy';
  const emoji = isBoy ? '💙' : '💗';

  useEffect(() => {
    if (revealMode === 'classic' || revealInteractiveDone) {
      // Celebration haptic
      haptic.success();

      // Reveal content with delay
      if (revealMode !== 'classic') {
          setTimeout(() => setShowContent(true), 100);
      } else {
          setTimeout(() => setShowContent(true), 500);
      }

      // Emoji rain effect
      const interval = setInterval(() => {
        setEmojiRain(prev => [...prev, Date.now()]);
      }, 150);

      // Clean up after 5 seconds
      const timer = setTimeout(() => {
        clearInterval(interval);
        setTimeout(() => setEmojiRain([]), 3000);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [revealMode, revealInteractiveDone]);

  const bgGradient = isBoy
    ? 'from-[hsl(var(--boy-primary))] via-[hsl(var(--boy-secondary))] to-[hsl(var(--boy-light))]'
    : 'from-[hsl(var(--girl-primary))] via-[hsl(var(--girl-secondary))] to-[hsl(var(--girl-light))]';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `It's a ${isBoy ? 'Boy' : 'Girl'}!`,
          text: babyName 
            ? `We're having a ${isBoy ? 'boy' : 'girl'}! Welcome ${babyName}! 🎉`
            : `It's a ${isBoy ? 'boy' : 'girl'}! 🎉`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleDownload = () => {
    // Would implement screenshot/image download
    alert('Download feature - implement with html2canvas');
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 transition-all duration-1000 relative overflow-hidden",
      `bg-gradient-to-br ${bgGradient}`
    )}>
      {/* Emoji Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {(revealMode === 'classic' || revealInteractiveDone) && emojiRain.map((id) => (
          <div
            key={id}
            className="absolute top-[-20%] animate-drop opacity-70 transition-all duration-1000"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <span className="text-4xl">{emoji}</span>
          </div>
        ))}
      </div>

      {!showContent && revealMode === 'balloon' && (
          <BalloonPop gender={gender} onComplete={() => setRevealInteractiveDone(true)} />
      )}

      {!showContent && revealMode === 'box' && (
          <BoxReveal gender={gender} onComplete={() => setRevealInteractiveDone(true)} />
      )}

      {/* Animated Background Shapes */}
      {showContent && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float" />
          <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-white rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        "text-center max-w-4xl px-4 relative z-10 transition-all duration-700",
        showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        
        {/* Party Icon */}
        <div className="mb-8 animate-bounce">
          <PartyPopper className="w-32 h-32 mx-auto text-white drop-shadow-2xl" />
        </div>
        
        {/* Main Announcement */}
        <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-display font-black text-white mb-8 drop-shadow-2xl leading-none animate-bounce-in">
          It's a {isBoy ? 'Boy!' : 'Girl!'}
        </h1>
        
        {/* Baby Name */}
        {babyName && (
          <p 
            className="text-5xl md:text-7xl text-white font-accent mb-6 drop-shadow-lg animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            Welcome {babyName}!
          </p>
        )}

        {/* Due Date */}
        {dueDate && (
          <p 
            className="text-2xl md:text-3xl text-white/95 font-body font-medium mb-10 drop-shadow-lg animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            Arriving {dueDate}
          </p>
        )}

        {/* Big Emoji */}
        <div 
          className="text-9xl mb-12 drop-shadow-2xl animate-bounce-in"
          style={{ animationDelay: '0.7s' }}
        >
          {emoji}
        </div>
        
        {/* Vote Results */}
        {enableVoting && votes.boy + votes.girl > 0 && (
          <div 
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-10 max-w-2xl mx-auto border-2 border-white/40 shadow-2xl animate-slide-in-bottom"
            style={{ animationDelay: '0.9s' }}
          >
            <h3 className="font-display font-bold text-white mb-6 uppercase tracking-widest text-lg">
              Final Predictions
            </h3>
            <div className="grid grid-cols-3 gap-6 items-center">
              {/* Boy Votes */}
              <div className="text-center group">
                <div className="text-6xl font-display font-black text-white mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">
                  {votes.boy}
                </div>
                <div className="text-base font-body font-bold text-white/90 uppercase tracking-wide">
                  Team Boy
                </div>
                <div className="text-5xl mt-2">💙</div>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-20 bg-white/30"></div>
                <span className="text-white/70 font-body text-sm">vs</span>
                <div className="w-px h-20 bg-white/30"></div>
              </div>

              {/* Girl Votes */}
              <div className="text-center group">
                <div className="text-6xl font-display font-black text-white mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">
                  {votes.girl}
                </div>
                <div className="text-base font-body font-bold text-white/90 uppercase tracking-wide">
                  Team Girl
                </div>
                <div className="text-5xl mt-2">💗</div>
              </div>
            </div>
            
            {/* Winner Announcement */}
            <div className="mt-6 pt-6 border-t-2 border-white/30">
              <p className="text-white/90 font-body text-lg">
                {votes[gender] > votes[gender === 'boy' ? 'girl' : 'boy'] ? (
                  <>
                    <span className="font-bold">Team {isBoy ? 'Boy' : 'Girl'}</span> predicted correctly! 🎊
                  </>
                ) : votes[gender] === votes[gender === 'boy' ? 'girl' : 'boy'] ? (
                  'It was a tie! Everyone wins! 🎉'
                ) : (
                  <>
                    <span className="font-bold">Team {isBoy ? 'Girl' : 'Boy'}</span> almost had it! 💝
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Memory Gallery */}
        <div className="mt-12 mb-12 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
              <ImageIcon className="w-6 h-6" />
              Memory Book
            </h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md">
              {photos.length} Photos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="aspect-square rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl group cursor-pointer"
              >
                <img 
                  src={photo.url} 
                  alt="Guest contribution" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
            
            {/* Upload Placeholder if empty or just one more space */}
            <div className="aspect-square rounded-2xl border-2 border-dashed border-white/50 bg-white/5 flex flex-col items-center justify-center p-4 text-center">
              <ImageIcon className="w-8 h-8 text-white/50 mb-2" />
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Add your photo</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20">
            <p className="text-white/80 font-body text-sm mb-4 text-center">
              Share a memory or a wish with the parents-to-be! 📸
            </p>
            <PhotoUpload onUpload={(_, preview) => onPhotoUpload(preview)} />
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
          style={{ animationDelay: '1.1s' }}
        >
          {/* Sound Toggle */}
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="secondary"
            className="bg-white/90 text-foreground px-8 py-6 text-lg font-display font-bold hover:bg-white shadow-2xl transition-all transform hover:scale-105 rounded-2xl min-w-[180px] backdrop-blur-sm"
            size="lg"
          >
            {isMuted ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
            Sound {isMuted ? 'Off' : 'On'}
          </Button>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            variant="secondary"
            className="bg-white/90 text-foreground px-8 py-6 text-lg font-display font-bold hover:bg-white shadow-2xl transition-all transform hover:scale-105 rounded-2xl min-w-[180px] backdrop-blur-sm"
            size="lg"
          >
            <Share2 className="mr-2" />
            Share News
          </Button>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            variant="secondary"
            className="bg-white/90 text-foreground px-8 py-6 text-lg font-display font-bold hover:bg-white shadow-2xl transition-all transform hover:scale-105 rounded-2xl min-w-[180px] backdrop-blur-sm"
            size="lg"
          >
            <Download className="mr-2" />
            Save Image
          </Button>
          
          {/* Reset (Host Only) */}
          {isHost && (
            <Button
              onClick={() => {
                if (confirm('Start a new reveal? This will clear all data.')) {
                  onReset();
                }
              }}
              variant="outline"
              className="bg-white/10 text-white border-white/40 px-8 py-6 text-lg font-display font-bold hover:bg-white/20 shadow-2xl transition-all transform hover:scale-105 rounded-2xl min-w-[180px] backdrop-blur-sm"
              size="lg"
            >
              <RotateCcw className="mr-2" />
              Start Over
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Component for Falling Emoji

const FallingEmoji = ({ emoji }: { emoji: string }) => {
  const [style] = useState({
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 2 + 3}s`,
    animationDelay: `${Math.random() * 2}s`,
    fontSize: `${Math.random() * 30 + 30}px`,
  });

  return (
    <div
      className="absolute top-0 animate-slide-in-bottom opacity-80"
      style={style}
    >
      {emoji}
    </div>
  );
};
