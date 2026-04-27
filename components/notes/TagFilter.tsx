'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';

/**
 * Tag filter component
 * Displays all tags from notes and allows toggling filter selection
 * Selected tags are highlighted with blue background
 */
export function TagFilter() {
  const { notes, selectedTags, toggleTagFilter } = useNoteStore();

  // Extract unique tags from all notes
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach((note) => {
      note.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [notes]);

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Lọc theo tag:
      </span>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTagFilter(tag)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>#{tag}</span>
              {isSelected && (
                <X className="w-3.5 h-3.5" />
              )}
            </button>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <button
          onClick={() => selectedTags.forEach((tag) => toggleTagFilter(tag))}
          className="ml-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline"
        >
          Xóa tất cả
        </button>
      )}
    </div>
  );
}
