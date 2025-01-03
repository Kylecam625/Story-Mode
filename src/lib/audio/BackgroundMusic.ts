import { logger } from '../logger/index';
import { AUDIO_CONFIG } from './constants';

class BackgroundMusic {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private volume = 0.3;
  private isInitialized = false;
  private isPlaying = false;
  private autoResumeTimeout: number | null = null;

  constructor() {
    this.init();
    // Add click listener to the document to resume AudioContext
    document.addEventListener('click', () => this.resumeAudioContext(), { once: true });
    
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      if (this.autoResumeTimeout) {
        window.clearTimeout(this.autoResumeTimeout);
      }
    });
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // When tab becomes visible, try to resume playback
      if (this.isPlaying) {
        this.resumePlayback();
      }
    }
  }

  private async resumePlayback() {
    if (!this.audio || !this.isInitialized) return;

    try {
      await this.resumeAudioContext();
      if (this.audio.paused) {
        await this.audio.play();
        logger.debug('Background music resumed after visibility change');
      }
    } catch (error) {
      logger.error('Failed to resume background music:', error);
      // Try again in 1 second if failed
      if (this.autoResumeTimeout) {
        window.clearTimeout(this.autoResumeTimeout);
      }
      this.autoResumeTimeout = window.setTimeout(() => this.resumePlayback(), 1000);
    }
  }

  private async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyzer = this.audioContext.createAnalyser();
      this.gainNode = this.audioContext.createGain();
      
      this.analyzer.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;

      this.audio = new Audio(AUDIO_CONFIG.FILES.BACKGROUND_MUSIC);
      this.audio.loop = true;
      
      // Add error handling for the audio element
      this.audio.addEventListener('error', (e) => {
        logger.error('Background music error:', e);
        // Try to recover by reinitializing
        this.isInitialized = false;
        this.init();
      });

      // Add ended handler to ensure we know if playback stops
      this.audio.addEventListener('ended', () => {
        if (this.isPlaying && this.audio?.loop) {
          logger.debug('Background music ended but should be looping, attempting to restart');
          this.resumePlayback();
        }
      });
      
      const source = this.audioContext.createMediaElementSource(this.audio);
      source.connect(this.analyzer);
      
      this.isInitialized = true;
      logger.debug('BackgroundMusic initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize BackgroundMusic:', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext?.state === 'suspended') {
      try {
        await this.audioContext.resume();
        logger.debug('AudioContext resumed successfully');
      } catch (error) {
        logger.error('Failed to resume AudioContext:', error);
      }
    }
  }

  async play() {
    if (!this.audio || !this.isInitialized) return;
    
    try {
      if (this.isPlaying) {
        logger.debug('Background music is already playing');
        return;
      }

      await this.resumeAudioContext();
      await this.audio.play();
      this.isPlaying = true;
      logger.debug('Background music started playing');
    } catch (error) {
      logger.error('Failed to play background music:', error);
      // Try to recover by reinitializing
      this.isInitialized = false;
      await this.init();
      // Try playing again after reinitialization
      if (!this.isPlaying) {
        this.play();
      }
    }
  }

  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (!this.audio) return;
    logger.debug('Setting background music volume:', {
      requestedValue: value,
      validatedVolume: this.volume
    });
    this.audio.volume = this.volume;
  }

  getVolume(): number {
    return this.volume;
  }

  toggleMute() {
    if (!this.audio) return;
    try {
      this.audio.muted = !this.audio.muted;
    } catch (error) {
      logger.error('Failed to toggle mute:', error);
    }
  }

  getAnalyzer() {
    return this.analyzer;
  }

  getContext() {
    return this.audioContext;
  }

  isReady() {
    return this.isInitialized;
  }
}

export const backgroundMusic = new BackgroundMusic();