import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { Users, Activity, Clock, BarChart3, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface HostAnalyticsProps {
  eventId: string;
}

export const HostAnalytics = ({ eventId }: HostAnalyticsProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const analytics = await storage.getAnalytics(eventId);
      setData(analytics);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  if (!data) return null;

  const totalGuests = Object.keys(data.guests).length;
  const totalActions = data.timeline.length;
  
  return (
    <Card className="w-full max-w-2xl mx-auto glass shadow-2xl border-primary/20 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-display font-black tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Live Guest Engagement
          </CardTitle>
          <p className="text-sm text-muted-foreground font-body">Track your party participation in real-time</p>
        </div>
        <TrendingUp className="w-8 h-8 text-secondary animate-pulse" />
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-primary mb-2" />
            <span className="text-3xl font-display font-black text-primary">{totalGuests}</span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Joined Guests</span>
          </div>
          
          <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10 flex flex-col items-center text-center">
            <Activity className="w-8 h-8 text-secondary mb-2" />
            <span className="text-3xl font-display font-black text-secondary">{totalActions}</span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Total Interactions</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-display font-bold text-muted-foreground uppercase tracking-widest">Recent Activity</span>
          </div>
          
          <ScrollArea className="h-[200px] rounded-2xl border border-border/50 bg-muted/20 p-4">
            <div className="space-y-3">
              {[...data.timeline].reverse().slice(0, 20).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/10 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-card-foreground">Guest {item.guestId.substring(0, 8)}</span>
                    <span className="text-xs text-muted-foreground lowercase italic">performed {item.action}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted p-1 rounded-md">
                    {format(new Date(item.time), 'HH:mm:ss')}
                  </span>
                </div>
              ))}
              {totalActions === 0 && (
                <div className="text-center py-12 text-muted-foreground italic">
                  Waiting for guest activity...
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
