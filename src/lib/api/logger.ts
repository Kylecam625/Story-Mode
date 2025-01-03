import { API_CONFIG } from './config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class APILogger {
  private log(level: LogLevel, ...args: any[]) {
    if (!API_CONFIG.DEBUG) return;

    const timestamp = new Date().toISOString();
    const prefix = `[API ${level.toUpperCase()}] ${timestamp}:`;
    
    console[level](prefix, ...args);
  }

  info(...args: any[]) { this.log('info', ...args); }
  warn(...args: any[]) { this.log('warn', ...args); }
  error(...args: any[]) { this.log('error', ...args); }
  debug(...args: any[]) { this.log('debug', ...args); }
}

export const apiLogger = new APILogger();