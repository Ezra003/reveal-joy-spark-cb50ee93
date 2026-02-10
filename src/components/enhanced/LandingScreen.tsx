import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

interface LandingScreenProps {
  babyName: string;
  dueDate: string;
  isHost: boolean;
  onContinue: () => void;
  onRSVP: () => void;
  hasRSVPed: boolean;
  eventId: string;
}

export const LandingScreen = ({ babyName, dueDate, isHost, onContinue, onRSVP, hasRSVPed, eventId }: LandingScreenProps) => {
  const dateObj = new Date(dueDate);
  const now = new Date();
  
  const days = differenceInDays(dateObj, now);
  const hours = differenceInHours(dateObj, now) % 24;
  const minutes = differenceInMinutes(dateObj, now) % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full glass p-8 sm:p-12 rounded-[2.5rem] border-primary/10 shadow-2xl text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center animate-bounce-in">
            <Heart className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black text-card-foreground mb-4 leading-tight">
          Wait for the Big Surprise! 🎊
        </h1>
        
        <p className="text-lg text-muted-foreground font-body mb-12 max-w-md mx-auto">
          {babyName ? `Baby ${babyName}` : "The Baby"}'s big reveal is almost here. 
          {isHost ? " You can start the countdown whenever you're ready." : " Join us back here at the scheduled time!"}
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Days', value: Math.max(0, days) },
            { label: 'Hours', value: Math.max(0, hours) },
            { label: 'Minutes', value: Math.max(0, minutes) }
          ].map((item, i) => (
            <div key={i} className="bg-muted/50 rounded-2xl p-4 border border-border/50">
              <span className="text-3xl font-display font-black text-primary block">{item.value}</span>
              <span className="text-[10px] font-display font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {isHost ? (
            <Button
              onClick={onContinue}
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-display font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              Start Event Now 🚀
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={onRSVP}
                disabled={hasRSVPed}
                className={cn(
                  "w-full h-16 rounded-2xl font-display font-bold text-lg transition-all",
                  hasRSVPed 
                    ? "bg-green-500/10 text-green-600 border-2 border-green-500/20" 
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                )}
              >
                {hasRSVPed ? "✓ RSVP Confirmed" : "RSVP to Event 🎉"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 border-primary/10 flex items-center justify-center gap-3 font-display font-bold text-muted-foreground hover:bg-primary/5 transition-all text-sm"
              >
                <Bell className="w-4 h-4 text-primary" />
                Notify Me When Live
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 text-xs font-display font-black uppercase tracking-widest text-muted-foreground pt-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(dateObj, 'PPPP')}</span>
            <span className="mx-1">•</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
