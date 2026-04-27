/**
 * Flashcard type definition for spaced repetition review system
 */

export interface Flashcard {
  id: string;
  noteId: string;
  userId: string;
  front: string; // Question/summary
  back: string; // Answer/content
  nextReviewDate: Date;
  interval: number; // Days until next review
  easeFactor: number; // SM-2 ease factor (1.3 - 2.5+)
  repetitions: number; // Number of successful reviews
}
