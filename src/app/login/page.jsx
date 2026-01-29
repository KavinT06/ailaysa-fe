'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isInitialized, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/products');
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      login(email, password);
      router.push('/products');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isInitialized && isAuthenticated) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Image */}
          <div className="lg:hidden relative h-40 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src="/flowers.jpg"
              alt="Floral artwork"
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome Back 👋</h1>
          <p className="text-gray-600 mb-6">
            Today is a new day. It&apos;s your day. You shape it.
          </p>
          <p className="text-gray-600 mb-8">Sign in to start managing your projects.</p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="text-right mb-6">
              <a href="#" className="text-blue-600 text-sm">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t you have an account?{' '}
            <a href="#" className="text-blue-600">Sign up</a>
          </p>

          <p className="text-center mt-8 text-xs text-gray-500">
            © 2026 ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      {/* Right Side - Image (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black">
          <Image
            src="/flowers.jpg"
            alt="Floral artwork"
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>
      </div>
    </div>
  );
}
