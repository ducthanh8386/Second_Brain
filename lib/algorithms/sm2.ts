export interface Sm2Result {
  nextReviewDate: Date;
  repetitions: number;
  easeFactor: number;
  interval: number;
}

/**
 * Calculate next review metadata using the SuperMemo-2 algorithm.
 * Quality values range from 0 (Blackout) to 5 (Perfect).
 */
export const calculateNextReview = (
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): Sm2Result => {
  const normalizedQuality = Math.min(Math.max(Math.round(quality), 0), 5);
  const safeRepetitions = Math.max(0, repetitions);
  const safeEaseFactor = Math.max(1.3, easeFactor);
  const safeInterval = Math.max(0, interval);

  let nextRepetitions = safeRepetitions;
  let nextInterval = safeInterval;
  let nextEaseFactor = safeEaseFactor;

  if (normalizedQuality < 3) {
    nextRepetitions = 0;
    nextInterval = 1;
  } else {
    nextRepetitions += 1;

    if (nextRepetitions === 1) {
      nextInterval = 1;
    } else if (nextRepetitions === 2) {
      nextInterval = 6;
    } else {
      nextInterval = Math.max(1, Math.round(safeInterval * safeEaseFactor));
    }
  }

  const qualityFactor = 5 - normalizedQuality;
  nextEaseFactor = nextEaseFactor + (0.1 - qualityFactor * (0.08 + qualityFactor * 0.02));
  nextEaseFactor = Math.max(1.3, Number(nextEaseFactor.toFixed(2)));

  const nextReviewDate = new Date();
  nextReviewDate.setHours(0, 0, 0, 0);
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    nextReviewDate,
    repetitions: nextRepetitions,
    easeFactor: nextEaseFactor,
    interval: nextInterval,
  };
};
