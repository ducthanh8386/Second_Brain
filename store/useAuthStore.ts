import { create } from 'zustand';
import type { UserRole } from '@/types/user';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRole: (role: UserRole) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setRole: (role) =>
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    })),

  clearAuth: () =>
    set({
      user: null,
      isLoading: false,
      error: null,
    }),
}));
