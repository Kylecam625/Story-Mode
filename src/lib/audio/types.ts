// Core audio interfaces
export interface AudioConfig {
  volume?: number;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface AudioState {
  isPlaying: boolean;
  isDestroyed: boolean;
  isInitialized: boolean;
  lastError: Error | null;
}

// Queue-specific types
export interface QueueItem {
  character: string;
  text: string;
  resolve: () => void;
  reject: (error: Error) => void;
}

export interface QueueProcessor {
  (item: QueueItem): Promise<void>;
}

// Audio analysis types
export interface AudioAnalyzer {
  getByteFrequencyData(array: Uint8Array): void;
  frequencyBinCount: number;
}

// Voice types
export interface VoiceConfig {
  voiceId: string;
  character: string;
  text: string;
}

export type VoiceMap = Record<string, string>;

export interface VoiceAssignment {
  characterId: string;
  voiceId: string;
  variations?: string[];
}