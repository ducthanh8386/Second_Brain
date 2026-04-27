'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { updateNote } from '@/lib/firebase/firestore';
import { calculateNextReview } from '@/lib/algorithms/sm2';
import { type Note } from '@/types/note';

interface ReviewCardProps {
  card: Note;
  onAdvance: (cardId: string) => void;
  onError?: (message: string) => void;
}

export function ReviewCard({ card, onAdvance, onError }: ReviewCardProps) {
  const { user } = useAuthStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const frontText = card.summary?.trim() || card.title || card.content.slice(0, 140) || 'Nội dung bài học chưa có sẵn.';
  const answerText = card.content || 'Nội dung đáp án chưa có sẵn.';

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
      <div className="rounded-[2rem] border border-gray-200 dark:border-zinc-800 shadow-2xl shadow-slate-900/5 overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-300">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                Ôn tập thông minh
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {card.title}
              </h2>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p>Lần ôn: {card.repetitions ?? 0}</p>
              <p>Khoảng cách: {card.interval ?? 0} ngày</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-8 min-h-[230px] flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Mặt trước</p>
              <p className="text-lg leading-8 text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                {frontText}
              </p>
            </div>

            {isFlipped && (
              <div className="mt-8 rounded-3xl border border-blue-100 dark:border-blue-950 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Đáp án</p>
                <p className="text-base leading-7 text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                  {answerText}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setIsFlipped((value) => !value)}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {isFlipped ? 'Ẩn đáp án' : 'Hiển thị đáp án'}
            </button>

            {isFlipped && (
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleGrade(2)}
                  className="inline-flex items-center justify-center rounded-2xl bg-red-600 text-white px-4 py-3 text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Khó'}
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleGrade(4)}
                  className="inline-flex items-center justify-center rounded-2xl bg-yellow-500 text-slate-900 px-4 py-3 text-sm font-semibold hover:bg-yellow-400 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tốt'}
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleGrade(5)}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white px-4 py-3 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Dễ'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
