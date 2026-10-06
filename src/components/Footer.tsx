'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Download, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.06] pt-16 pb-12 text-zinc-500 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/logo-horizontal.png"
                alt="NOVA CARS"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-zinc-400 font-light max-w-xs leading-relaxed">
              Premium vehicles. Trusted by enthusiasts.
            </p>
            <div className="pt-1 text-xs text-zinc-400 space-y-1.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#f4d410] shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps?sca_esv=99fa615e217dff4e&rlz=1C1GCEA_enNZ1144NZ1145&output=search&q=298+great+south+road+manurewa&source=lnms&fbs=ABfTbFVyMZGZf1hfvX9uKjN_-G8cTs4PJElQ4Z4ROUfAdKhH1pgN3jaVPpJtZ8IN28B_o1lYqtnDALglqDPRhVL6HplIgTemOWjx2ojgLHIc4xg2qpTj8SlxDMUFw13IP8E1ULiEBuyZMl77DANXvv0NhZ9PWApk9obY8QMT6KWXfW151Jm32YAGV4ysQ0jIeaDEuJkslkiVZ_4PZl44HWRh62tiBJNsKQ&entry=mc&ved=1t:200715&ictx=111"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  298B Great South Road, Manurewa, Auckland
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#f4d410] shrink-0" />
                <a href="tel:+6498884321" className="hover:text-white transition-colors">
                  +64 9 888 4321
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2 text-zinc-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f4d410] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f4d410] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f4d410] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#f4d410] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block mb-4">
              Quick Links
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

          {/* Support */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block mb-4">
              Support
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Download Brand Book */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block mb-4">
              Download Brand Book
            </span>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-zinc-300">
                <FileText className="w-4 h-4 text-[#f4d410] shrink-0" />
                <span className="truncate">Brand Book v1.0 (PDF)</span>
              </div>
              <a
                href="/brand-book.pdf"
                download
                className="w-full py-2.5 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
              >
                Download
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Nova Cars. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
