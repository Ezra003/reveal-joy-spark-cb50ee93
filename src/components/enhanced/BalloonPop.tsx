import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { useSound } from '@/hooks/useSound';

interface BalloonPopProps {
  gender: 'boy' | 'girl';
  onComplete: () => void;
}

export const BalloonPop = ({ gender, onComplete }: BalloonPopProps) => {
  const [popped, setPopped] = useState(false);
  const [scale, setScale] = useState(1);
  const haptic = useHaptic();
  // const popSound = useSound('/sounds/pop.mp3'); // Mocking sound for now

  const handlePop = () => {
    if (popped) return;
    setPopped(true);
    haptic.heavy();
    // popSound.play();
    setTimeout(onComplete, 1500); // Allow some time for the pop animation
  };

  const handleTouch = () => {
    if (popped) return;
    setScale(s => Math.min(s + 0.1, 1.5));
    haptic.medium();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-4">
      <AnimatePresence mode="wait">
        {!popped ? (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ 
              y: [0, -20, 0],
              scale: scale,
              opacity: 1
            }}
            transition={{
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 300, damping: 15 }
            }}
            whileTap={{ scale: scale + 0.05 }}
            onClick={handlePop}
            onTouchStart={handleTouch}
            className="relative cursor-pointer"
          >
            {/* Balloon Body */}
            <div className={`w-48 h-60 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-2xl relative
              ${gender === 'boy' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}
            `}>
              {/* Shine */}
              <div className="absolute top-8 left-8 w-12 h-16 bg-white/30 rounded-full blur-md" />
              
              {/* Question Marks */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-display font-black text-white/40">?</span>
              </div>
            </div>
            
            {/* Balloon Knot */}
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 rounded-t-full
              ${gender === 'boy' ? 'bg-blue-700' : 'bg-pink-700'}
            `} />
            
            {/* String */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-32 bg-slate-400/50" />
            
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="font-display font-bold text-muted-foreground uppercase tracking-widest text-sm">Tap to Pop!</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              {/* Explosion Particles (Simulated) */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute w-4 h-4 rounded-full ${gender === 'boy' ? 'bg-blue-400' : 'bg-pink-400'}`}
                />
              ))}
              
              <div className={`text-7xl font-display font-black drop-shadow-2xl animate-bounce-in
                ${gender === 'boy' ? 'text-blue-500' : 'text-pink-500'}
              `}>
                {gender === 'boy' ? 'IT\'S A BOY!' : 'IT\'S A GIRL!'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
