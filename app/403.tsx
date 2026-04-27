import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

/**
 * 403 Forbidden page for unauthorized access
 */
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          403
        </h1>
        <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Access Forbidden
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          You don't have permission to access this page. Only administrators can
          access the admin panel.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}
