import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI Second Brain',
    template: '%s | AI Second Brain',
  },
  description: 'Intelligent note-taking with AI-powered summarization and spaced repetition learning.',
  keywords: [
    'notes',
    'AI',
    'learning',
    'spaced repetition',
    'productivity',
    'flashcards',
  ],
  authors: [
    {
      name: 'Second Brain Team',
    },
  ],
  openGraph: {
    title: 'AI Second Brain',
    description: 'Intelligent note-taking with AI assistance',
    url: 'https://secondbrain.example.com',
    siteName: 'AI Second Brain',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-black text-gray-900 dark:text-gray-50 font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
