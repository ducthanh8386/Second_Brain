import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';

/**
 * Sign out the current user from Firebase
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Failed to logout. Please try again.');
  }
};

/**
 * Get the current user's ID token (for API calls if needed)
 */
export const getCurrentIdToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  } catch (error) {
    console.error('Failed to get ID token:', error);
    return null;
  }
};
