'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  price: number;
  salePrice?: number | null;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  condition: string;
  featured: boolean;
  status: string;
  stockNumber: string;
  slug: string;
  images: Array<{ url: string; isPrimary: boolean; alt?: string | null }>;
}

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [make, setMake] = useState(searchParams.get('make') || 'all');
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || 'all');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || 'all');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minYear, setMinYear] = useState(searchParams.get('minYear') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (make !== 'all') params.set('make', make);
      if (bodyType !== 'all') params.set('bodyType', bodyType);
      if (fuelType !== 'all') params.set('fuelType', fuelType);
      if (transmission !== 'all') params.set('transmission', transmission);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minYear) params.set('minYear', minYear);
      params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      setVehicles(data.vehicles || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search, make, bodyType, fuelType, transmission, minPrice, maxPrice, minYear, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setMake('all');
    setBodyType('all');
    setFuelType('all');
    setTransmission('all');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setSort('newest');
    setPage(1);
    router.push('/cars');
  };

  const makes = ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Land Rover', 'Jaguar', 'Tesla'];
  const bodyTypes = ['SUV', 'Sedan', 'Coupe'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <Navbar />

      {/* Editorial Header */}
      <div className="pt-36 pb-12 border-b border-white/[0.06] bg-[#09090c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Our Inventory
            </span>
            <h1 className="text-4xl sm:text-6xl font-light text-white font-['Outfit'] tracking-tight">
              Find Something <br />
              <span className="font-extrabold text-white">Worth Driving.</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light pt-2">
              Every vehicle has been inspected, certified, and prepared for immediate delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ================= DESKTOP FILTERS SIDEBAR (3 COLS) ================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-28 bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-zinc-400 hover:text-[#f4d410] flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-2 tracking-wider">
                Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search model, specs..."
                  className="w-full bg-[#141419] border border-white/[0.08] rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Make */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-2 tracking-wider">
                Marque
              </label>
              <select
                value={make}
                onChange={(e) => {
                  setMake(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="all">All Marques</option>
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Style */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-2 tracking-wider">
                Body Style
              </label>
              <select
                value={bodyType}
                onChange={(e) => {
                  setBodyType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="all">All Styles</option>
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-2 tracking-wider">
                Price Range ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Min"
                  className="bg-[#141419] border border-white/[0.08] rounded-lg py-2 px-2.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Max"
                  className="bg-[#141419] border border-white/[0.08] rounded-lg py-2 px-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-2 tracking-wider">
                Min Year
              </label>
              <input
                type="number"
                value={minYear}
                onChange={(e) => {
                  setMinYear(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. 2022"
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-2 tracking-wider">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">Any Fuel Type</option>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* ================= VEHICLE CATALOG (9 COLS) ================= */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Bar: Count & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden px-4 py-2 rounded-lg bg-[#0c0c0f] border border-white/10 text-xs font-semibold flex items-center gap-2"
                >
                  <Filter className="w-3.5 h-3.5 text-[#f4d410]" />
                  Filters
                </button>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  {vehicles.length} of {totalCount} Vehicles Available
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="bg-[#0c0c0f] border border-white/[0.08] rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="mileage_asc">Lowest Mileage</option>
                  <option value="year_desc">Year: Newest</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0c0c0f] border border-white/5 rounded-xl aspect-[16/11] animate-pulse"
                  />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-16 text-center space-y-4">
                <h3 className="text-xl font-light text-white font-['Outfit']">
                  No matching vehicles currently in stock
                </h3>
                <p className="text-xs text-zinc-400 font-light">
                  Please reset your criteria or contact our concierge to source a specific vehicle.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#f4d410] transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((car) => (
                  <VehicleCard key={car.id} vehicle={car} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-10 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg bg-[#0c0c0f] border border-white/[0.08] text-zinc-400 hover:text-white disabled:opacity-20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-zinc-400 px-4">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg bg-[#0c0c0f] border border-white/[0.08] text-zinc-400 hover:text-white disabled:opacity-20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl md:hidden flex flex-col p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="font-bold text-sm uppercase tracking-widest text-white">
              Filters
            </span>
            <button
              onClick={() => setMobileFiltersOpen(false)}
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
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
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
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex gap-3">
            <button
              onClick={resetFilters}
              className="flex-1 py-3 rounded-lg bg-white/5 text-xs uppercase tracking-wider font-bold"
            >
              Reset
            </button>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 py-3 rounded-lg bg-[#f4d410] text-black text-xs uppercase tracking-wider font-bold"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709]" />}>
      <InventoryContent />
    </Suspense>
  );
}
