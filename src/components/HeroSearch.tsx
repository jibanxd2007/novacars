'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Filter, X } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [make, setMake] = useState('all');
  const [bodyType, setBodyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [year, setYear] = useState('all');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (make !== 'all') params.set('make', make);
    if (bodyType !== 'all') params.set('bodyType', bodyType);
    if (year !== 'all') params.set('minYear', year);

    if (priceRange === 'under75k') {
      params.set('maxPrice', '75000');
    } else if (priceRange === '75k-100k') {
      params.set('minPrice', '75000');
      params.set('maxPrice', '100000');
    } else if (priceRange === 'over100k') {
      params.set('minPrice', '100000');
    }

    setMobileDrawerOpen(false);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Mobile Search Button Trigger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full py-4 px-6 rounded-xl bg-[#0f0f13]/90 backdrop-blur-md border border-white/10 text-white font-medium text-xs uppercase tracking-wider flex items-center justify-between shadow-2xl"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#f4d410]" />
            Search & Filter Vehicles
          </span>
          <Filter className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Desktop Minimal Floating Search Interface */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center bg-[#0f0f13]/90 backdrop-blur-xl border border-white/[0.09] rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        {/* Make */}
        <div className="flex-1 px-4 py-2 border-r border-white/5 relative group cursor-pointer">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">
            Make
          </label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none appearance-none cursor-pointer pr-4"
          >
            <option value="all" className="bg-[#0f0f13]">All Marques</option>
            <option value="BMW" className="bg-[#0f0f13]">BMW</option>
            <option value="Mercedes-Benz" className="bg-[#0f0f13]">Mercedes-Benz</option>
            <option value="Audi" className="bg-[#0f0f13]">Audi</option>
            <option value="Porsche" className="bg-[#0f0f13]">Porsche</option>
            <option value="Land Rover" className="bg-[#0f0f13]">Land Rover / Range Rover</option>
            <option value="Jaguar" className="bg-[#0f0f13]">Jaguar</option>
            <option value="Tesla" className="bg-[#0f0f13]">Tesla</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 bottom-3 pointer-events-none" />
        </div>

        {/* Body Style */}
        <div className="flex-1 px-4 py-2 border-r border-white/5 relative group cursor-pointer">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">
            Body Style
          </label>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none appearance-none cursor-pointer pr-4"
          >
            <option value="all" className="bg-[#0f0f13]">All Styles</option>
            <option value="SUV" className="bg-[#0f0f13]">SUV</option>
            <option value="Sedan" className="bg-[#0f0f13]">Sedan</option>
            <option value="Coupe" className="bg-[#0f0f13]">Coupe</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 bottom-3 pointer-events-none" />
        </div>

        {/* Price Range */}
        <div className="flex-1 px-4 py-2 border-r border-white/5 relative group cursor-pointer">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none appearance-none cursor-pointer pr-4"
          >
            <option value="all" className="bg-[#0f0f13]">Any Price</option>
            <option value="under75k" className="bg-[#0f0f13]">Under $75,000</option>
            <option value="75k-100k" className="bg-[#0f0f13]">$75,000 – $100,000</option>
            <option value="over100k" className="bg-[#0f0f13]">$100,000+</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 bottom-3 pointer-events-none" />
        </div>

        {/* Year */}
        <div className="flex-1 px-4 py-2 relative group cursor-pointer">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">
            Min Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none appearance-none cursor-pointer pr-4"
          >
            <option value="all" className="bg-[#0f0f13]">Any Year</option>
            <option value="2023" className="bg-[#0f0f13]">2023+</option>
            <option value="2022" className="bg-[#0f0f13]">2022+</option>
            <option value="2021" className="bg-[#0f0f13]">2021+</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 bottom-3 pointer-events-none" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="h-12 px-7 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shrink-0 ml-2"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Search</span>
        </button>
      </form>

      {/* Mobile Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl md:hidden flex flex-col p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="font-extrabold text-sm uppercase tracking-widest text-white font-['Outfit']">
              Filter Inventory
            </span>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 space-y-6">
            <div>
              <label className="text-xs uppercase font-bold text-zinc-400 block mb-2">Marque</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-[#111114] border border-white/10 rounded-lg p-3 text-sm text-white"
              >
                <option value="all">All Marques</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Porsche">Porsche</option>
                <option value="Land Rover">Land Rover</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-zinc-400 block mb-2">Body Style</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full bg-[#111114] border border-white/10 rounded-lg p-3 text-sm text-white"
              >
                <option value="all">All Styles</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-zinc-400 block mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-[#111114] border border-white/10 rounded-lg p-3 text-sm text-white"
              >
                <option value="all">Any Price</option>
                <option value="under75k">Under $75,000</option>
                <option value="75k-100k">$75,000 – $100,000</option>
                <option value="over100k">$100,000+</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => handleSearch()}
              className="w-full py-3.5 rounded-lg bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider"
            >
              Show Matching Vehicles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
