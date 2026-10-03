'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 font-sans selection:bg-orange-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-black to-black pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-[#111] rounded-2xl shadow-2xl border border-white/10 p-8 relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl mb-6 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform">
            <Flame size={24} className="text-black" fill="#000" />
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-400 mt-2">Join Ember and start writing today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white transition-all outline-none placeholder-gray-600 shadow-inner"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white transition-all outline-none placeholder-gray-600 shadow-inner"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white transition-all outline-none placeholder-gray-600 shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white transition-all outline-none placeholder-gray-600 shadow-inner"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Creating account...' : 'Create Ember account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
