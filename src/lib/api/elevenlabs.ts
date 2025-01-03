import { apiLogger } from './logger';
import { API_CONFIG } from './config';

interface TextToSpeechRequest {
  text: string;
  voiceId: string;
  modelId?: string;
}

export class ElevenLabsAPI {
  private validateEnvironment() {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ElevenLabs API key');
    }
  }

  async textToSpeech({ text, voiceId, modelId }: TextToSpeechRequest): Promise<Response> {
    this.validateEnvironment();
    
    apiLogger.info('Converting text to speech', { 
      textLength: text.length,
      voiceId,
      modelId
    });
    
    try {
      const response = await fetch(
        `${API_CONFIG.ELEVENLABS_URL}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: modelId || 'eleven_flash_v2_5',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.25,
              use_speaker_boost: true
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        apiLogger.error('ElevenLabs API error response:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return response;
    } catch (error) {
      apiLogger.error('Failed to convert text to speech', error);
      throw error;
    }
  }
}

export const elevenlabs = new ElevenLabsAPI();