'use server';

import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from './config';
import type { UserRole } from '@/types/user';

/**
 * Fetch user role from Firestore
 * Returns 'user' as default if role not set
 */
export async function fetchUserRole(userId: string): Promise<UserRole> {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return 'user'; // Default role
    }

    const userData = userSnap.data();
    return (userData.role as UserRole) || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user'; // Fail gracefully with default role
  }
}

/**
 * Create or update user document in Firestore
 */
export async function createOrUpdateUser(
  userId: string,
  email: string,
  displayName?: string,
  photoURL?: string
) {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user with 'user' role
      await setDoc(userRef, {
        uid: userId,
        email,
        displayName: displayName || null,
        photoURL: photoURL || null,
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      // Update existing user
      await updateDoc(userRef, {
        displayName: displayName || null,
        photoURL: photoURL || null,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw new Error('Failed to initialize user profile');
  }
}
