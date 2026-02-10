interface CountdownScreenProps {
  count: number;
  gender: 'boy' | 'girl';
}

export const CountdownScreen = ({ count }: CountdownScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="text-center relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse scale-[2]" />
        <div 
          key={count} 
          className="text-[15rem] md:text-[25rem] font-black text-foreground animate-scale-in drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] select-none relative z-10"
        >
          {count}
        </div>
      </div>
    </div>
  );
};
