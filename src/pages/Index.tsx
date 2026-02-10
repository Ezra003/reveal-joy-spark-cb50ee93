import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { SetupScreen } from '@/components/SetupScreen';
import { VotingScreen } from '@/components/VotingScreen';
import { CountdownScreen } from '@/components/CountdownScreen';
import { RevealScreen } from '@/components/RevealScreen';
import { GuestNameDialog } from '@/components/GuestNameDialog';
import { ConfettiCanvas } from '@/components/ConfettiCanvas';
import { BackgroundParticles } from '@/components/BackgroundParticles';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

type Screen = 'setup' | 'voting' | 'countdown' | 'reveal';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('setup');
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(null);
  const [babyName, setBabyName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [count, setCount] = useState(3);
  const [votes, setVotes] = useState({ boy: 0, girl: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [enableVoting, setEnableVoting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [eventId, setEventId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingVote, setPendingVote] = useState<'boy' | 'girl' | null>(null);
  const { toast } = useToast();

  // Initialize or join event - check hash first for shared data
  useEffect(() => {
    const initEvent = async () => {
      // Check if there's data in the hash (shared link)
      if (window.location.hash) {
        try {
          const encoded = window.location.hash.substring(1);
          const data = JSON.parse(atob(encoded));
          
          // Load shared event data
          setSelectedGender(data.gender);
          setBabyName(data.babyName || '');
          setScreen(data.screen || 'voting');
          setEnableVoting(data.enableVoting || false);
          
          // Generate a temporary event ID for this session
          const tempId = generateEventId();
          setEventId(tempId);
          setIsHost(false);
        } catch (error) {
          console.error('Error loading shared data:', error);
        }
      } else {
        // Host creating new event
        const newId = generateEventId();
        setEventId(newId);
        setIsHost(true);
      }
      setLoading(false);
      const savedGuestName = localStorage.getItem('guestName');
      if (savedGuestName) setGuestName(savedGuestName);
    };
    
    initEvent();
  }, []);

  // Poll for updates when in voting/reveal mode
  useEffect(() => {
    if (!eventId || screen === 'setup') return;
    
    const pollInterval = setInterval(async () => {
      await loadEventData(eventId);
    }, 2000);
    
    return () => clearInterval(pollInterval);
  }, [eventId, screen]);

  const generateEventId = () => {
    return 'event_' + Math.random().toString(36).substring(2, 9);
  };

  const loadEventData = async (id: string) => {
    try {
      const eventResult = await storage.get(`reveal:${id}`, true);
      if (eventResult) {
        const data = JSON.parse(eventResult.value);
        setSelectedGender(data.gender);
        setBabyName(data.babyName || '');
        setDueDate(data.dueDate || '');
        setScreen(data.screen || 'voting');
        setEnableVoting(data.enableVoting || false);
      }

      const votesResult = await storage.get(`votes:${id}`, true);
      if (votesResult) {
        setVotes(JSON.parse(votesResult.value));
      }
    } catch (error) {
      console.log('Event not found or error loading:', error);
    }
  };

  const saveEventData = async (screenToSave?: Screen) => {
    if (!eventId) return;
    
    try {
      await storage.set(`reveal:${eventId}`, JSON.stringify({
        gender: selectedGender,
        babyName,
        dueDate,
        screen: screenToSave || screen,
        enableVoting
      }), true);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const saveVotes = async (newVotes: { boy: number; girl: number }) => {
    if (!eventId) return;
    
    try {
      await storage.set(`votes:${eventId}`, JSON.stringify(newVotes), true);
    } catch (error) {
      console.error('Error saving votes:', error);
    }
  };

  const handleSetup = async () => {
    if (!selectedGender) {
      toast({
        title: "Please select a gender first!",
        variant: "destructive"
      });
      return;
    }
    
    if (enableVoting) {
      setScreen('voting');
      await saveEventData('voting');
    } else {
      // If voting is disabled, start countdown immediately
      await startCountdown();
    }
  };

  const handleVote = (vote: 'boy' | 'girl') => {
    if (!guestName) {
      setPendingVote(vote);
      setShowNameDialog(true);
      return;
    }
    
    submitVote(vote, guestName);
  };

  const submitVote = async (vote: 'boy' | 'girl', name: string) => {
    const voterId = localStorage.getItem('voterId') || generateEventId();
    localStorage.setItem('voterId', voterId);
    
    const voterKey = `voter:${eventId}:${voterId}`;
    
    try {
      const hasVotedBefore = await storage.get(voterKey, true);
      if (hasVotedBefore) {
        toast({
          title: "You have already voted!",
          variant: "destructive"
        });
        setHasVoted(true);
        return;
      }
    } catch (error) {
      // Voter hasn't voted yet
    }

    const newVotes = { ...votes, [vote]: votes[vote] + 1 };
    setVotes(newVotes);
    setHasVoted(true);
    
    await storage.set(voterKey, 'true', true);
    await saveVotes(newVotes);

    toast({
      title: `Thanks ${name}!`,
      description: `Your vote for Team ${vote === 'boy' ? 'Boy' : 'Girl'} was recorded!`
    });
  };

  const handleNameSubmit = (name: string) => {
    setGuestName(name);
    localStorage.setItem('guestName', name);
    setShowNameDialog(false);
    if (pendingVote) {
      submitVote(pendingVote, name);
      setPendingVote(null);
    }
  };

  const startCountdown = async () => {
    setScreen('countdown');
    await saveEventData('countdown');
    
    let currentCount = 3;
    
    const timer = setInterval(() => {
      currentCount--;
      setCount(currentCount);
      
      if (currentCount === 0) {
        clearInterval(timer);
        setTimeout(async () => {
          setScreen('reveal');
          await saveEventData('reveal');
          setShowConfetti(true);
        }, 800);
      }
    }, 1000);
    
    // Cleanup timer on unmount
    return () => clearInterval(timer);
  };

  const copyShareLink = async () => {
    // Ensure event data is saved to hash before copying
    if (isHost && screen === 'setup') {
      await saveEventData();
    }
    
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link copied!",
        description: "Guests can now join and vote!"
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const reset = async () => {
    if (eventId) {
      try {
        await storage.delete(`reveal:${eventId}`, true);
        await storage.delete(`votes:${eventId}`, true);
      } catch (error) {
        console.error('Error cleaning up:', error);
      }
    }
    
    window.location.href = window.location.pathname;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--neutral-gradient-start))] via-[hsl(var(--neutral-gradient-mid))] to-[hsl(var(--neutral-gradient-end))] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-accent animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;

  const confettiColors = selectedGender === 'boy' 
    ? ['#3b82f6', '#60a5fa', '#93c5fd'] 
    : ['#ec4899', '#f472b6', '#fbcfe8'];

  return (
    <>
      <BackgroundParticles />
      {showConfetti && <ConfettiCanvas colors={confettiColors} />}
      <GuestNameDialog isOpen={showNameDialog} onClose={handleNameSubmit} />
      
      {screen === 'setup' && isHost && (
        <SetupScreen
          babyName={babyName}
          setBabyName={setBabyName}
          dueDate={dueDate}
          setDueDate={setDueDate}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          enableVoting={enableVoting}
          setEnableVoting={setEnableVoting}
          onContinue={handleSetup}
        />
      )}

      {screen === 'voting' && (
        <VotingScreen
          votes={votes}
          hasVoted={hasVoted}
          onVote={handleVote}
          isHost={isHost}
          shareUrl={shareUrl}
          copied={copied}
          onCopyLink={copyShareLink}
          onStartCountdown={startCountdown}
        />
      )}

      {screen === 'countdown' && selectedGender && (
        <CountdownScreen count={count} gender={selectedGender} />
      )}

      {screen === 'reveal' && selectedGender && (
        <RevealScreen
          gender={selectedGender}
          babyName={babyName}
          dueDate={dueDate}
          votes={votes}
          enableVoting={enableVoting}
          isHost={isHost}
          onReset={reset}
        />
      )}
    </>
  );
};

export default Index;
