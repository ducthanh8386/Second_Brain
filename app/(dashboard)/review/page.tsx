'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { getDueFlashcards } from '@/lib/firebase/firestore';
import { type Note } from '@/types/note';
import { FlashcardReview } from '@/components/review/FlashcardReview';

export default function ReviewPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [dueCards, setDueCards] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setError(null);
    setDueCards([]);
    loadDueCards();
  }, [user]);

  const loadDueCards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) return;
      const cards = await getDueFlashcards(user.uid);
      setDueCards(cards);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải thẻ ôn tập.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvance = (cardId: string) => {
    setDueCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const activeCard = dueCards[0];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Ôn tập
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ôn tập các thẻ của bạn bằng lặp lại giãn cách thông minh.
        </p>
      </div>

      {authLoading || !user ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Đang tìm thẻ ôn tập...</p>
          </div>
        </div>
      ) : error ? (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : dueCards.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800 rounded-[2rem] shadow-lg shadow-emerald-100 dark:shadow-emerald-950/50 p-12 text-center">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
              Tuyệt vời! Bạn đã hoàn thành bài ôn tập hôm nay!
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300 mb-8">
              Không có thẻ nào cần ôn tập ngay bây giờ. Hãy tạo thêm ghi chú hoặc kiểm tra lại vào ngày mai!
            </p>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                Thẻ ôn tập sắp tới
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {dueCards.length} thẻ cần ôn tập ngay.
              </p>
            </div>
            <button
              type="button"
              onClick={loadDueCards}
              className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Làm mới danh sách
            </button>
          </div>

          <FlashcardReview
            card={activeCard}
            onAdvance={handleAdvance}
            onError={(message) => setError(message)}
          />
        </div>
      )}
    </div>
  );
}
