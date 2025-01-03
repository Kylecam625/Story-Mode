import { useState } from 'react';
import { Button } from '../ui/Button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { VoicePreviewPlayer } from '../../lib/audio/VoicePreviewPlayer';
import { CHARACTER_VOICES, NARRATOR_VOICES } from '../../lib/constants/voices';
import { logger } from '../../lib/logger';

const voicePlayer = new VoicePreviewPlayer();

interface VoiceTestCardProps {
  name: string;
  description: string;
  voiceId: string;
  isPlaying: boolean;
  isLoading: boolean;
  onTest: () => void;
}

function VoiceTestCard({ 
  name, 
  description, 
  voiceId, 
  isPlaying, 
  isLoading, 
  onTest 
}: VoiceTestCardProps) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-purple-300">{description}</p>
        <p className="text-xs text-gray-400 mt-1">ID: {voiceId}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onTest}
        disabled={isLoading}
        className="relative"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="animate-pulse" />
        ) : (
          <Volume2 />
        )}
      </Button>
    </div>
  );
}

export function VoiceTest({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testVoice = async (name: string, voiceId: string, isNarrator: boolean = false) => {
    try {
      if (isPlaying) {
        voicePlayer.stop();
        setIsPlaying(null);
        return;
      }

      setError(null);
      setIsLoading(name);
      
      setIsPlaying(name);
      await voicePlayer.playPreview(name, voiceId, isNarrator ? 'narrator' : 'character');
      setIsPlaying(null);
    } catch (err) {
      logger.error('Voice test failed:', err);
      setError('Failed to test voice');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Voice Test Panel</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded p-3 mb-4 text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Character Voices</h3>
            <div className="space-y-2">
              {Object.entries(CHARACTER_VOICES).map(([key, voice]) => (
                <VoiceTestCard
                  key={key}
                  name={voice.name}
                  description={voice.description}
                  voiceId={voice.voiceId}
                  isPlaying={isPlaying === voice.name}
                  isLoading={isLoading === voice.name}
                  onTest={() => testVoice(voice.name, voice.voiceId)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Narrator Voices</h3>
            <div className="space-y-2">
              {Object.entries(NARRATOR_VOICES).map(([key, voice]) => (
                <VoiceTestCard
                  key={key}
                  name={voice.name}
                  description={voice.description}
                  voiceId={voice.voiceId}
                  isPlaying={isPlaying === voice.name}
                  isLoading={isLoading === voice.name}
                  onTest={() => testVoice(voice.name, voice.voiceId, true)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}