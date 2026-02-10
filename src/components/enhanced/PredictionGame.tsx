import { useState } from 'react';
import { Calendar, Weight, Clock, Baby, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  birthDate: string;
  birthWeight: string;
  birthTime: string;
  firstWord: string;
  looksLike: string;
}

interface PredictionGameProps {
  guestName: string;
  onSubmit: (prediction: Prediction) => void;
}

export const PredictionGame = ({ guestName, onSubmit }: PredictionGameProps) => {
  const [prediction, setPrediction] = useState<Prediction>({
    birthDate: '',
    birthWeight: '',
    birthTime: '',
    firstWord: '',
    looksLike: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!prediction.birthDate || !prediction.birthWeight) {
      toast({
        title: 'Missing information',
        description: 'Please fill in at least the birth date and weight',
        variant: 'destructive'
      });
      return;
    }

    onSubmit(prediction);
    toast({
      title: 'Predictions saved!',
      description: "We'll see how accurate you are! 🎯"
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
      <div className="text-center mb-6">
        <Trophy className="w-12 h-12 mx-auto mb-3 text-primary" />
        <h2 className="text-2xl font-display font-bold mb-2">
          Make Your Predictions
        </h2>
        <p className="text-muted-foreground font-body">
          Guess the details and win bragging rights! 🏆
        </p>
      </div>

      <div className="space-y-4">
        {/* Birth Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-body font-semibold mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            Birth Date *
          </label>
          <Input
            type="date"
            value={prediction.birthDate}
            onChange={(e) => setPrediction({ ...prediction, birthDate: e.target.value })}
            className="bg-background/50"
          />
        </div>

        {/* Birth Weight */}
        <div>
          <label className="flex items-center gap-2 text-sm font-body font-semibold mb-2">
            <Weight className="w-4 h-4 text-primary" />
            Birth Weight (lbs) *
          </label>
          <Input
            type="text"
            placeholder="e.g., 7.5"
            value={prediction.birthWeight}
            onChange={(e) => setPrediction({ ...prediction, birthWeight: e.target.value })}
            className="bg-background/50"
          />
        </div>

        {/* Birth Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-body font-semibold mb-2">
            <Clock className="w-4 h-4 text-primary" />
            Birth Time
          </label>
          <Input
            type="time"
            value={prediction.birthTime}
            onChange={(e) => setPrediction({ ...prediction, birthTime: e.target.value })}
            className="bg-background/50"
          />
        </div>

        {/* First Word */}
        <div>
          <label className="flex items-center gap-2 text-sm font-body font-semibold mb-2">
            <Baby className="w-4 h-4 text-primary" />
            First Word
          </label>
          <Input
            type="text"
            placeholder="e.g., Mama"
            value={prediction.firstWord}
            onChange={(e) => setPrediction({ ...prediction, firstWord: e.target.value })}
            className="bg-background/50"
          />
        </div>

        {/* Looks Like */}
        <div>
          <label className="text-sm font-body font-semibold mb-2 block">
            Baby will look more like...
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Mom', 'Dad'].map((option) => (
              <button
                key={option}
                onClick={() => setPrediction({ ...prediction, looksLike: option })}
                className={`p-4 rounded-xl border-2 transition-all font-body font-semibold ${
                  prediction.looksLike === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white font-display font-bold rounded-xl"
        >
          Submit Predictions
        </Button>
      </div>
    </Card>
  );
};


