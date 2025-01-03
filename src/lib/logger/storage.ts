import { LOG_CONFIG } from './config';

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}

class LogStorage {
  private logs: LogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    if (!LOG_CONFIG.PERSIST_TO_STORAGE) return;
    
    try {
      const stored = localStorage.getItem(LOG_CONFIG.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
    }
  }

  add(entry: LogEntry) {
    this.logs.push(entry);
    
    // Trim old logs
    if (this.logs.length > LOG_CONFIG.MAX_LOGS) {
      this.logs = this.logs.slice(-LOG_CONFIG.MAX_LOGS);
    }

    if (LOG_CONFIG.PERSIST_TO_STORAGE) {
      try {
        localStorage.setItem(LOG_CONFIG.STORAGE_KEY, JSON.stringify(this.logs));
      } catch (error) {
        console.error('Failed to save logs to storage:', error);
      }
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    if (LOG_CONFIG.PERSIST_TO_STORAGE) {
      localStorage.removeItem(LOG_CONFIG.STORAGE_KEY);
    }
  }
}

export const logStorage = new LogStorage();