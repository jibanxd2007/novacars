'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.06] pt-24 pb-14 text-zinc-500 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.05]">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/logo-horizontal.png"
                alt="NOVA CARS"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-zinc-400 font-light max-w-sm leading-relaxed">
              Find your next drive. A curated collection of verified luxury European and performance motor vehicles.
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">
              104 Great North Road, Grey Lynn, Auckland
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block mb-4">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-white transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-white transition-colors">
                  Trade In
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Channels */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block mb-4">
              Social
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  Staff CMS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} Nova Cars. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
