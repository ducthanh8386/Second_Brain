'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/AuthProvider';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setOpenSidebar] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setOpenSidebar(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setOpenSidebar(!sidebarOpen)}
          />

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
