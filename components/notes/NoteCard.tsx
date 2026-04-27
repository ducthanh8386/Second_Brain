'use client';

import { Trash2, Edit2, Archive } from 'lucide-react';
import { type Note } from '@/types/note';
import { formatDate } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onArchive: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onArchive,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
          {note.title || 'Untitled Note'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(note.updatedAt)}
        </p>
      </div>

      {/* Summary or preview */}
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
        {note.summary || note.content || 'No content'}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(note)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
          title="Edit note"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onArchive(note.id)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors"
          title="Archive note"
        >
          <Archive className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this note?')) {
              onDelete(note.id);
            }
          }}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 rounded transition-colors"
          title="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
