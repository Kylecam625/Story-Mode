import { voiceManager } from './VoiceManager';
import { elevenlabs } from '../api/elevenlabs';
import { logger } from '../logger';
import { useSettingsStore } from '../../store/settingsStore';

class SimpleNarrationManager {
  private audioElement: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private isPlaying = false;
  private initialized = false;
  private volume: number;
  private fallbackVoiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID_NARRATOR;

  constructor() {
    this.volume = 0.7;
  }

  private cleanup() {
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
      this.currentUrl = null;
    }
  }

  async init() {
    if (this.initialized) return;
    
    try {
      await voiceManager.init();
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.preload = 'auto';
        this.audioElement.volume = this.volume;
      }
      this.initialized = true;
      logger.debug('[SimpleNarrationManager] 🎵 Initialized successfully');
    } catch (error) {
      logger.error('[SimpleNarrationManager] ❌ Failed to initialize:', error);
      throw error;
    }
  }

  async playNarration(character: string, text: string): Promise<void> {
    logger.debug('[SimpleNarrationManager] 🎯 Starting narration:', {
      character,
      textLength: text.length,
      isPlaying: this.isPlaying,
      initialized: this.initialized
    });

    if (!this.initialized) {
      await this.init();
    }

    if (!useSettingsStore.getState().narrativeAudio) {
      logger.debug('[SimpleNarrationManager] ⏭️ Skipping - audio disabled');
      return new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (this.isPlaying) {
      logger.debug('[SimpleNarrationManager] 🛑 Stopping current playback');
      this.stop();
    }

    
    try {
      const voiceId = voiceManager.getVoiceId(character);
      if (!voiceId && character.toLowerCase() !== 'narrator') {
        logger.warn('[SimpleNarrationManager] ⚠️ Using fallback voice:', {
          character,
          fallbackVoice: 'narrator'
        });
      }

      logger.debug('[SimpleNarrationManager] 🗣️ Generating speech:', {
        character,
        voiceId: voiceId || this.fallbackVoiceId,
        textLength: text.length
      });

      const response = await elevenlabs.textToSpeech({ 
        text, 
        voiceId: voiceId || this.fallbackVoiceId 
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const blob = await response.blob();
      this.cleanup();
      this.currentUrl = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        if (!this.audioElement) {
          return reject(new Error('No audio element'));
        }

        this.audioElement.src = this.currentUrl!;
        this.audioElement.onended = () => {
          logger.debug('[SimpleNarrationManager] ✅ Playback complete');
          this.cleanup();
          this.isPlaying = false;
          resolve();
        };
        this.audioElement.onerror = (e) => {
          logger.error('[SimpleNarrationManager] ❌ Playback error:', e);
          this.cleanup();
          this.isPlaying = false;
          reject(e);
        };

        logger.debug('[SimpleNarrationManager] ▶️ Starting playback');
        this.isPlaying = true;
        this.audioElement.play().catch((error) => {
          logger.error('[SimpleNarrationManager] ❌ Failed to start playback:', error);
          this.isPlaying = false;
          reject(error);
        });
      });
    } catch (error) {
      logger.error('[SimpleNarrationManager] ❌ Narration failed:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  stop() {
    if (this.audioElement && this.isPlaying) {
      logger.debug('[SimpleNarrationManager] 🛑 Stopping narration');
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
      this.cleanup();
    }
  }

  stopCurrentNarration() {
    logger.debug('[SimpleNarrationManager] 🛑 Stopping current narration');
    this.stop();
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  isReady() {
    return this.initialized;
  }
}

export const simpleNarrationManager = new SimpleNarrationManager();