'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore, type AuthUser } from '@/store/useAuthStore';
import { fetchUserRole } from '@/lib/firebase/user';

/**
 * Custom hook that listens to Firebase auth state changes
 * and automatically updates the Zustand auth store.
 *
 * Should be called once in a top-level component (e.g., app layout)
 * to keep the auth state in sync across the app.
 */
export const useAuthListener = () => {
  const { setUser, setLoading, setError, setRole } = useAuthStore();

  useEffect(() => {
    // Set loading state while checking auth
    setLoading(true);

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        try {
          if (firebaseUser) {
            // Fetch user role from Firestore
            const role = await fetchUserRole(firebaseUser.uid);

            // User is logged in
            const authUser: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role,
            };
            setUser(authUser);
          } else {
            // User is logged out
            setUser(null);
          }
          setError(null);
        } catch (error) {
          console.error('Auth state change error:', error);
          setError('Failed to update authentication state');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth listener error:', error);
        setError('Authentication service error');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setLoading, setError, setRole]);
};
