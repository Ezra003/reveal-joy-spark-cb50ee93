import { useRef, useCallback, useState } from 'react';

interface UseSoundOptions {
  volume?: number;
  loop?: boolean;
}

export const useSound = (src: string, options: UseSoundOptions = {}) => {
  const { volume = 0.5, loop = false } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio
  if (!audioRef.current) {
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;
  }

  const play = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isMuted]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, []);

  return {
    play,
    pause,
    stop,
    toggleMute,
    setVolume,
    isPlaying,
    isMuted,
  };
};
