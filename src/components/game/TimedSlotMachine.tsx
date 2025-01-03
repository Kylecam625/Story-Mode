import { useState, useRef, useEffect, memo, forwardRef, useImperativeHandle } from 'react';
import { Button } from '../ui/Button';
import { Timer } from 'lucide-react';

interface TimedSlotMachineProps {
  decisions: any[];
  isLoading: boolean;
  onDecisionSelect: (decision: any, index: number) => void;
  onComplete: (selectedIndex: number) => void;
}

export interface TimedSlotMachineHandle {
  start: () => void;
  reset: () => void;
}

const TimerDisplay = memo(function TimerDisplay({ 
  timeLeft, 
  isActive 
}: { 
  timeLeft: number; 
  isActive: boolean;
}) {
  if (!isActive) return null;

  return (
    <div className="flex justify-center items-center mb-6">
      <div className={`
        bg-gray-900/50 backdrop-blur-md rounded-lg px-6 py-3 
        border border-purple-500/10 shadow-lg
        relative before:absolute before:inset-0 before:rounded-lg
        before:bg-purple-500/10 before:animate-[glow_2s_ease-in-out_infinite]
        after:absolute after:inset-0 after:rounded-lg
        after:bg-gradient-to-r after:from-purple-500/10 after:to-fuchsia-500/10
        after:animate-[glow_3s_ease-in-out_infinite_0.5s]
        shadow-purple-500/20
      `}>
        <div className="flex items-center gap-3 relative z-10">
          <Timer size={18} className="text-purple-400" />
          <div className="font-mono text-lg font-medium bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
            {timeLeft}s
          </div>
          <div className="w-32 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const TimedSlotMachine = memo(forwardRef<TimedSlotMachineHandle, TimedSlotMachineProps>(function TimedSlotMachine({
  decisions,
  isLoading,
  onDecisionSelect,
  onComplete
}, ref) {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const spinCountRef = useRef(0);
  const slotMachineRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const selectedIndexRef = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    spinAudioRef.current = new Audio('/audio/click.mp3');
    spinAudioRef.current.volume = 0.5;
    spinAudioRef.current.playbackRate = 3.0;
    return () => {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
        spinAudioRef.current = null;
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timerRef.current);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      startSlotMachine();
    }
  }, [timeLeft, isTimerActive]);

  const startSlotMachine = () => {
    spinCountRef.current = 0;
    selectedIndexRef.current = Math.floor(Math.random() * decisions.length);
    setIsActive(true);
    setCurrentIndex(0);
  };

  // Reset function
  const reset = (newTime: number = 10) => {
    setTimeLeft(newTime);
    setIsTimerActive(true);
    setIsActive(false);
    setCurrentIndex(0);
    spinCountRef.current = 0;
    selectedIndexRef.current = null;
    if (slotMachineRef.current) clearTimeout(slotMachineRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    start: () => {
      setTimeLeft(20);
      setIsTimerActive(true);
    },
    reset: () => reset(10)
  }), []);

  // Slot machine effect
  useEffect(() => {
    if (isActive && decisions.length > 0) {
      const INITIAL_SPEED = 50;
      const MAX_SPEED = 800;
      
      // Calculate speed using exponential slowdown
      const speed = Math.min(
        INITIAL_SPEED * Math.pow(1.15, Math.floor(spinCountRef.current / 2)),
        MAX_SPEED
      );

      slotMachineRef.current = setTimeout(() => {
        // Play sound when option changes
        if (spinAudioRef.current) {
          spinAudioRef.current.currentTime = 0;
          spinAudioRef.current.play().catch(() => {
            // Ignore audio play errors
          });
        }

        // Continue spinning
        setCurrentIndex(prev => (prev + 1) % decisions.length);
        spinCountRef.current += 1;

        // Only stop when we've spun enough times and reached max speed
        if (spinCountRef.current >= 25 && speed >= MAX_SPEED) {
          // Set final position and notify parent
          setCurrentIndex(selectedIndexRef.current!);
          setTimeout(() => {
            setIsActive(false);
            onComplete(selectedIndexRef.current!);
          }, 500);
        }
      }, speed);

      return () => {
        if (slotMachineRef.current) {
          clearTimeout(slotMachineRef.current);
        }
      };
    }
  }, [isActive, currentIndex, decisions, onComplete]);

  return (
    <div>
      <TimerDisplay timeLeft={timeLeft} isActive={isTimerActive} />
      <div className="space-y-3">
        {decisions.map((decision, index) => (
          <Button
            key={index}
            onClick={() => onDecisionSelect(decision, index)}
            className={`w-full text-left justify-start p-4 transition-all ${
              isActive && index === currentIndex
                ? 'bg-purple-600/20 scale-[1.02]'
                : 'hover:scale-[1.02]'
            }`}
            variant="secondary"
            disabled={isLoading || isActive}
          >
            {isLoading && index === currentIndex ? 'Generating story...' : decision.text}
          </Button>
        ))}
      </div>
    </div>
  );
})); 