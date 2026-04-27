'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useAuthStore } from '@/store/useAuthStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAuthListener();
  return <>{children}</>;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/sign-in');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    // Đang redirect, hiện spinner
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};