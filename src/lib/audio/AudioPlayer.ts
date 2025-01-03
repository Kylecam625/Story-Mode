import { logger } from '../logger';
import { validateVolume } from './utils/volume';
import { AUDIO_CONFIG } from './constants';
import type { AudioConfig, AudioState } from './types';

export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private onEndedCallbacks: Set<() => void> = new Set();
  private volume = 0.7;
  private state: AudioState = {
    isPlaying: false,
    isDestroyed: false,
    isInitialized: false,
    lastError: null
  };

  constructor(config: AudioConfig = {}) {
    logger.debug('AudioPlayer constructor called:', { 
      config,
      hasVolume: 'volume' in config,
      configVolume: config.volume,
      defaultVolume: AUDIO_CONFIG.VOLUME.DEFAULT
    });

    this.volume = validateVolume(config.volume);
    
    logger.debug('Volume initialized:', {
      rawVolume: config.volume,
      validatedVolume: this.volume,
      isFinite: Number.isFinite(this.volume),
      min: AUDIO_CONFIG.VOLUME.MIN,
      max: AUDIO_CONFIG.VOLUME.MAX
    });

    this.init();
  }

  private async init() {
    if (this.state.isInitialized) return;

    try {
      logger.debug('Starting AudioPlayer initialization');

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      logger.debug('AudioContext created:', {
        sampleRate: this.audioContext.sampleRate,
        state: this.audioContext.state
      });
      
      this.gainNode = this.audioContext.createGain();
      logger.debug('GainNode created');

      this.gainNode.connect(this.audioContext.destination);
      logger.debug('GainNode connected to destination');
      
      logger.debug('Setting initial gain value:', {
        volume: this.volume,
        currentTime: this.audioContext.currentTime,
        gainNodeValue: this.gainNode.gain.value
      });

      this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

      this.audio = new Audio();
      logger.debug('Audio element created');

      if (this.audio) {
        logger.debug('Setting audio element volume:', {
          volume: this.volume,
          elementVolume: this.audio.volume
        });
        this.audio.volume = this.volume;
      }

      this.state.isInitialized = true;
      logger.debug('AudioPlayer initialized successfully:', {
        contextState: this.audioContext.state,
        volume: this.volume,
        gainValue: this.gainNode.gain.value,
        audioElement: {
          volume: this.audio?.volume,
          readyState: this.audio?.readyState,
          networkState: this.audio?.networkState
        }
      });
    } catch (error) {
      this.state.lastError = error instanceof Error ? error : new Error('Failed to initialize audio');
      logger.error('AudioPlayer initialization failed:', {
        error,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        volume: this.volume,
        isVolumeFinite: Number.isFinite(this.volume),
        contextState: this.audioContext?.state,
        gainNode: !!this.gainNode,
        audio: !!this.audio,
        state: this.state
      });
      throw this.state.lastError;
    }
  }

  async play(url: string): Promise<void> {
    if (!this.audio || this.state.isDestroyed) {
      throw new Error('AudioPlayer is not initialized or has been destroyed');
    }

    try {
      this.stop();
      
      this.audio.src = url;
      this.audio.volume = this.volume;
      this.state.isPlaying = true;

      await this.audio.play();
    } catch (error) {
      this.state.lastError = error instanceof Error ? error : new Error('Playback failed');
      logger.error('Playback failed:', error);
      throw this.state.lastError;
    }
  }

  stop() {
    if (this.audio && this.state.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.state.isPlaying = false;
    }
  }

  setVolume(value: number) {
    const newVolume = Math.max(0, Math.min(1, value));
    this.volume = newVolume;
    
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        this.volume,
        this.gainNode.context.currentTime
      );
    }
    logger.debug('Audio volume set:', { volume: this.volume });
  }

  onEnded(callback: () => void) {
    this.onEndedCallbacks.add(callback);
    if (this.audio) {
      this.audio.onended = () => {
        this.state.isPlaying = false;
        this.onEndedCallbacks.forEach(cb => cb());
        this.onEndedCallbacks.clear();
      };
    }
  }

  destroy() {
    this.stop();
    this.state.isDestroyed = true;
    this.state.isInitialized = false;
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audio = null;
    this.onEndedCallbacks.clear();
  }

  getState(): AudioState & { volume: number } {
    return { 
      ...this.state,
      volume: this.volume
    };
  }
}