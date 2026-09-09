'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
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
    featured?: boolean;
    status?: string;
    slug: string;
    images?: Array<{ url: string; isPrimary?: boolean; alt?: string | null }>;
  };
  badgeLabel?: string;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('nova_favorites') || '[]');
      setIsFavorite(favs.includes(vehicle.id));
    } catch (e) {
      // ignore
    }
  }, [vehicle.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let favs = JSON.parse(localStorage.getItem('nova_favorites') || '[]');
      if (favs.includes(vehicle.id)) {
        favs = favs.filter((id: string) => id !== vehicle.id);
        setIsFavorite(false);
      } else {
        favs.push(vehicle.id);
        setIsFavorite(true);
      }
      localStorage.setItem('nova_favorites', JSON.stringify(favs));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      // ignore
    }
  };

  const primaryImg =
    vehicle.images?.find((img) => img.isPrimary)?.url ||
    vehicle.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

  const formattedPrice = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: 0,
  }).format(vehicle.salePrice || vehicle.price);

  return (
    <div className="group relative bg-[#0d0d10] border border-white/[0.08] rounded-xl overflow-hidden car-card-hover flex flex-col justify-between">
      {/* 1. Photography (Dominates 70% of Card) */}
      <div className="relative aspect-[16/11] overflow-hidden bg-zinc-950">
        {/* Wishlist Heart */}
        <button
          onClick={toggleFavorite}
          aria-label="Save to favorites"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#f4d410] text-[#f4d410]' : ''
            }`}
          />
        </button>

        {/* Vehicle Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImg}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Subtle Bottom Shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-transparent to-transparent opacity-60" />
      </div>

      {/* 2. Structured Editorial Information */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-5">
        <div className="space-y-2">
          {/* Eyebrow Year */}
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.2em] block">
            {vehicle.year}
          </span>

          {/* Model Heading */}
          <Link href={`/cars/${vehicle.slug}`} className="block group/link">
            <h3 className="text-white font-bold text-lg font-['Outfit'] tracking-tight group-hover/link:text-[#f4d410] transition-colors line-clamp-1">
              {vehicle.make} {vehicle.model}
              {vehicle.variant ? ` ${vehicle.variant}` : ''}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl font-extrabold text-white tracking-tight font-['Outfit']">
              {formattedPrice}
            </span>
            {vehicle.salePrice && (
              <span className="text-xs line-through text-zinc-500">
                ${vehicle.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Specs Row */}
          <p className="text-xs text-zinc-400 font-medium tracking-wide pt-0.5">
            {vehicle.mileage.toLocaleString()} km · {vehicle.transmission} · {vehicle.fuelType}
          </p>
        </div>

        {/* 3. Text-Based Clean Action CTA */}
        <div className="pt-3 border-t border-white/[0.06]">
          <Link
            href={`/cars/${vehicle.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 group-hover:text-[#f4d410] tracking-wider uppercase transition-colors"
          >
            <span>View Vehicle</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
