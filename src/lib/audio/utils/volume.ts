import { logger } from '../../logger';
import { AUDIO_CONFIG } from '../constants';

export function validateVolume(value: unknown): number {
  logger.debug('Validating volume:', { 
    value,
    valueType: typeof value,
    isNull: value === null,
    isUndefined: value === undefined,
    type: typeof value,
    isNumber: typeof value === 'number',
    isNaN: typeof value === 'number' && isNaN(value),
    isFinite: typeof value === 'number' && Number.isFinite(value)
  });

  // Default if invalid
  if (typeof value !== 'number' || isNaN(value)) {
    logger.debug('Invalid volume, using default:', {
      invalidValue: value,
      defaultValue: AUDIO_CONFIG.VOLUME.DEFAULT,
      reason: typeof value !== 'number' ? 'not a number' : 'NaN'
    });
    return AUDIO_CONFIG.VOLUME.DEFAULT;
  }

  if (!Number.isFinite(value)) {
    logger.debug('Non-finite volume, using default:', {
      invalidValue: value,
      defaultValue: AUDIO_CONFIG.VOLUME.DEFAULT
    });
    return AUDIO_CONFIG.VOLUME.DEFAULT;
  }
  // Clamp between min and max
  const clamped = Math.max(
    AUDIO_CONFIG.VOLUME.MIN,
    Math.min(AUDIO_CONFIG.VOLUME.MAX, value)
  );

  logger.debug('Volume validated:', {
    original: value,
    clamped,
    wasAdjusted: clamped !== value,
    min: AUDIO_CONFIG.VOLUME.MIN,
    max: AUDIO_CONFIG.VOLUME.MAX,
    isFinite: Number.isFinite(clamped)
  });

  return clamped;
}