'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@novacars.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError('Connection error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@novacars.com');
    setPassword('admin');
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f4d410]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="NOVA CARS"
              className="h-20 w-auto mx-auto object-contain drop-shadow-[0_10px_25px_rgba(244,212,16,0.2)]"
            />
          </Link>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] block font-bold">
              Dealer Management Portal
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              Authorized Dealership Staff & Inventory Management
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white font-['Outfit']">Dealer Login</h2>
            <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Protected
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@novacars.com"
                  className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#f4d410]/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Login Quick-Fill */}
          <div className="pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#f4d410]" />
              Auto-Fill Demo Admin Credentials
            </button>
            <p className="text-[11px] text-zinc-500 text-center mt-2">
              Default: <code className="text-zinc-400">admin@novacars.com</code> / <code className="text-zinc-400">admin</code>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← Return to Nova Cars Public Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
