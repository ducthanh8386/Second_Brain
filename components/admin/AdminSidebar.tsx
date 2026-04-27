'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * Admin sidebar navigation component
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Billing',
      href: '/admin/billing',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 flex flex-col pt-16">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 p-4 space-y-3">
        <div className="px-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Admin</p>
          <p className="text-sm font-medium text-white truncate mt-1">
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
