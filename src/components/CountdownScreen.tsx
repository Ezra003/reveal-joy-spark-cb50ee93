import { useEffect, useState } from 'react';
import { useHaptic } from '@/hooks/useHaptic';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface CountdownScreenProps {
  count: number;
  gender: 'boy' | 'girl';
}

export const CountdownScreen = ({ count, gender }: CountdownScreenProps) => {
  const [flash, setFlash] = useState(false);
  const [pulse, setPulse] = useState(false);
  const haptic = useHaptic();
  
  // Optional: Add heartbeat sound
  // const { play: playHeartbeat } = useSound('/sounds/heartbeat.mp3', { loop: true });

  useEffect(() => {
    // Haptic feedback on each count
    if (count > 0) {
      haptic.heavy();
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }

    // Flash effect on final count
    if (count === 1) {
      setFlash(true);
    }
  }, [count, haptic]);

  const bgColor = gender === 'boy'
    ? 'bg-gradient-to-br from-[hsl(var(--boy-gradient-start))] via-[hsl(var(--boy-gradient-mid))] to-[hsl(var(--boy-gradient-end))]'
    : 'bg-gradient-to-br from-[hsl(var(--girl-gradient-start))] via-[hsl(var(--girl-gradient-mid))] to-[hsl(var(--girl-gradient-end))]';

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 relative overflow-hidden",
      bgColor,
      flash && "bg-white"
    )}>
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30",
          gender === 'boy' ? "bg-blue-400" : "bg-pink-400",
          pulse && "animate-ping"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30",
          gender === 'boy' ? "bg-blue-300" : "bg-pink-300",
          pulse && "animate-ping"
        )} />
      </div>

      {/* Countdown Number */}
      <div className="relative z-10 text-center">
        <div className={cn(
          "transition-all duration-500",
          pulse ? "scale-125" : "scale-100"
        )}>
          {count > 0 ? (
            <>
              <div className={cn(
                "text-[20rem] font-display font-black leading-none mb-8",
                gender === 'boy' ? "text-blue-600" : "text-pink-600",
                "drop-shadow-2xl animate-bounce-in"
              )}>
                {count}
              </div>
              <p className="text-4xl font-display font-bold text-white/90 drop-shadow-lg animate-pulse">
                Get Ready...
              </p>
            </>
          ) : (
            <div className="animate-scale-in">
              <p className="text-6xl font-display font-black text-white mb-4 drop-shadow-2xl animate-bounce">
                HERE IT COMES! 🎉
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Heartbeat Effect */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        pulse && "animate-pulse-glow"
      )} />
    </div>
  );
};
