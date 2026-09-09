'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inventory', href: '/cars' },
    { name: 'Finance', href: '/finance' },
    { name: 'Trade In', href: '/trade-in' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isHome = pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? 'bg-[#070709]/90 backdrop-blur-md py-4 border-b border-white/[0.07] shadow-xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo-horizontal.png"
                alt="NOVA CARS"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-9 text-[13px] font-medium tracking-wide">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors relative py-1 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#f4d410] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right CTA */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/admin"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors tracking-wider uppercase font-medium"
              >
                Portal
              </Link>
              <Link
                href="/cars"
                className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-[#f4d410] hover:text-black font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 shadow-sm"
              >
                <span>Explore Cars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-300 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#070709] md:hidden pt-24 px-8 flex flex-col justify-between pb-10">
          <div className="space-y-8">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="inline-block">
              <img
                src="/logo-horizontal.png"
                alt="NOVA CARS"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-light tracking-tight ${
                  pathname === link.href ? 'text-[#f4d410] font-medium' : 'text-zinc-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-zinc-500 pt-4"
            >
              Dealer Admin Portal
            </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-lg bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider block"
            >
              Explore Inventory
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
