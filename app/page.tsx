import Link from 'next/link';
import { ArrowRight, Brain, Zap, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Σ</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Second Brain
            </h1>
          </div>
          <Link
            href="/auth/sign-in"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <section className="pt-32 pb-16 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Ghi chú thông minh <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              được tăng cường bởi AI
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Tự động tóm tắt ghi chú, trích xuất thẻ thông minh, và ôn tập bằng
            lặp lại giãn cách. Học nhanh hơn, nhớ lâu hơn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Bắt đầu miễn phí
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/sign-in"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4 lg:px-6 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Tính năng chính
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Tóm tắt AI
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Để AI tóm tắt ghi chú của bạn, điểm chính giúp bạn nắm bắt
                những gì quan trọng.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Gắn thẻ tự động
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Để AI tự động trích xuất thẻ và chủ đề từ ghi chú của bạn để
                tìm kiếm tốt hơn.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Lặp lại giãn cách
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Thuật toán SM-2 tối ưu hóa thời gian ôn tập của bạn để tiếp
                thu tối đa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4 lg:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sẵn sàng học thông minh hơn?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Tham gia hàng ngàn học sinh sử dụng Second Brain để học hiệu quả hơn.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors gap-2"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 py-8 px-4 lg:px-6 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Second Brain. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}
