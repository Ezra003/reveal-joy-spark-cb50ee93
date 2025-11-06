interface CountdownScreenProps {
  count: number;
  gender: 'boy' | 'girl';
}

export const CountdownScreen = ({ count, gender }: CountdownScreenProps) => {
  const isBoy = gender === 'boy';
  
  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        isBoy 
          ? 'bg-gradient-to-br from-[hsl(var(--boy-secondary))] via-[hsl(var(--boy-light))] to-[hsl(var(--boy-light))]' 
          : 'bg-gradient-to-br from-[hsl(var(--girl-secondary))] via-[hsl(var(--girl-light))] to-[hsl(var(--girl-light))]'
      }`}
    >
      <div className="text-center">
        <div className="text-9xl font-bold text-white animate-pulse drop-shadow-2xl">
          {count}
        </div>
      </div>
    </div>
  );
};
