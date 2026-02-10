import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { Sparkles, Package } from 'lucide-react';

interface BoxRevealProps {
  gender: 'boy' | 'girl';
  onComplete: () => void;
}

export const BoxReveal = ({ gender, onComplete }: BoxRevealProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(0);
  const haptic = useHaptic();

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    haptic.heavy();
    setTimeout(onComplete, 2000);
  };

  const handleTap = () => {
    if (isOpen) return;
    setShake(s => s + 1);
    haptic.medium();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12 p-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: shake % 2 === 0 ? [0, -5, 5, 0] : [0, 5, -5, 0]
            }}
            transition={{ 
              x: { duration: 0.2 },
              scale: { duration: 0.5 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            onMouseDown={handleTap}
            className="relative cursor-pointer group"
          >
            {/* Magic Box Graphic */}
            <div className="relative w-64 h-64 bg-card rounded-3xl border-4 border-primary/20 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-primary/20" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-primary/20" />
              
              <Package className="w-24 h-24 text-primary/40 animate-pulse" />
              
              <div className="absolute top-4 right-4">
                <Sparkles className="w-6 h-6 text-accent animate-float" />
              </div>
            </div>
            
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full text-center">
              <p className="font-display font-black text-muted-foreground uppercase tracking-[0.2em] text-sm animate-pulse">
                Tapez pour Ouvrir!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Box Opening Animation (Simplified) */}
            <div className="relative w-64 h-32 flex justify-center">
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -110 }}
                className="absolute top-0 w-full h-32 bg-card border-4 border-primary/20 rounded-t-3xl origin-bottom"
              />
              
              {/* Result Bursting Out */}
              <motion.div
                initial={{ y: 50, scale: 0.5, opacity: 0 }}
                animate={{ y: -100, scale: 1.5, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className={`text-6xl font-display font-black drop-shadow-2xl
                  ${gender === 'boy' ? 'text-blue-500' : 'text-pink-500'}
                `}
              >
                {gender === 'boy' ? 'BOY! 💙' : 'GIRL! 💗'}
              </motion.div>
              
              {/* Confetti (Simulated) */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.7) * 500,
                    opacity: 0,
                    rotate: 360
                  }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className={`absolute w-3 h-3 ${Math.random() > 0.5 ? 'rounded-full' : ''} 
                    ${gender === 'boy' ? 'bg-blue-300' : 'bg-pink-300'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
