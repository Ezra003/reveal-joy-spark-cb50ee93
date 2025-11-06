import { useEffect } from 'react';

interface ConfettiCanvasProps {
  colors: string[];
  duration?: number;
}

export const ConfettiCanvas = ({ colors, duration = 3000 }: ConfettiCanvasProps) => {
  useEffect(() => {
    const end = Date.now() + duration;

    const confettiPiece = ({ particleCount, angle, spread, origin }: {
      particleCount: number;
      angle: number;
      spread: number;
      origin: { x: number; y: number };
    }) => {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
        rotation: number;
        rotationSpeed: number;
      }> = [];

      for (let i = 0; i < particleCount; i++) {
        const angleRad = (angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
        particles.push({
          x: origin.x * canvas.width,
          y: origin.y * canvas.height,
          vx: Math.cos(angleRad) * (Math.random() * 10 + 5),
          vy: Math.sin(angleRad) * (Math.random() * 10 + 5) - 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10
        });
      }

      let animationId: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
          p.vy += 0.5;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();

          if (p.y > canvas.height) {
            particles.splice(index, 1);
          }
        });

        if (particles.length > 0) {
          animationId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationId);
          document.body.removeChild(canvas);
        }
      };

      animate();
    };

    const frame = () => {
      const timeLeft = end - Date.now();
      
      if (timeLeft <= 0) return;

      const particleCount = 3;
      
      confettiPiece({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 }
      });
      
      confettiPiece({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 }
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [colors, duration]);

  return null;
};
