import { useState, useEffect } from 'react';
import { AudioVisualizer } from './AudioVisualizer';
import { backgroundMusic } from '../../lib/audio';
import { useThemeStore } from '../../store/themeStore';

export function AudioControls() {
  const { currentTheme } = useThemeStore();
  const [showVisualizer, setShowVisualizer] = useState(false);

  useEffect(() => {
    // Start background music if ready
    if (backgroundMusic.isReady()) {
      backgroundMusic.play();
    }
  }, []);

  const analyzer = backgroundMusic.getAnalyzer();
  const audioContext = backgroundMusic.getContext();

  // Only show visualizer when we have both analyzer and context
  useEffect(() => {
    if (analyzer && audioContext) {
      setShowVisualizer(true);
    }
  }, [analyzer, audioContext]);

  return (
    <>
      {showVisualizer && analyzer && audioContext && (
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-40">
          <AudioVisualizer 
            audioContext={audioContext} 
            analyzerNode={analyzer}
            color={currentTheme.particleColor}
            height={180}
          />
        </div>
      )}
    </>
  );
}