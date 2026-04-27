export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Chào mừng bạn trở lại Second Brain. Hãy bắt đầu ghi chú ngay hôm nay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Tổng ghi chú
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Cần ôn tập
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Streaks
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
          Bắt đầu với Second Brain
        </h2>
        <p className="text-blue-800 dark:text-blue-200 mb-4">
          Tạo ghi chú đầu tiên của bạn hoặc tải lên một hình ảnh để AI xử lý.
        </p>
      </div>
    </div>
  );
}