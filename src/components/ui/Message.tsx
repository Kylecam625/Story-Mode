import { memo } from 'react';
import { Typewriter } from './Typewriter';
import { getCharacterColor } from '../../lib/constants/colors';
import { SkipForward } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface MessageProps {
  type: 'narration' | 'dialogue';
  speaker?: string;
  content: string;
  isPlaying?: boolean;
  isVisible?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const Message = memo(function Message({ 
  type, 
  speaker, 
  content,
  isPlaying = false,
  isVisible = true,
  onComplete,
  onSkip
}: MessageProps) {
  const { typingSound } = useSettingsStore();
  if (!isVisible) return null;

  const { bg: bgGradient, text: textColor, name: nameColor } = getCharacterColor(speaker || 'Narrator');
  const isNarrator = speaker === 'Narrator';

  return (
    <div className={`animate-fadeIn ${type === 'narration' ? 'px-4 mb-6' : 'px-2 mb-8'} relative`}>
      <div className="flex items-start gap-4">
        {/* Skip Button */}
        {isPlaying && (
          <button
            onClick={onSkip}
            className={`shrink-0 mt-1 flex items-center justify-center gap-1 text-xs ${nameColor} hover:text-white bg-gray-900/50 hover:bg-gray-900/70 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}
            title="Skip message"
          >
            <span className="hidden sm:inline">Skip</span>
            <SkipForward size={14} />
          </button>
        )}
        <div className="flex-1">
          {/* Message Container with Speaker Name */}
          <div className="relative flex flex-col items-center">
            {/* Speaker name above message */}
            {speaker && !isNarrator && (
              <div className="flex justify-center mb-0.5">
                <div className={`text-sm font-semibold tracking-wide ${nameColor} bg-gray-900/30 px-3 py-1 rounded-lg backdrop-blur-sm shadow-sm`}>
                  {speaker}
                </div>
              </div>
            )}
            {/* Message box */}
            <div className={`relative rounded-lg p-4 bg-gradient-to-br ${bgGradient} backdrop-blur-sm border border-white/5 shadow-lg ring-1 ring-white/10 ${isNarrator ? 'w-full' : 'w-[85%]'}`}>
              <div className={textColor}>
                <Typewriter 
                  text={content} 
                  speed={35}
                  playSound={isPlaying && typingSound}
                  skipAnimation={!isVisible || !isPlaying}
                  isPlaying={isVisible && isPlaying}
                  onComplete={onComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});