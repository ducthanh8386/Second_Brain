'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { updateNote } from '@/lib/firebase/firestore';
import { calculateNextReview } from '@/lib/algorithms/sm2';
import { type Note } from '@/types/note';

interface FlashcardReviewProps {
  card: Note;
  onAdvance: (cardId: string) => void;
  onError?: (message: string) => void;
}

/**
 * Beautiful flashcard component for spaced repetition review
 * Shows front of card, then flips to show back with grading options
 */
export function FlashcardReview({ card, onAdvance, onError }: FlashcardReviewProps) {
  const { user } = useAuthStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const frontText = card.summary?.trim() || card.title || card.content.slice(0, 140) || 'Nội dung bài học chưa có sẵn.';
  const backText = card.content || 'Nội dung đáp án chưa có sẵn.';

  const handleGrade = async (quality: number) => {
    if (!user) {
      onError?.('Bạn cần đăng nhập để ôn tập.');
      return;
    }

    setIsSaving(true);
    try {
      const nextReview = calculateNextReview(
        quality,
        card.repetitions ?? 0,
        card.easeFactor ?? 2.5,
        card.interval ?? 0
      );

      await updateNote(card.id, {
        ...nextReview,
      });

      onAdvance(card.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật thẻ ôn tập.';
      onError?.(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/20 dark:hover:shadow-slate-900/70">
        <div className="p-8 sm:p-10">
          {/* Header with title and progress info */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                ✨ Ôn tập thông minh
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {card.title}
              </h2>
            </div>
            <div className="text-right text-sm font-medium text-slate-600 dark:text-slate-400 space-y-1">
              <p className="flex items-center justify-end gap-2">
                <span className="text-slate-400">Lần ôn:</span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{card.repetitions ?? 0}</span>
              </p>
              <p className="flex items-center justify-end gap-2">
                <span className="text-slate-400">Khoảng cách:</span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{card.interval ?? 0}d</span>
              </p>
            </div>
          </div>

          {/* Flashcard display area */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800 p-10 min-h-72 flex flex-col justify-between transition-all duration-300">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
                {isFlipped ? '📝 Đáp án' : '❓ Câu hỏi'}
              </p>
              <p className="text-xl leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap font-medium">
                {isFlipped ? backText : frontText}
              </p>
            </div>

            {isFlipped && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
                    💡 Gợi ý
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    Đánh giá: Bạn nhớ được đáp án đến mức nào?
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsFlipped((v) => !v)}
              className="w-full rounded-full px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all duration-200 hover:scale-105"
            >
              {isFlipped ? '🔒 Ẩn đáp án' : '🔓 Hiển thị đáp án'}
            </button>

            {/* Grading buttons - only shown when flipped */}
            {isFlipped && (
              <div className="grid gap-3 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Hard button */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleGrade(2)}
                  className="group relative overflow-hidden rounded-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 px-4 py-4 text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>🔴</span>
                        <span>Khó</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Good button */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleGrade(4)}
                  className="group relative overflow-hidden rounded-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 px-4 py-4 text-sm font-bold text-slate-900 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>🟡</span>
                        <span>Tốt</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Easy button */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleGrade(5)}
                  className="group relative overflow-hidden rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 py-4 text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>🟢</span>
                        <span>Dễ</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
