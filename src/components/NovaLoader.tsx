'use client';

import React from 'react';

interface NovaLoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function NovaLoader({
  text,
  subtext = 'Auckland Showroom',
  fullScreen = true,
  size = 'md',
}: NovaLoaderProps) {
  const emblemSize = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Ambient background glow */}
      <div className="absolute w-44 h-44 rounded-full bg-[#f4d410]/15 blur-[70px] pointer-events-none -translate-y-4" />

      {/* Animated Emblem */}
      <div className="relative z-10 nova-logo-pulse mb-5">
        <img
          src="/logo-emblem.png"
          alt="Nova Cars"
          className={`${emblemSize} w-auto object-contain`}
        />
      </div>

      {/* Brand Title */}
      <div className="text-center relative z-10 space-y-2">
        <span className="font-extrabold text-sm sm:text-base tracking-[0.28em] text-white uppercase font-['Outfit'] block">
          NOVA<span className="text-[#f4d410]">CARS</span>
        </span>

        {/* Minimalist Sweep Bar */}
        <div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden relative mx-auto my-3">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#f4d410] to-transparent nova-progress-sweep" />
        </div>

        {/* Dynamic Context Text */}
        <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 font-medium animate-pulse">
          {text || subtext}
        </p>
      </div>
    </div>
  );

  if (!fullScreen) {
    return (
      <div className="py-16 flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070709] flex items-center justify-center p-6">
      {content}
    </div>
  );
}
