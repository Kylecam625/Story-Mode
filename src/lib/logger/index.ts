import { LOG_CONFIG } from './config';
import { logStorage, type LogEntry } from './storage';
export { apiLogger } from './api';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[LOG_CONFIG.LOG_LEVEL];
  }

  private createEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, data);
    logStorage.add(entry);

    const logFn = console[level];
    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}:`;
    
    if (data) {
      logFn(prefix, message, data);
    } else {
      logFn(prefix, message);
    }
  }

  debug(message: string, data?: any) { this.log('debug', message, data); }
  info(message: string, data?: any) { this.log('info', message, data); }
  warn(message: string, data?: any) { this.log('warn', message, data); }
  error(message: string, data?: any) { this.log('error', message, data); }

  getLogs() {
    return logStorage.getLogs();
  }

  clearLogs() {
    logStorage.clear();
  }
}

export const logger = new Logger();