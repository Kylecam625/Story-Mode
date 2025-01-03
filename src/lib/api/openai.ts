import { API_CONFIG } from './config';
import { logger } from '../logger';

interface CompletionRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  response_format?: { type: "json_object" };
  temperature?: number;
  max_tokens?: number;
}

class OpenAIAPI {
  private validateEnvironment() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenAI API configuration');
    }
  }

  async createChatCompletion(request: CompletionRequest) {
    this.validateEnvironment();
    
    // Use model from config
    const finalRequest = { 
      model: API_CONFIG.AI_MODEL,
      messages: request.messages,
      temperature: request.temperature ?? API_CONFIG.DEFAULT_TEMPERATURE,
      max_tokens: request.max_tokens ?? API_CONFIG.DEFAULT_MAX_TOKENS,
      response_format: request.response_format
    };

    logger.debug('Starting OpenAI request:', {
      model: finalRequest.model,
      messageCount: request.messages.length,
      temperature: finalRequest.temperature,
      maxTokens: finalRequest.max_tokens
    });

    try {
      const response = await fetch(`${API_CONFIG.OPENAI_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify(finalRequest)
      });

      // Handle rate limiting
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      }

      let responseData;
      try {
        const text = await response.text();
        responseData = JSON.parse(text);
      } catch (error) {
        logger.error('Failed to parse OpenAI response:', error);
        throw new Error('Invalid response from OpenAI API');
      }

      if (!response.ok) {
        logger.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          error: responseData
        });
        
        if (responseData?.error?.type === 'insufficient_quota') {
          throw new Error('Story generation is temporarily unavailable. Please try again later.');
        }
        
        throw new Error(responseData?.error?.message || `HTTP ${response.status}`);
      }

      return responseData;
    } catch (error) {
      logger.error('OpenAI API call failed:', error);
      throw error;
    }
  }
}

export const openai = new OpenAIAPI();