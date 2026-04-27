import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { Note } from '@/types/note';

// Hàm phụ trợ chuyển đổi dữ liệu từ Firebase sang định dạng Note
const convertDocToNote = (docSnapshot: any): Note => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    userId: data.userId,
    title: data.title,
    content: data.content,
    summary: data.summary || '',
    tags: data.tags || [],
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const addNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  // Loại bỏ giá trị undefined trước khi đẩy lên Firebase
  const noteData = { ...note };
  if (noteData.summary === undefined) delete noteData.summary;

  const docRef = await addDoc(collection(db, 'notes'), {
    ...noteData,
    createdAt: Timestamp.fromDate(note.createdAt),
    updatedAt: Timestamp.fromDate(note.updatedAt),
  });
  
  return { ...note, id: docRef.id };
};

export const updateNote = async (id: string, data: Partial<Note>): Promise<Note> => {
  const noteRef = doc(db, 'notes', id);
  
  // Loại bỏ giá trị undefined
  const updateData: any = { ...data };
  if (updateData.summary === undefined) delete updateData.summary;
  
  if (updateData.updatedAt) {
    updateData.updatedAt = Timestamp.fromDate(updateData.updatedAt as Date);
  }
  
  await updateDoc(noteRef, updateData);
  return { id, ...data } as Note; 
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  const q = query(collection(db, 'notes'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(convertDocToNote);
};

export const deleteNote = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'notes', id));
};
export const getDueFlashcards = async (userId: string) => {
  const q = query(
    collection(db, 'flashcards'),
    where('userId', '==', userId),
    where('nextReviewDate', '<=', new Date())
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Đảm bảo convert Timestamp của Firebase về Date của Javascript
      nextReviewDate: data.nextReviewDate?.toDate() || new Date() 
    };
  });
};

export const updateFlashcard = async (id: string, data: any) => {
  const docRef = doc(db, 'flashcards', id);
  // Nếu có cập nhật ngày tháng, chuyển về Timestamp cho Firebase
  const updateData = { ...data };
  if (updateData.nextReviewDate instanceof Date) {
    updateData.nextReviewDate = Timestamp.fromDate(updateData.nextReviewDate);
  }
  await updateDoc(docRef, updateData);
};