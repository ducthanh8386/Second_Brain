'use client';

import { useAuthStore } from '@/store/useAuthStore';

/**
 * Admin dashboard page
 */
export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, Admin
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage your application and users from here.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: '1,234', change: '+12%' },
          { label: 'Active Sessions', value: '456', change: '+8%' },
          { label: 'Pro Subscribers', value: '89', change: '+4%' },
          { label: 'Revenue', value: '$12,345', change: '+23%' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {stat.value}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Your Profile
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
            <p className="text-slate-900 dark:text-white font-medium">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Role</p>
            <p className="text-slate-900 dark:text-white font-medium capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
