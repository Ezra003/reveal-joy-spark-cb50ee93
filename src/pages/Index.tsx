import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { SetupScreen } from '@/components/SetupScreen';
import { VotingScreen } from '@/components/VotingScreen';
import { CountdownScreen } from '@/components/CountdownScreen';
import { RevealScreen } from '@/components/RevealScreen';
import { PredictionGame } from '@/components/enhanced/PredictionGame';
import { PhotoUpload } from '@/components/enhanced/PhotoUpload';
import { GuestNameDialog } from '@/components/GuestNameDialog';
import { ConfettiCanvas } from '@/components/ConfettiCanvas';
import { BackgroundParticles } from '@/components/BackgroundParticles';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useHaptic } from '@/hooks/useHaptic';
import { useSound } from '@/hooks/useSound';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';
import { babyNameSchema, dueDateSchema, guestNameSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

import { ThemeType } from '@/components/enhanced/ThemeSwitcher';
import { HostAnalytics } from '@/components/enhanced/HostAnalytics';
import { LandingScreen } from '@/components/enhanced/LandingScreen';

type Screen = 'setup' | 'landing' | 'voting' | 'countdown' | 'reveal';
type RevealMode = 'classic' | 'balloon' | 'box';

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
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [photos, setPhotos] = useState<{ url: string; id: string }[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [theme, setTheme] = useState<ThemeType>('default');
  const [revealMode, setRevealMode] = useState<RevealMode>('classic');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const [pendingVote, setPendingVote] = useState<'boy' | 'girl' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isStartingCountdown, setIsStartingCountdown] = useState(false);
  const { toast } = useToast();
  const haptic = useHaptic();

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
        // Ensure the initial state is also in hash for potential immediate sharing
        setTimeout(() => saveEventData(), 0);
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
    
    let isActive = true;
    let errorCount = 0;
    const maxErrors = 5;

    const poll = async () => {
      if (!isActive) return;
      
      try {
        await loadEventData(eventId);
        errorCount = 0;
      } catch (error) {
        errorCount++;
        if (errorCount >= maxErrors) {
          isActive = false;
          toast({
            title: "Connection Issue",
            description: "Trouble syncing data. Please refresh.",
            variant: "destructive"
          });
        }
      }

      if (isActive) {
        setTimeout(poll, 2000);
      }
    };

    poll();
    
    return () => {
      isActive = false;
    };
  }, [eventId, screen, toast]);

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
    try {
      if (babyName) babyNameSchema.parse(babyName);
      if (dueDate) dueDateSchema.parse(dueDate);
      
      if (!selectedGender) {
        toast({
          title: "Please select a gender first!",
          variant: "destructive"
        });
        return;
      }
      
      const hostId = Math.random().toString(36).substring(7);
      sessionStorage.setItem('hostId', hostId);
      
      const eventData = JSON.stringify({
        gender: selectedGender,
        babyName,
        dueDate,
        enableVoting,
        theme,
        revealMode,
        hostId,
        createdAt: Date.now()
      });
      
      await storage.set(`reveal:${eventId}`, eventData, true);
      await storage.trackEngagement(eventId, hostId, 'setup_complete');
      setIsHost(true);

      if (enableVoting) {
        setScreen('voting');
      } else {
        // Check if pre-event or immediate countdown
        const dateObj = new Date(dueDate);
        if (dateObj > new Date()) {
          setScreen('landing');
        } else {
          await startCountdown();
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid input",
          description: error.errors[0]?.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleRSVP = async () => {
    if (!eventId) return;
    haptic.success();
    await storage.trackEngagement(eventId, 'guest_id', 'rsvp_confirmed');
    localStorage.setItem(`rsvp:${eventId}`, 'true');
    setHasRSVPed(true);
    toast({
      title: "RSVP Confirmed! 🎉",
      description: "We'll see you at the reveal!",
    });
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
    if (isVoting) return;
    setIsVoting(true);

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
        setIsVoting(false);
        return;
      }

      // Atomic update - get latest votes before incrementing
      const votesResult = await storage.get(`votes:${eventId}`, true);
      const latestVotes = votesResult 
        ? JSON.parse(votesResult.value) 
        : { boy: 0, girl: 0 };
      
      const newVotes = { ...latestVotes, [vote]: latestVotes[vote] + 1 };
      
      // Save mark as voted and new votes
      await storage.set(voterKey, 'true', true);
      await saveVotes(newVotes);

      setVotes(newVotes);
      setHasVoted(true);

      toast({
        title: `Thanks ${name}!`,
        description: `Your vote for Team ${vote === 'boy' ? 'Boy' : 'Girl'} was recorded!`
      });
    } catch (error) {
      toast({
        title: "Vote failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleNameSubmit = (name: string) => {
    try {
      guestNameSchema.parse(name);
      setGuestName(name);
      localStorage.setItem('guestName', name);
      setShowNameDialog(false);
      if (pendingVote) {
        submitVote(pendingVote, name);
        setPendingVote(null);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid name",
          description: error.errors[0]?.message,
          variant: "destructive"
        });
      }
    }
  };

  const timerRef = useRef<NodeJS.Timeout>();

  const startCountdown = async () => {
    if (isStartingCountdown) return;
    setIsStartingCountdown(true);

    setScreen('countdown');
    await saveEventData('countdown');
    
    let currentCount = 3;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      currentCount--;
      setCount(currentCount);
      
      if (currentCount <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = undefined;
        }
        setTimeout(async () => {
          setScreen('reveal');
          await saveEventData('reveal');
          setShowConfetti(true);
          setIsStartingCountdown(false);
        }, 800);
      }
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
          theme={theme}
          setTheme={setTheme}
          revealMode={revealMode}
          setRevealMode={setRevealMode}
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
          eventId={eventId}
        />
      )}

      {screen === 'landing' && (
        <LandingScreen
          babyName={babyName}
          dueDate={dueDate}
          isHost={isHost}
          onContinue={() => setScreen(enableVoting ? 'voting' : 'countdown')}
          onRSVP={handleRSVP}
          hasRSVPed={hasRSVPed}
          eventId={eventId}
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
          photos={photos}
          onPhotoUpload={(url) => setPhotos(prev => [...prev, { url, id: Date.now().toString() }])}
          revealMode={revealMode}
        />
      )}

      {/* Prediction Game Overlay for Guests */}
      {screen === 'voting' && hasVoted && !isHost && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 animate-slide-in-bottom">
          <PredictionGame 
            guestName={guestName} 
            onSubmit={(newPrediction) => setPredictions(prev => [...prev, newPrediction])} 
          />
        </div>
      )}

      {isHost && eventId && (
        <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
          <HostAnalytics eventId={eventId} />
        </div>
      )}
    </>
  );
};

export default Index;
