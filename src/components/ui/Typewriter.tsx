import { useEffect, useState, useRef } from 'react';

export interface TypewriterProps {
  text: string;
  speed?: number;
  playSound?: boolean;
  skipAnimation?: boolean;
  isPlaying?: boolean;
  onComplete?: () => void;
  className?: string;
  direction?: 'ltr' | 'rtl';
}

export function Typewriter({ 
  text, 
  speed = 35,
  playSound = false,
  skipAnimation = false,
  isPlaying = false,
  onComplete,
  className = '',
  direction = 'ltr'
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasStartedTypingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousTextRef = useRef(text);

  // Initialize audio
  useEffect(() => {
    if (playSound && !audioRef.current) {
      const audio = new Audio('/audio/typing.wav');
      audio.volume = 0.2;
      audio.loop = true;
      audioRef.current = audio;
    }

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [playSound]);

  // Reset state when text changes or isPlaying becomes true
  useEffect(() => {
    if (text !== previousTextRef.current || isPlaying) {
      setCurrentIndex(0);
      setDisplayText('');
      hasStartedTypingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      previousTextRef.current = text;
    }
  }, [text, isPlaying]);

  useEffect(() => {
    if (!isPlaying || skipAnimation) {
      setDisplayText(text);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      hasStartedTypingRef.current = false;
      onComplete?.();
      return;
    }

    if (currentIndex >= text.length) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      hasStartedTypingRef.current = false;
      onComplete?.();
      return;
    }

    // Start typing sound only when we begin typing
    if (!hasStartedTypingRef.current && playSound && audioRef.current) {
      hasStartedTypingRef.current = true;
      audioRef.current.play().catch(console.error);
    }

    const timeoutId = setTimeout(() => {
      if (direction === 'rtl') {
        // For RTL, we start from the end and reveal characters from right to left
        setDisplayText(text.slice(text.length - currentIndex - 1));
      } else {
        // For LTR, we start from the beginning (default behavior)
        setDisplayText(text.slice(0, currentIndex + 1));
      }
      setCurrentIndex(i => i + 1);
    }, speed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentIndex, text, speed, skipAnimation, isPlaying, playSound, onComplete, direction]);

  return (
    <div className={`whitespace-pre-wrap ${direction === 'rtl' ? 'text-right' : ''} ${className}`}>
      {displayText}
    </div>
  );
}