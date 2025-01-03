export const AUDIO_CONFIG = {
  // Playback settings
  VOLUME: { 
    DEFAULT: 0.7, // Default volume level
    BACKGROUND_MUSIC: 0.3, // Background music volume
    SOUND_EFFECTS: 0.1, // Sound effects volume
    MIN: 0.0, // Minimum volume (must be 0.0 explicitly)
    MAX: 1.0  // Maximum volume (must be 1.0 explicitly)
  },
  
  // System settings
  FFT_SIZE: 256,
  
  // Retry configuration
  RETRY: {
    MAX_COUNT: 3,
    DELAY: 2000,
    BACKOFF_MULTIPLIER: 1.5
  },
  
  // Queue settings
  QUEUE: {
    DELAY: 500,
    MAX_SIZE: 100,
    PROCESS_TIMEOUT: 30000
  },
  
  // Timeouts
  TIMEOUT: {
    INIT: 10000,
    PLAY: 15000,
    READY_CHECK: {
      INTERVAL: 100,
      MAX: 5000
    }
  },
  
  // Audio files
  FILES: {
    BACKGROUND_MUSIC: '/audio/background-music.mp3',
    CLICK_SOUND: '/audio/click.mp3',
    BACKGROUND_MUSIC_URLS: ['/audio/background-music.mp3']
  }
} as const;