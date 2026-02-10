import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCircle2 } from "lucide-react";

interface GuestNameDialogProps {
  isOpen: boolean;
  onClose: (name: string) => void;
}

export const GuestNameDialog = ({ isOpen, onClose }: GuestNameDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onClose(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-border/50 backdrop-blur-xl bg-card/80 dark:bg-card/40">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <UserCircle2 className="w-8 h-8 text-accent" />
          </div>
          <DialogTitle className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hello Friend!</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium pt-2">
            Before you guess, tell us what to call you!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
              Your Name
            </label>
            <Input
              id="name"
              placeholder="e.g. Grandma Sarah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/50 py-6 rounded-2xl text-lg font-bold"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-primary to-accent py-7 rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-1"
            >
              Start Voting! 🎉
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
