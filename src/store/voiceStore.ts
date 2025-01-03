import { create } from 'zustand';
import { CHARACTER_VOICES } from '../lib/constants/voices';

interface VoiceStore {
  playerVoiceId: string | null;
  narratorVoiceId: string | null;
  characterVoices: Record<string, string>;
  
  setPlayerVoice: (voiceId: string) => void;
  setNarratorVoice: (voiceId: string) => void;
  assignCharacterVoices: (playerVoiceId: string) => Record<string, string>;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  playerVoiceId: null,
  narratorVoiceId: null,
  characterVoices: {},
  
  setPlayerVoice: (voiceId) => set({ playerVoiceId: voiceId }),
  
  setNarratorVoice: (voiceId) => set({ narratorVoiceId: voiceId }),
  
  assignCharacterVoices: (playerVoiceId) => {
    // Get available voices excluding the player's voice
    const availableVoices = Object.values(CHARACTER_VOICES)
      .filter(voice => voice.voiceId !== playerVoiceId)
      .map(voice => voice.voiceId);
    
    // Assign voices to characters
    const characterVoices: Record<string, string> = {
      'Milo': availableVoices[0],
      'Aria': availableVoices[1],
      'Dusty': availableVoices[2],
      'Ember': availableVoices[3]
    };
    
    set({ characterVoices });
    return characterVoices;
  }
}));