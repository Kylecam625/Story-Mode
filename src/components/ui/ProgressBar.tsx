import { useThemeStore } from '../../store/themeStore';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const { currentTheme } = useThemeStore();
  const percentage = (value / max) * 100;
  
  return (
    <div className={`bg-gray-700 h-2 ${className}`}>
      <div 
        className="h-full transition-all duration-500"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: currentTheme.primary
        }}
      />
    </div>
  );
}