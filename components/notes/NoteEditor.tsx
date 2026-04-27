'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { type Note } from '@/types/note';
import { addNote, updateNote } from '@/lib/firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { AIAssistantButton } from '@/components/notes/AIAssistantButton';

interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export function NoteEditor({ note, isOpen, onClose, onSave }: NoteEditorProps) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSummary(note.summary || '');
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setSummary('');
      setTags([]);
    }
    setTagInput('');
    setError(null);
  }, [note, isOpen]);

  const handleAddTag = () => {
    const normalizedTag = tagInput.trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags((current) => [...current, normalizedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleAIInsightsSuccess = (summaryFromAI: string, tagsFromAI: string[]) => {
    setSummary(summaryFromAI);
    setTags((current) => {
      const normalizedTags = tagsFromAI
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && !current.includes(tag));
      return [...current, ...normalizedTags].slice(0, 5);
    });
  };

  const handleSave = async () => {
    if (!user) {
      setError('Bạn cần đăng nhập để lưu ghi chú.');
      return;
    }

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (note) {
        const updatedNote: Partial<Note> = {
          title: title.trim(),
          content: content.trim(),
          tags,
          updatedAt: new Date(),
        };
        
        if (summary.trim()) updatedNote.summary = summary.trim();

        const savedNote = await updateNote(note.id, updatedNote);
        onSave(savedNote);
      } else {
        const newNote: Omit<Note, 'id'> = {
          userId: user.uid,
          title: title.trim(),
          content: content.trim(),
          tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        if (summary.trim()) newNote.summary = summary.trim();

        const savedNote = await addNote(newNote);
        onSave(savedNote);
      }

      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể lưu ghi chú.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-4 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[720px] lg:max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {note ? 'Chỉnh sửa ghi chú' : 'Ghi chú mới'}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Lưu lại nội dung học tập của bạn và xem lại khi cần.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4 text-sm text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề ghi chú"
              disabled={isSaving}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nội dung</label>
              <AIAssistantButton content={content} onSuccess={handleAIInsightsSuccess} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung ghi chú..."
              disabled={isSaving}
              rows={10}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tóm tắt</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn (tùy chọn)..."
              disabled={isSaving}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tags</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Thêm tag và nhấn Enter"
                disabled={isSaving}
                className="flex-1 min-w-[180px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={isSaving || !tagInput.trim()}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    disabled={isSaving}
                    className="rounded-full p-1 transition hover:bg-blue-200 dark:hover:bg-blue-900 disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </span>
            ) : (
              'Lưu ghi chú'
            )}
          </button>
        </div>
      </div>
    </>
  );
}