'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  RotateCcw,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Ghi chú',
    href: '/notes',
    icon: FileText,
  },
  {
    name: 'Ôn tập',
    href: '/review',
    icon: RotateCcw,
  },
  {
    name: 'Cài đặt',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

const isActive = (href: string) => {
  return pathname === href || pathname.startsWith(href + '/');
};

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 z-50 lg:z-auto transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:top-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo / Brand */}
        <div className="h-16 border-b border-gray-200 dark:border-zinc-800 flex items-center px-6 gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Σ</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Second Brain
          </h1>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  active
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
          <p className="text-xs text-gray-500 dark:text-gray-600">
            Second Brain v0.1.0
          </p>
        </div>
      </aside>
    </>
  );
};
