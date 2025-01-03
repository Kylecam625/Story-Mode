import React from 'react';
import { Settings, Check } from 'lucide-react';
import { Button } from './Button';
import { useThemeStore, THEMES } from '../../store/themeStore';
import { VolumeSlider } from './VolumeSlider';
import { backgroundMusic, simpleNarrationManager } from '../../lib/audio';
import { useSettingsStore } from '../../store/settingsStore';

export function ThemeSettings() {
  const [isOpen, setIsOpen] = React.useState(false);
  const settingsRef = React.useRef<HTMLDivElement>(null);
  const { currentTheme, setTheme } = useThemeStore();
  const { 
    particleEffects, 
    toggleParticleEffects, 
    particleCount: storeParticleCount, 
    setParticleCount: storeSetParticleCount,
    typingSound,
    toggleTypingSound
  } = useSettingsStore();
  const [musicVolume, setMusicVolume] = React.useState(backgroundMusic.getVolume());
  const [voiceVolume, setVoiceVolume] = React.useState(0.7);
  
  // Temporary states for settings that need confirmation
  const [tempParticleEffects, setTempParticleEffects] = React.useState(particleEffects);
  const [tempParticleCount, setTempParticleCount] = React.useState(storeParticleCount);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    setTempParticleEffects(particleEffects);
    setTempParticleCount(storeParticleCount);
  }, [isOpen]);

  // Add click outside handler
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        if (hasChanges) {
          // If there are unsaved changes, apply them before closing
          handleSettingsChange();
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, hasChanges]);

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
    backgroundMusic.setVolume(value);
  };

  const handleVoiceVolumeChange = (value: number) => {
    setVoiceVolume(value);
    simpleNarrationManager.setVolume(value);
  };

  const handleSettingsChange = () => {
    if (tempParticleEffects !== particleEffects) {
      toggleParticleEffects();
    }
    if (tempParticleCount !== storeParticleCount) {
      storeSetParticleCount(tempParticleCount);
    }
    setHasChanges(false);
  };

  const handleParticleEffectsChange = (checked: boolean) => {
    setTempParticleEffects(checked);
    setHasChanges(true);
  };

  const handleParticleCountChange = (value: number) => {
    setTempParticleCount(value);
    setHasChanges(true);
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 shadow-lg hover:scale-105"
        style={{
          backgroundColor: currentTheme.background,
          color: currentTheme.text,
          borderColor: currentTheme.primary,
          boxShadow: `0 0 10px ${currentTheme.primary}40`
        }}
      >
        <Settings className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            ref={settingsRef}
            className="rounded-lg p-6 max-w-md w-full mx-4 shadow-xl space-y-6"
            style={{
              backgroundColor: currentTheme.background,
              color: currentTheme.text
            }}
          >
            {/* Volume Controls */}
            <div>
              <h3 className="text-lg font-medium mb-4">Audio Settings</h3>
              <div className="space-y-4">
                <VolumeSlider
                  value={musicVolume}
                  onChange={handleMusicVolumeChange}
                  label="Music Volume"
                />
                <VolumeSlider
                  value={voiceVolume}
                  onChange={handleVoiceVolumeChange}
                  label="Voice Volume"
                />
                <button
                  onClick={toggleTypingSound}
                  className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                    typingSound 
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-gray-800/50 border-gray-700'
                  } border`}
                >
                  <span className="text-sm">Typing Sound</span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    typingSound ? 'bg-purple-500' : 'bg-gray-700'
                  }`}>
                    {typingSound && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Particle Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Visual Effects</h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleParticleEffectsChange(!tempParticleEffects)}
                  className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                    tempParticleEffects 
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-gray-800/50 border-gray-700'
                  } border`}
                >
                  <span className="text-sm">Background Particles</span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    tempParticleEffects ? 'bg-purple-500' : 'bg-gray-700'
                  }`}>
                    {tempParticleEffects && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
                
                {tempParticleEffects && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-gray-400">Particle Count</label>
                      <span className="text-sm text-gray-400 w-12">{tempParticleCount}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={tempParticleCount}
                      onChange={(e) => handleParticleCountChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-track]:bg-gray-700 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:h-2 [&::-ms-track]:bg-gray-700 [&::-ms-track]:rounded-lg [&::-ms-track]:h-2 [&::-ms-thumb]:appearance-none [&::-ms-thumb]:w-4 [&::-ms-thumb]:h-4 [&::-ms-thumb]:rounded-full [&::-ms-thumb]:bg-purple-500 [&::-ms-thumb]:cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(THEMES).map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      setTheme(theme);
                      setIsOpen(false);
                    }}
                    className={`p-4 rounded-lg transition-all duration-200 ${
                      currentTheme.name === theme.name
                        ? 'ring-2 ring-opacity-50'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: theme.primary,
                      boxShadow: currentTheme.name === theme.name 
                        ? `0 0 15px ${theme.primary}40`
                        : 'none'
                    }}
                  >
                    <div className="text-sm font-medium">{theme.name}</div>
                    <div
                      className="w-full h-2 rounded-full mt-2 transition-all duration-300"
                      style={{ backgroundColor: theme.primary }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {hasChanges && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleSettingsChange}
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.background
                  }}
                >
                  Apply Changes
                </Button>
              )}
              <Button
                variant="ghost"
                className={hasChanges ? "flex-1" : "w-full"}
                onClick={() => setIsOpen(false)}
                style={{
                  color: currentTheme.text,
                  borderColor: currentTheme.primary,
                  backgroundColor: `${currentTheme.primary}10`
                }}
              >
                {hasChanges ? "Cancel" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}