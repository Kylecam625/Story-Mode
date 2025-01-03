import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function VolumeSlider({ value, onChange, label }: VolumeSliderProps) {
  const { currentTheme } = useThemeStore();
  const getVolumeIcon = () => {
    if (value === 0) return <VolumeX size={20} />;
    if (value < 0.33) return <Volume size={20} />;
    if (value < 0.66) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onChange(value === 0 ? 0.5 : 0)}
        className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
        style={{ color: currentTheme.text }}
      >
        {getVolumeIcon()}
      </button>
      <div className="flex-1">
        <label className="block text-sm mb-1" style={{ color: currentTheme.text }}>{label}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: currentTheme.primary }}
        />
      </div>
    </div>
  );
}