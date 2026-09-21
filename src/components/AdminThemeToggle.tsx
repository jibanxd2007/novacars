'use client';

import React from 'react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function AdminThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useAdminTheme();
  const isLight = theme === 'light';

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${
          isLight
            ? 'bg-zinc-100 hover:bg-zinc-200 text-amber-500 border-zinc-200'
            : 'bg-white/5 hover:bg-white/10 text-[#f4d410] border-white/10'
        }`}
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        aria-label="Toggle admin theme"
      >
        {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-xs font-medium ${
        isLight
          ? 'bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-700 border-zinc-200'
          : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/[0.08]'
      }`}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle admin theme"
    >
      <div className="flex items-center gap-2">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 text-[#f4d410]" />
        )}
        <span>{isLight ? 'Light Mode' : 'Dark Mode'}</span>
      </div>

      {/* Mini Toggle Pill */}
      <div
        className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
          isLight ? 'bg-amber-400' : 'bg-zinc-700'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isLight ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
