import { create } from 'zustand';
import { type Note } from '@/types/note';

interface NoteState {
  notes: Note[];
  searchQuery: string;
  selectedTags: string[];
  setNotes: (notes: Note[]) => void;
  addNoteToStore: (note: Note) => void;
  updateNoteInStore: (note: Note) => void;
  removeNoteFromStore: (noteId: string) => void;
  setSearchQuery: (query: string) => void;
  toggleTagFilter: (tag: string) => void;
  filteredNotes: () => Note[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  searchQuery: '',
  selectedTags: [],
  setNotes: (notes) => set({ notes }),
  addNoteToStore: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNoteInStore: (note) =>
    set((state) => ({
      notes: state.notes.map((existingNote) =>
        existingNote.id === note.id ? note : existingNote
      ),
    })),
  removeNoteFromStore: (noteId) =>
    set((state) => ({ notes: state.notes.filter((note) => note.id !== noteId) })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTagFilter: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),
  filteredNotes: () => {
    const { notes, searchQuery, selectedTags } = get();

    return notes.filter((note) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by selected tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => note.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  },
}));

