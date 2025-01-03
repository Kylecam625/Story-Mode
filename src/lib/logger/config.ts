export const LOG_CONFIG = {
  MAX_LOGS: 1000,
  PERSIST_TO_STORAGE: true,
  LOG_LEVEL: 'debug' as const,
  STORAGE_KEY: 'app_logs',
  DEBUG: import.meta.env.DEV || false
} as const;