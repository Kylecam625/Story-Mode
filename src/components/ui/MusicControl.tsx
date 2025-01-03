import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './Button';
import { backgroundMusic } from '../../lib/audio/BackgroundMusic';

export function MusicControl() {
  const [isMuted, setIsMuted] = React.useState(false);

  const toggleMute = () => {
    backgroundMusic.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMute}
      className="fixed bottom-4 right-4 bg-gray-800/50 hover:bg-gray-700/50"
      title={isMuted ? 'Unmute music' : 'Mute music'}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </Button>
  );
}