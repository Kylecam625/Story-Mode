export const API_CONFIG = {
  OPENAI_URL: 'https://api.openai.com/v1',
  ELEVENLABS_URL: import.meta.env.VITE_ELEVENLABS_API_URL,
  //always use gpt-4o-mini or gpt-4o for structured outputs
  AI_MODEL: 'gpt-4o-mini' as const,
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 1000,
  DEBUG: import.meta.env.DEV || false,
} as const;

// Validate environment variables at startup
(() => {
  const required = [
    'VITE_ELEVENLABS_API_KEY',
    'VITE_ELEVENLABS_API_URL',
    'VITE_OPENAI_API_KEY',
    'VITE_OPENAI_API_URL'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
  }
})();