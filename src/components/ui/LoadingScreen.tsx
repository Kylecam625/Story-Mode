import { useThemeStore } from '../../store/themeStore';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Generating your story...' }: LoadingScreenProps) {
  const { currentTheme } = useThemeStore();
  
  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <Loader2 
        className="w-12 h-12 animate-spin mb-4"
        style={{ color: currentTheme.primary }}
      />
      <div 
        className="text-lg font-medium animate-pulse"
        style={{ color: currentTheme.text }}
      >
        {message}
      </div>
      <div 
        className="mt-2 text-sm opacity-75"
        style={{ color: currentTheme.text }}
      >
        This may take a few moments...
      </div>
    </div>
  );
}