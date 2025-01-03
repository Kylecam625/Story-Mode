import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store/themeStore';

interface RandomSelectorProps {
  options: Array<{ text: string }>;
  duration?: number;
  onComplete: (selectedIndex: number) => void;
}

export function RandomSelector({ options, duration = 2000, onComplete }: RandomSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setIsAnimating] = useState(true);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    let startTime = Date.now();
    let frame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // Speed starts fast and slows down
        const speed = Math.max(1, Math.floor((1 - progress) * 10));
        if (elapsed % speed === 0) {
          setCurrentIndex(prev => (prev + 1) % options.length);
        }
        frame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        // Select final option with some randomness
        const finalIndex = Math.floor(Math.random() * options.length);
        setCurrentIndex(finalIndex);
        onComplete(finalIndex);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [options.length, duration, onComplete]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {options.map((option, index) => (
        <div
          key={index}
          className={`p-6 text-lg transition-all duration-200 ${
            index === currentIndex ? 'scale-105' : 'scale-95 opacity-50'
          }`}
          style={{
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            position: 'absolute',
            width: '100%',
            backgroundColor: index === currentIndex ? `${currentTheme.primary}20` : 'transparent',
            borderColor: currentTheme.primary,
            boxShadow: index === currentIndex ? `0 0 20px ${currentTheme.primary}40` : 'none'
          }}
        >
          {option.text}
        </div>
      ))}
    </div>
  );
}