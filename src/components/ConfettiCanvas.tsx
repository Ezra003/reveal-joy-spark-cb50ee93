import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface ConfettiCanvasProps {
  colors: string[];
  duration?: number;
}

export const ConfettiCanvas = ({ colors, duration = 3000 }: ConfettiCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const addParticles = (angle: number, origin: { x: number; y: number }) => {
      const particleCount = 5;
      const spread = 55;
      
      for (let i = 0; i < particleCount; i++) {
        const angleRad = (angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
        particlesRef.current.push({
          x: origin.x * canvas.width,
          y: origin.y * canvas.height,
          vx: Math.cos(angleRad) * (Math.random() * 10 + 10),
          vy: Math.sin(angleRad) * (Math.random() * 10 + 10) - 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          opacity: 1
        });
      }
    };

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.5;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        if (p.opacity <= 0 || p.y > canvas.height + 100) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        
        // Randomly draw squares or circles
        if (i % 2 === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const startTime = Date.now();
    const blastLoop = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        addParticles(60, { x: 0, y: 0.8 });
        addParticles(120, { x: 1, y: 0.8 });
        setTimeout(blastLoop, 100);
      }
    };

    animate();
    blastLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [colors, duration]);

  return null;
};
