import { useEffect, useRef, memo } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface ParticleBackgroundProps {
  audioAnalyzer?: AnalyserNode;
  color?: string;
}

function ParticleBackgroundComponent({ 
  audioAnalyzer, 
  color = 'rgba(168, 85, 247, 0.4)'
}: ParticleBackgroundProps) {
  const { particleEffects, particleCount } = useSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    
    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.2
    });

    // Track mouse movement for particle repulsion
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: particleCount }, () => createParticle());
    };

    const animate = () => {
      if (!particleEffects) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let intensity = 1;
      if (audioAnalyzer) {
        const dataArray = new Uint8Array(audioAnalyzer.frequencyBinCount);
        audioAnalyzer.getByteFrequencyData(dataArray);
        intensity = 1 + (dataArray.reduce((a, b) => a + b, 0) / dataArray.length) / 96;
      }

      particlesRef.current.forEach(particle => {
        // Calculate distance to mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Add repulsion from mouse position
        if (distance < 200) {
          const force = (200 - distance) / 2000;
          particle.speedX -= dx * force;
          particle.speedY -= dy * force;
          
          // Add slight randomness to repulsion for more natural movement
          particle.speedX += (Math.random() - 0.5) * force * 0.5;
          particle.speedY += (Math.random() - 0.5) * force * 0.5;
        }

        // Apply velocity with music intensity
        particle.x += particle.speedX * intensity * 1.5;
        particle.y += particle.speedY * intensity * 1.5;

        // Add some natural movement
        particle.speedX += (Math.random() - 0.5) * 0.02;
        particle.speedY += (Math.random() - 0.5) * 0.02;
        
        // Dampen speed
        particle.speedX *= 0.98;
        particle.speedY *= 0.98;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const glowSize = particle.size * intensity * 2;
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, color.replace(/[\d.]+\)$/, `${particle.opacity})`));
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioAnalyzer, color, particleEffects, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent', zIndex: 0 }}
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ParticleBackground = memo(ParticleBackgroundComponent);