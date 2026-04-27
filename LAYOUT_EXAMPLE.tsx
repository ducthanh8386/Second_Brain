/**
 * Example showing how to integrate auth into your app/layout.tsx
 * 
 * This is NOT a real file - use it as a reference!
 * Add the AuthProvider to your actual layout.tsx
 */

import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Second Brain',
  description: 'Intelligent note-taking with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap your app with AuthProvider to enable auth functionality */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
