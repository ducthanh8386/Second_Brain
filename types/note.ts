/**
 * Note type definition for the AI Second Brain app
 */

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteInput = Omit<Note, 'id'>;
