/**
 * User and role type definitions for RBAC system
 */

export type UserRole = 'admin' | 'user' | 'pro';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Firestore user document schema
 */
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
