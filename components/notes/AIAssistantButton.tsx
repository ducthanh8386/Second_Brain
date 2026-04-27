'use client';

import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { generateInsights } from '@/app/actions/ai.actions';

interface AIAssistantButtonProps {
  content: string;
  onSuccess: (summary: string, tags: string[]) => void;
}

export function AIAssistantButton({ content, onSuccess }: AIAssistantButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung để AI phân tích.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const insights = await generateInsights(content);
      onSuccess(insights.summary, insights.tags);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể phân tích nội dung bằng AI.';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isAnalyzing || !content.trim()}
        className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Phân tích AI...
          </>
        ) : (
          '✨ Phân tích bằng AI'
        )}
      </button>
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
