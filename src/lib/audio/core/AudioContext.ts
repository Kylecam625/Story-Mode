import { logger } from '../../logger';
import { AUDIO_CONFIG } from '../constants';

// Add type declaration for webkit prefix
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

class AudioContextManager {
  private static instance: AudioContextManager;
  private context: AudioContext | null = null;
  private initPromise: Promise<AudioContext> | null = null;

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  async getContext(): Promise<AudioContext> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('AudioContext initialization timeout'));
      }, AUDIO_CONFIG.TIMEOUT.INIT);

      try {
        if (!this.context) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          this.context = new AudioContextClass();
          
          // Handle browser autoplay restrictions
          const resumeAudio = async () => {
            if (this.context?.state === 'suspended') {
              await this.context.resume();
            }
          };
          
          document.addEventListener('click', resumeAudio, { once: true });
          document.addEventListener('touchstart', resumeAudio, { once: true });
        }

        if (this.context.state === 'suspended') {
          await this.context.resume();
        }

        clearTimeout(timeoutId);
        logger.debug('AudioContext initialized:', {
          state: this.context.state,
          sampleRate: this.context.sampleRate
        });

        resolve(this.context);
      } catch (error) {
        clearTimeout(timeoutId);
        logger.error('Failed to initialize AudioContext:', error);
        this.initPromise = null;
        reject(error);
      }
    });

    return this.initPromise;
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
      this.initPromise = null;
    }
  }
}

export const audioContext = AudioContextManager.getInstance();