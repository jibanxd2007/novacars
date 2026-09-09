'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  RefreshCw,
} from 'lucide-react';

interface AdminVehicle {
  id: string;
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  price: number;
  salePrice?: number | null;
  mileage: number;
  stockNumber: string;
  status: string;
  featured: boolean;
  slug: string;
  images: Array<{ url: string; isPrimary: boolean }>;
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars?status=all&limit=100');
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (v: AdminVehicle, newStatus: string) => {
    try {
      const res = await fetch(`/api/cars/${v.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((car) => (car.id === v.id ? { ...car, status: newStatus } : car))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (v: AdminVehicle) => {
    try {
      const res = await fetch(`/api/cars/${v.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !v.featured }),
      });
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((car) => (car.id === v.id ? { ...car, featured: !car.featured } : car))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.stockNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block">
            Catalogue
          </span>
          <h1 className="text-3xl font-light text-white font-['Outfit']">
            Fleet Inventory
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadVehicles}
            className="p-2.5 rounded-lg bg-[#0c0c0f] border border-white/[0.08] text-zinc-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/cars/new"
            className="px-4 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#f4d410] transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make, model, stock..."
            className="w-full bg-[#0c0c0f] border border-white/[0.08] rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {['all', 'published', 'draft', 'reserved', 'sold'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded text-[11px] uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table (Clean & Sophisticated) */}
      <div className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-mono">
            Loading fleet data...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-mono">
            No matching vehicles found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] text-zinc-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Vehicle</th>
                  <th className="p-4">Stock #</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredVehicles.map((v) => {
                  const img =
                    v.images.find((i) => i.isPrimary)?.url ||
                    v.images[0]?.url ||
                    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr key={v.id} className="hover:bg-white/[0.015] transition-colors">
                      {/* Vehicle Image & Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-9 rounded overflow-hidden bg-zinc-950 shrink-0 border border-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <Link
                              href={`/cars/${v.slug}`}
                              target="_blank"
                              className="font-bold text-white hover:text-[#f4d410] flex items-center gap-1.5"
                            >
                              <span>{v.year} {v.make} {v.model}</span>
                              <ExternalLink className="w-3 h-3 opacity-30" />
                            </Link>
                            <span className="text-[11px] text-zinc-500 block">
                              {v.variant || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Stock # */}
                      <td className="p-4 font-mono text-zinc-400">{v.stockNumber}</td>

                      {/* Price */}
                      <td className="p-4 font-extrabold text-white font-['Outfit'] text-sm">
                        ${(v.salePrice || v.price).toLocaleString()}
                      </td>

                      {/* Subtle Status Selector */}
                      <td className="p-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v, e.target.value)}
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-transparent border cursor-pointer ${
                            v.status === 'published'
                              ? 'text-emerald-400 border-emerald-500/30'
                              : v.status === 'sold'
                              ? 'text-rose-400 border-rose-500/30'
                              : v.status === 'reserved'
                              ? 'text-blue-400 border-blue-500/30'
                              : 'text-zinc-400 border-white/10'
                          }`}
                        >
                          <option value="published" className="bg-[#0c0c0f]">Published</option>
                          <option value="draft" className="bg-[#0c0c0f]">Draft</option>
                          <option value="reserved" className="bg-[#0c0c0f]">Reserved</option>
                          <option value="sold" className="bg-[#0c0c0f]">Sold</option>
                        </select>
                      </td>

                      {/* Featured */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(v)}
                          className="text-zinc-600 hover:text-[#f4d410]"
                          title="Toggle Featured"
                        >
                          <Star className={`w-3.5 h-3.5 ${v.featured ? 'fill-[#f4d410] text-[#f4d410]' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 text-zinc-400">
                          <Link
                            href={`/admin/cars/${v.id}/edit`}
                            className="p-1.5 hover:text-white"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(v.id, `${v.year} ${v.make} ${v.model}`)}
                            className="p-1.5 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
