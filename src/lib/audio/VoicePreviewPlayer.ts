
// Map button names to audio file names

export class VoicePreviewPlayer {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private static audioCache: Map<string, AudioBuffer> = new Map();

  private async initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('🎵 Audio Context initialized');
      } catch (error) {
        console.error('❌ Failed to initialize AudioContext:', error);
        throw new Error('Could not initialize audio system');
      }
    }
    return this.audioContext;
  }

  async playPreview(voiceName: string, voiceId: string, role: 'character' | 'narrator' = 'character'): Promise<void> {
    try {
      if (!voiceId) {
        throw new Error('Voice ID is required');
      }

      console.log(`🎤 Previewing ${role} voice: ${voiceName} (ID: ${voiceId})`);
      const context = await this.initAudioContext();
      
      // Create a cache key based on voiceId
      const cacheKey = `${voiceId}`;

      // Try to get cached audio buffer
      let audioBuffer = VoicePreviewPlayer.audioCache.get(cacheKey);

      if (!audioBuffer) {
        console.log(`📥 Loading audio file for ${voiceName}...`);
        
        // Load the audio file from the public directory using the correct filename format
        const audioPath = `/audio/Voice_test_audio_files/${voiceName}_${voiceId}.mp3`;
        
        try {
          const response = await fetch(audioPath);
          
          if (!response.ok) {
            console.error(`❌ Failed to load audio file for ${voiceName}:`, { 
              status: response.status, 
              statusText: response.statusText,
              path: audioPath
            });
            throw new Error(`Failed to load audio file: ${response.status} ${response.statusText}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error('Received empty audio data');
          }

          audioBuffer = await context.decodeAudioData(arrayBuffer);
          // Cache the decoded audio buffer
          VoicePreviewPlayer.audioCache.set(cacheKey, audioBuffer);
          console.log(`✅ Successfully loaded and cached audio for ${voiceName}`);
        } catch (error) {
          console.error(`❌ Error loading audio for ${voiceName}:`, error);
          throw error;
        }
      } else {
        console.log(`📦 Using cached audio for ${voiceName}`);
      }

      this.stop();

      this.audioBuffer = audioBuffer;
      this.source = context.createBufferSource();
      this.source.buffer = this.audioBuffer;
      this.source.connect(context.destination);
      
      return new Promise((resolve, reject) => {
        if (!this.source) {
          reject(new Error('Audio source not initialized'));
          return;
        }

        this.source.onended = () => {
          this.source = null;
          console.log(`✨ Finished playing ${voiceName}`);
          resolve();
        };

        try {
          this.source.start(0);
          console.log(`▶️ Started playing ${voiceName}`);
        } catch (error) {
          console.error(`❌ Failed to start playback for ${voiceName}:`, error);
          reject(error);
        }
      });
    } catch (error) {
      console.error(`❌ Voice preview failed for ${voiceName}:`, error);
      throw error;
    }
  }

  stop() {
    try {
      if (this.source) {
        this.source.stop();
        this.source.disconnect();
        this.source = null;
        console.log('⏹️ Stopped current playback');
      }
    } catch (error) {
      console.error('❌ Error stopping voice preview:', error);
    }
  }

  cleanup() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioBuffer = null;
    console.log('🧹 Cleaned up audio resources');
  }

  // Method to clear the cache if needed
  static clearCache() {
    VoicePreviewPlayer.audioCache.clear();
    console.log('🗑️ Voice preview cache cleared');
  }
}