import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
 
export const metadata = {
  title: 'Đăng ký | Second Brain',
};
 
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4">
            <span className="text-white font-bold text-xl">Σ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Second Brain
          </h1>
        </div>
 
        {/* ✅ Bỏ onSuccess trống, thêm initialMode="signup" */}
        <AuthForm initialMode="signup" />
 
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </Link>
          {' '}và{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </Link>
        </p>
      </div>
    </div>
  );
}
 