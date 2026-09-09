import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-24 relative overflow-hidden">
        {/* Subtle backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f4d410]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-xl w-full text-center space-y-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0f0f13] border border-white/10 text-[#f4d410] shadow-xl">
            <Compass className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#f4d410] block font-bold">
              Error 404 / Destination Not Found
            </span>
            <h1 className="text-4xl sm:text-5xl font-light text-white font-['Outfit'] tracking-tight">
              This Page Has <span className="font-serif italic text-[#f4d410]">Departed.</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed font-light">
              The vehicle or showroom page you are seeking may have been reserved, acquired, or relocated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/cars"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Explore Current Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#0f0f13] hover:bg-[#15151c] text-zinc-300 hover:text-white border border-white/10 font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
