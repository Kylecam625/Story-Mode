import { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';

interface Point {
  x: number;
  y: number;
  size: number;
  life: number;
  speedX: number;
  speedY: number;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const points: Point[] = pointsRef.current;
    const mouse = mouseRef.current;

    // Set up canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse movement
    const onMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { x: mouseRef.current.x, y: mouseRef.current.y };
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate mouse speed
      const dx = mouse.x - prevMouseRef.current.x;
      const dy = mouse.y - prevMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Only add points when mouse is moving
      if (speed > 1) {
        points.push({
          x: mouse.x,
          y: mouse.y + (Math.random() - 0.5) * 10,
          size: Math.min(speed * 0.2, 2.5),
          life: 1,
          speedX: dx * 0.1 + (Math.random() - 0.5) * 2,
          speedY: dy * 0.1 + (Math.random() - 0.5) * 2
        });
      }

      // Update and draw points
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        point.life *= 0.96;
        point.x += point.speedX;
        point.y += point.speedY;
        point.speedX *= 0.97;
        point.speedY *= 0.97;

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme.primary.replace('rgb', 'rgba').replace(')', `, ${point.life})`);
        ctx.fill();

        // Remove points that have faded out
        if (point.life < 0.02) {
          points.splice(i, 1);
          i--;
        }
      }

      // Limit number of points
      if (points.length > 45) {
        points.splice(0, points.length - 45);
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}