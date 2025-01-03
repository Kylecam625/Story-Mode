import { logger } from '../logger';

export class VoiceManager {
  private static instance: VoiceManager;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private voiceMap: Record<string, string> = {};
  private defaultVoices: Record<string, string> = {};

  private constructor() {}

  static getInstance(): VoiceManager {
    if (!VoiceManager.instance) {
      VoiceManager.instance = new VoiceManager();
    }
    return VoiceManager.instance;
  }

  async init() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve, reject) => {
      const narratorVoiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID_NARRATOR;
      if (!narratorVoiceId) {
        reject(new Error('Missing narrator voice ID'));
        return;
      }

      // Set default voices with a single narrator entry
      this.voiceMap = {
        narrator: narratorVoiceId,
        ...this.defaultVoices
      };

      this.initialized = true;
      logger.debug('VoiceManager initialized');
      resolve();
    });

    return this.initPromise;
  }

  private normalizeCharacterName(name: string): string {
    return name.toLowerCase().trim();
  }

  async setVoices(voices: Record<string, string>) {
    logger.debug('Setting voice map:', voices);
    if (!this.initialized) {
      await this.init();
    }
    
    // Create voice map with normalized names
    this.voiceMap = Object.entries(voices).reduce((acc, [char, voiceId]) => {
      const normalizedName = this.normalizeCharacterName(char);
      acc[normalizedName] = voiceId;
      return acc;
    }, {} as Record<string, string>);
    
    // Ensure narrator voice is always set
    this.voiceMap.narrator = import.meta.env.VITE_ELEVENLABS_VOICE_ID_NARRATOR;
    
    logger.debug('Voice map configured:', this.voiceMap);
  }

  getVoiceId(character: string): string | undefined {
    const normalizedName = this.normalizeCharacterName(character);
    return this.voiceMap[normalizedName];
  }

  getVoices(): Record<string, string> {
    return { ...this.voiceMap };
  }
}

export const voiceManager = VoiceManager.getInstance();