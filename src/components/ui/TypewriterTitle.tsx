import { Typewriter } from './Typewriter';
import { GradientText } from './GradientText';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface TypewriterTitleProps {
  text: string;
  className?: string;
}

export function TypewriterTitle({ text, className = '' }: TypewriterTitleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { typingSound } = useSettingsStore();

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  return (
    <h2 className={`text-2xl font-bold text-center animate-title ${className}`}>
      <GradientText className="inline-block">
        <Typewriter 
          text={text}
          speed={50}
          playSound={typingSound}
          isPlaying={isPlaying}
          className="inline-block"
        />
      </GradientText>
    </h2>
  );
}