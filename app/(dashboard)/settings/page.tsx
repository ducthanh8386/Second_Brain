'use client';

import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý tài khoản và tùy chọn của bạn.
        </p>
      </div>

      {/* Profile section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Hồ sơ
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.email || 'Không được xác định'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên
            </label>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.displayName || 'Không được đặt'}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Tùy chọn
        </h2>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Nhận thông báo email hàng ngày
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Tự động tóm tắt ghi chú mới
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
