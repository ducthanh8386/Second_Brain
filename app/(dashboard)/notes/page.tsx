'use client';

import { useEffect, useState } from 'react';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNoteStore } from '@/store/useNoteStore';
import { getNotes, deleteNote } from '@/lib/firebase/firestore';
import { type Note } from '@/types/note';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { SearchBar } from '@/components/notes/SearchBar';
import { TagFilter } from '@/components/notes/TagFilter';

export default function NotesPage() {
  const { user } = useAuthStore();
  const { notes, setNotes, addNoteToStore, updateNoteInStore, removeNoteFromStore, filteredNotes } = useNoteStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedNotes = await getNotes(user.uid);
      setNotes(fetchedNotes);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notes.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedNote(undefined);
    setEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = (savedNote: Note) => {
    if (selectedNote) {
      updateNoteInStore(savedNote);
    } else {
      addNoteToStore(savedNote);
    }

    setSelectedNote(undefined);
    setEditorOpen(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      await deleteNote(noteId);
      removeNoteFromStore(noteId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note.';
      setError(message);
    }
  };

  // Lấy danh sách ghi chú đã được lọc để hiển thị
  const displayNotes = filteredNotes();

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Ghi chú</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý tất cả ghi chú của bạn. Thêm mới, chỉnh sửa hoặc xóa ghi chú.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Tạo ghi chú mới
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl flex gap-3 items-center">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Logic hiển thị nội dung chính */}
      {isLoading ? (
        // Trạng thái 1: Đang tải dữ liệu
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Đang tải dữ liệu bộ não...</p>
          </div>
        </div>
      ) : notes.length === 0 ? (
        // Trạng thái 2: Người dùng chưa có bất kỳ ghi chú nào trong Database
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-16 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full mb-6">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Chưa có ghi chú nào</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Bắt đầu xây dựng "Bộ não thứ hai" của bạn bằng cách tạo ghi chú đầu tiên. AI sẽ giúp bạn tóm tắt và gắn thẻ tự động.
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Tạo ghi chú ngay
          </button>
        </div>
      ) : (
        // Trạng thái 3: Đã có ghi chú, hiển thị hệ thống Search & List
        <div className="space-y-6">
          {/* Thanh Tìm kiếm và Bộ lọc */}
          <div className="space-y-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <SearchBar />
            <TagFilter />
          </div>

          {/* Thông tin số lượng kết quả */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Hiển thị <span className="font-bold text-gray-900 dark:text-white">{displayNotes.length}</span> ghi chú
            </p>
          </div>

          {/* Hiển thị Grid hoặc Trạng thái trống khi tìm kiếm */}
          {displayNotes.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-16 text-center shadow-sm mt-6">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Không có ghi chú nào khớp với từ khóa hoặc thẻ bạn đang chọn. Hãy thử xóa bớt bộ lọc nhé.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onArchive={(noteId: string) => undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Trình soạn thảo */}
      <NoteEditor
        note={selectedNote}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedNote(undefined);
        }}
        onSave={handleSaveNote}
      />
    </div>
  );
}