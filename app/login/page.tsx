'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { validateCredentials } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate credentials
    setTimeout(() => {
      const result = validateCredentials(email, password);
      
      if (result.success && result.user) {
        // Store auth info
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userRole', result.user.role);
        // Store complete user object for role-based features
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect based on role
        if (result.user.role === 'Teacher') {
          router.push('/teacher/lectures');
        } else if (result.user.role === 'Student') {
          router.push('/student/lectures');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Invalid email or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-rose-50">
      <div className="w-full max-w-md px-6 py-8">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-block w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg">
            <img
              src="/logo.jpg"
              alt="Korean With Us Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Korean With Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 dark:bg-gray-700 dark:text-white transition-colors outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 dark:bg-gray-700 dark:text-white transition-colors outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Log in</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          © 2024 Korean With Us. All rights reserved.
        </p>
      </div>
    </div>
  );
}
