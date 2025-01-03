import { logger } from '../logger';
import type { QueueItem } from './types';
import { AUDIO_CONFIG } from './constants';

export class NarrationQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private currentItem: QueueItem | null = null;
  private retryCount = 0;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private processor: ((item: QueueItem) => Promise<void>) | null = null;

  constructor(maxRetries = AUDIO_CONFIG.RETRY.MAX_COUNT, retryDelay = AUDIO_CONFIG.RETRY.DELAY) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  setProcessor(processor: (item: QueueItem) => Promise<void>) {
    this.processor = processor;
  }

  async add(character: string, text: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!character?.trim() || !text?.trim()) {
        reject(new Error('Invalid narration parameters'));
        return;
      }

      this.queue.push({ character, text, resolve, reject });
      
      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    logger.debug('Starting queue processing', {
      queueLength: this.queue.length,
      retryCount: this.retryCount
    });

    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue[0];
      this.currentItem = item;

      logger.debug('Processing queue item', {
        character: item.character,
        textLength: item.text.length
      });

      try {
        await this.processItem(item);
        this.queue.shift();
        await new Promise(resolve => setTimeout(resolve, AUDIO_CONFIG.QUEUE.DELAY));
        item.resolve();
        this.retryCount = 0;
        
        logger.debug('Queue item processed successfully');
      } catch (error) {
        logger.error('Error processing queue item:', error);

        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          logger.debug('Retrying queue item', {
            attempt: this.retryCount,
            maxRetries: this.maxRetries
          });
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          continue;
        }
        
        this.queue.shift();
        item.reject(error instanceof Error ? error : new Error('Queue processing failed'));
        this.retryCount = 0;
      }
    }

    this.isProcessing = false;
    this.currentItem = null;
    logger.debug('Queue processing complete');
  }

  private async processItem(item: QueueItem): Promise<void> {
    if (!this.processor) {
      throw new Error('No processor set for queue');
    }
    await this.processor(item);
  }

  clear() {
    logger.debug('Clearing narration queue', {
      queueLength: this.queue.length,
      hasCurrentItem: !!this.currentItem
    });

    this.queue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.isProcessing = false;
    this.currentItem = null;
    this.retryCount = 0;
  }

  getCurrentItem(): QueueItem | null {
    return this.currentItem;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  isProcessingQueue(): boolean {
    return this.isProcessing;
  }
}