'use client';
 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
 
type AuthMode = 'login' | 'signup';
 
interface AuthFormProps {
  onSuccess?: () => void;
  initialMode?: AuthMode; // ← thêm prop này
}
 
export const AuthForm: React.FC<AuthFormProps> = ({
  onSuccess,
  initialMode = 'login', // ← default là login
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode); // ← dùng initialMode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const { setUser, setError: setStoreError } = useAuthStore();
  const router = useRouter(); // ← thêm router
 
  // Get error message from Firebase error code
  const getErrorMessage = (firebaseError: AuthError): string => {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Email không hợp lệ.',
      'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hóa.',
      'auth/user-not-found': 'Email hoặc mật khẩu không đúng.',
      'auth/wrong-password': 'Email hoặc mật khẩu không đúng.',
      'auth/email-already-in-use': 'Email này đã được sử dụng.',
      'auth/weak-password': 'Mật khẩu phải có ít nhất 6 ký tự.',
      'auth/operation-not-allowed': 'Phương pháp đăng nhập này không được hỗ trợ.',
      'auth/too-many-requests':
        'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.',
      'auth/popup-blocked': 'Cửa sổ đăng nhập bị chặn. Vui lòng cho phép popup.',
    };
 
    return (
      errorMessages[firebaseError.code] ||
      'Có lỗi xảy ra. Vui lòng thử lại.'
    );
  };
 
  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
 
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
 
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      });
 
      setEmail('');
      setPassword('');
      onSuccess?.();
      router.replace('/dashboard'); // ← redirect sau khi login
    } catch (err) {
      const firebaseError = err as AuthError;
      const message = getErrorMessage(firebaseError);
      setError(message);
      setStoreError(message);
    } finally {
      setIsLoading(false);
    }
  };
 
  // Handle email/password signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
 
    // Basic validation
    if (email.trim() === '') {
      setError('Vui lòng nhập email.');
      return;
    }
 
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
 
    setIsLoading(true);
 
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
 
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      });
 
      setEmail('');
      setPassword('');
      onSuccess?.();
      router.replace('/dashboard'); // ← redirect sau khi signup
    } catch (err) {
      const firebaseError = err as AuthError;
      const message = getErrorMessage(firebaseError);
      setError(message);
      setStoreError(message);
    } finally {
      setIsLoading(false);
    }
  };
 
  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
 
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
 
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      });
 
      onSuccess?.();
      router.replace('/dashboard'); // ← redirect sau khi Google login
    } catch (err) {
      const firebaseError = err as AuthError;
      const message = getErrorMessage(firebaseError);
      setError(message);
      setStoreError(message);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login'
              ? 'Quay lại với Second Brain của bạn'
              : 'Bắt đầu hành trình ghi chú thông minh'}
          </p>
        </div>
 
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
 
        {/* Form */}
        <form
          onSubmit={mode === 'login' ? handleEmailLogin : handleEmailSignup}
          className="space-y-4 mb-6"
        >
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 disabled:opacity-50"
              />
            </div>
          </div>
 
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
 
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
 
        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          <span className="text-xs text-gray-500 dark:text-gray-400">hoặc</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        </div>
 
        {/* Google Sign-in */}
        {/* <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Chrome className="w-5 h-5" />
          Đăng nhập với Google
        </button> */}
 
        {/* Mode Toggle */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};
 