import { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useVoiceStore } from '../../../store/voiceStore';
import { Button } from '../../ui/Button';
import { BackButton } from '../../ui/BackButton';
import { GameState } from '../../../types';
import { Volume2, VolumeX, Loader2, ChevronDown } from 'lucide-react';
import { VoicePreviewPlayer } from '../../../lib/audio/VoicePreviewPlayer';
import { CHARACTER_VOICES, NARRATOR_VOICES, VoiceConfig } from '../../../lib/constants/voices';
import { voiceManager } from '../../../lib/audio/VoiceManager';
import { simpleNarrationManager } from '../../../lib/audio/SimpleNarrationManager';
import { TypewriterTitle } from '../../ui/TypewriterTitle';
import { logger } from '../../../lib/logger';

const voicePlayer = new VoicePreviewPlayer();

// Combine all voices into one object with proper typing
const ALL_VOICES: Record<string, VoiceConfig> = {
  ...CHARACTER_VOICES,
  ...NARRATOR_VOICES
};

export function VoiceSelection() {
  const { setGameState, characterName } = useGameStore();
  const { setPlayerVoice, setNarratorVoice } = useVoiceStore();
  const [selectedCharacterVoice, setSelectedCharacterVoice] = useState<string | null>(null);
  const [selectedNarratorVoice, setSelectedNarratorVoice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [characterDropdownOpen, setCharacterDropdownOpen] = useState(false);
  const [narratorDropdownOpen, setNarratorDropdownOpen] = useState(false);

  const handlePreview = async (voiceName: string, voiceId: string, isNarrator: boolean = false) => {
    try {
      if (isPlaying === voiceName) {
        voicePlayer.stop();
        setIsPlaying(null);
        return;
      }

      setError(null);
      setIsLoading(voiceName);
      
      setIsPlaying(voiceName);
      await voicePlayer.playPreview(voiceName, voiceId, isNarrator ? 'narrator' : 'character');
      setIsPlaying(null);
    } catch (err) {
      logger.error('Voice preview failed:', err);
      setError('Failed to preview voice');
    } finally {
      setIsLoading(null);
    }
  };

  const handleContinue = async () => {
    if (!selectedCharacterVoice || !selectedNarratorVoice) {
      setError('Please select both a character voice and a narrator voice');
      return;
    }

    try {
      await voiceManager.init();
      logger.debug('Voice manager initialized');
      
      const characterVoice = ALL_VOICES[selectedCharacterVoice];
      const narratorVoice = ALL_VOICES[selectedNarratorVoice];

      if (!characterVoice?.voiceId || !narratorVoice?.voiceId) {
        setError('Invalid voice configuration');
        return;
      }

      setPlayerVoice(characterVoice.voiceId);
      setNarratorVoice(narratorVoice.voiceId);
      
      const voiceMap = {
        [characterName.toLowerCase()]: characterVoice.voiceId,
        [characterName.toUpperCase()]: characterVoice.voiceId,
        [characterName]: characterVoice.voiceId,
        
        ...Object.entries(ALL_VOICES)
          .filter(([_, voice]) => voice.voiceId !== characterVoice.voiceId)
          .reduce((acc, [name, voice]) => ({
            ...acc,
            [name.toLowerCase()]: voice.voiceId,
            [name]: voice.voiceId,
            [name.toUpperCase()]: voice.voiceId
          }), {}),
        
        'narrator': narratorVoice.voiceId,
        'Narrator': narratorVoice.voiceId,
        'NARRATOR': narratorVoice.voiceId,
        'nix': narratorVoice.voiceId,
        'Nix': narratorVoice.voiceId,
        'NIX': narratorVoice.voiceId
      };

      logger.debug('Setting voice configuration:', {
        voiceMap,
        characterName,
        narratorVoice: narratorVoice.name
      });

      await voiceManager.setVoices(voiceMap);
      await simpleNarrationManager.init();
      logger.debug('Narration manager initialized');
      
      setGameState(GameState.INITIAL_NARRATION);
    } catch (error) {
      logger.error('Failed to initialize voice system:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize voice system');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative z-50">
      <BackButton />
      <TypewriterTitle text="Choose Your Voices" />
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded p-3 text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Character Voice Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Your Character's Voice</h3>
          <p className="text-sm text-purple-300">Choose any voice for your character</p>
          
          <div className="relative">
            <button
              onClick={() => {
                setCharacterDropdownOpen(!characterDropdownOpen);
                setNarratorDropdownOpen(false);
              }}
              className="w-full p-4 bg-gray-700/30 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-all duration-200"
            >
              <div>
                {selectedCharacterVoice ? (
                  <div>
                    <div className="font-medium">{ALL_VOICES[selectedCharacterVoice].name}</div>
                    <div className="text-sm text-purple-300">{ALL_VOICES[selectedCharacterVoice].description}</div>
                  </div>
                ) : (
                  <div className="text-gray-400">Select a voice</div>
                )}
              </div>
              <ChevronDown className={`transition-transform duration-200 ${characterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {characterDropdownOpen && (
              <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700">
                <div className="max-h-80 overflow-y-auto">
                  {Object.entries(ALL_VOICES).map(([key, voice]) => (
                    <div
                      key={key}
                      className={`p-4 flex items-center justify-between ${
                        selectedNarratorVoice === key ? 'opacity-50 cursor-not-allowed bg-gray-700/30' :
                        selectedCharacterVoice === key ? 'bg-purple-500/20' : 'hover:bg-gray-700/50 cursor-pointer'
                      } transition-all duration-200`}
                      onClick={() => {
                        if (selectedNarratorVoice !== key) {
                          setSelectedCharacterVoice(key);
                          setCharacterDropdownOpen(false);
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-sm text-purple-300">{voice.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(voice.name, voice.voiceId);
                        }}
                        disabled={isLoading !== null}
                      >
                        {isLoading === voice.name ? (
                          <Loader2 className="animate-spin" />
                        ) : isPlaying === voice.name ? (
                          <VolumeX />
                        ) : (
                          <Volume2 />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Narrator Voice Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Narrator Voice</h3>
          <p className="text-sm text-purple-300">Select a different voice for narration</p>
          
          <div className="relative">
            <button
              onClick={() => {
                setNarratorDropdownOpen(!narratorDropdownOpen);
                setCharacterDropdownOpen(false);
              }}
              className="w-full p-4 bg-gray-700/30 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-all duration-200"
            >
              <div>
                {selectedNarratorVoice ? (
                  <div>
                    <div className="font-medium">{ALL_VOICES[selectedNarratorVoice].name}</div>
                    <div className="text-sm text-purple-300">{ALL_VOICES[selectedNarratorVoice].description}</div>
                  </div>
                ) : (
                  <div className="text-gray-400">Select a voice</div>
                )}
              </div>
              <ChevronDown className={`transition-transform duration-200 ${narratorDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {narratorDropdownOpen && (
              <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700">
                <div className="max-h-80 overflow-y-auto">
                  {Object.entries(ALL_VOICES).map(([key, voice]) => (
                    <div
                      key={key}
                      className={`p-4 flex items-center justify-between ${
                        selectedCharacterVoice === key ? 'opacity-50 cursor-not-allowed bg-gray-700/30' :
                        selectedNarratorVoice === key ? 'bg-purple-500/20' : 'hover:bg-gray-700/50 cursor-pointer'
                      } transition-all duration-200`}
                      onClick={() => {
                        if (selectedCharacterVoice !== key) {
                          setSelectedNarratorVoice(key);
                          setNarratorDropdownOpen(false);
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-sm text-purple-300">{voice.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(voice.name, voice.voiceId, true);
                        }}
                        disabled={isLoading !== null}
                      >
                        {isLoading === voice.name ? (
                          <Loader2 className="animate-spin" />
                        ) : isPlaying === voice.name ? (
                          <VolumeX />
                        ) : (
                          <Volume2 />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button 
        onClick={handleContinue}
        className="w-full"
        disabled={!selectedCharacterVoice || !selectedNarratorVoice || 
          selectedCharacterVoice === selectedNarratorVoice}
      >
        Continue to Story
      </Button>
    </div>
  );
}