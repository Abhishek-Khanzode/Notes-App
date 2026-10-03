'use client';

import Link from 'next/link';
import { ArrowRight, Edit3, Shield, Zap, CheckCircle2, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCTA = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 flex items-center justify-center rounded-lg font-bold text-black text-xl">
              <Flame size={20} className="text-black" fill="#000" />
            </div>
            <span className="text-xl font-bold tracking-wider">Ember</span>
          </div>
          
          <div className="flex items-center gap-6">
            {user ? (
              <Link href="/dashboard" className="text-sm font-medium hover:text-orange-500 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <button 
                  onClick={handleCTA}
                  className="bg-orange-500 hover:bg-orange-600 text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                >
                  Start Writing
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            v2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Think clearly. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Write beautifully.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            A lightning-fast, distraction-free workspace designed to help you capture your best ideas before they slip away. Completely secure and instantly synced.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleCTA}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">No credit card required. Free forever tier available.</p>
        </div>

        {/* DASHBOARD PREVIEW / MOCKUP */}
        <div className="max-w-6xl mx-auto mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 bottom-0 h-full rounded-2xl pointer-events-none"></div>
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl relative">
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-[#111]">
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
            </div>
            <div className="p-8 md:p-12 min-h-[400px] flex items-center justify-center opacity-50">
               <div className="text-center">
                 <Edit3 size={48} className="mx-auto mb-4 text-orange-500" />
                 <div className="w-64 h-4 bg-white/5 rounded-full mb-3 mx-auto"></div>
                 <div className="w-48 h-4 bg-white/5 rounded-full mx-auto"></div>
               </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed">Built on modern architecture. Your notes load instantly, saving your thoughts without a millisecond of delay.</p>
          </div>
          
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p className="text-gray-400 leading-relaxed">Your data is yours. Industry-standard encryption and secure JWT sessions keep your personal notes strictly confidential.</p>
          </div>
          
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Rich Text Editor</h3>
            <p className="text-gray-400 leading-relaxed">Format exactly how you want. Support for markdown, lists, code blocks, and gorgeous typography out of the box.</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 flex items-center justify-center rounded text-black">
              <Flame size={14} className="text-black" fill="#000" />
            </div>
            <span className="font-bold text-gray-300">Ember</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Ember. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
