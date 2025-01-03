import { logger } from '../logger';
import { useSettingsStore } from '../../store/settingsStore';

class SoundEffects {
  private clickSound: HTMLAudioElement;
  private initialized = false;

  constructor() {
    this.clickSound = new Audio('/audio/click.mp3');
    this.clickSound.volume = 0.1; // Reduced volume to 10%
    this.init();
  }

  private init() {
    if (this.initialized) return;

    try {
      // Add click sound to all interactive elements
      document.addEventListener('mousedown', (e) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.tagName === 'A' ||
          target.closest('a') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'button'
        ) {
          // Only play click if element is not disabled
          if (!target.hasAttribute('disabled') && !target.closest('[disabled]')) {
            this.playClick();
          }
        }
      });

      // Preload sound
      this.clickSound.load();
      
      this.initialized = true;
      logger.debug('Sound effects initialized');
    } catch (error) {
      logger.error('Failed to initialize sound effects:', error);
    }
  }

  playClick() {
    try {
      if (!useSettingsStore.getState().clickSound) return;
      
      // Clone and play to allow overlapping sounds
      const sound = this.clickSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.1; // Ensure cloned sound also has low volume
      sound.play().catch(error => {
        // Silently fail if autoplay is blocked
        if (error.name !== 'NotAllowedError') {
          logger.error('Failed to play click sound:', error);
        }
      });
    } catch (error) {
      logger.error('Failed to play click sound:', error);
    }
  }
}

export const soundEffects = new SoundEffects();