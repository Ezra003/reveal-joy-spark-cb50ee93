interface CountdownScreenProps {
  count: number;
  gender: 'boy' | 'girl';
}

export const CountdownScreen = ({ count }: CountdownScreenProps) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[hsl(var(--neutral-gradient-start))] via-[hsl(var(--neutral-gradient-mid))] to-[hsl(var(--neutral-gradient-end))]"
    >
      <div className="text-center">
        <div className="text-9xl font-bold text-foreground animate-pulse drop-shadow-2xl">
          {count}
        </div>
      </div>
    </div>
  );
};
