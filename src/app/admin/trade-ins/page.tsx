'use client';

import React, { useState, useEffect } from 'react';
import {
  Repeat,
  Phone,
  Mail,
  Car,
  Trash2,
  Calendar,
  ExternalLink,
  DollarSign,
  RefreshCw,
} from 'lucide-react';

export default function AdminTradeInsPage() {
  const [tradeIns, setTradeIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trade-ins');
      const data = await res.json();
      setTradeIns(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/trade-ins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setTradeIns((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trade-in submission?')) return;
    try {
      const res = await fetch(`/api/trade-ins?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTradeIns((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#f4d410] block mb-1">
            APPRAISALS
          </span>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Trade-In & Sell Requests
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Incoming valuation submissions with customer vehicle specifications and photos.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-[#111114] border border-white/10 text-zinc-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500">Loading trade-ins...</div>
        ) : tradeIns.length === 0 ? (
          <div className="p-12 text-center bg-[#111114] border border-white/10 rounded-3xl text-zinc-500 text-xs">
            No trade-in submissions found.
          </div>
        ) : (
          tradeIns.map((item) => (
            <div
              key={item.id}
              className="bg-[#111114] border border-white/10 rounded-2xl p-6 space-y-4 card-hover-fx"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white font-['Outfit']">
                    {item.year} {item.make} {item.model}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#f4d410]/15 text-[#f4d410]">
                    {item.condition}
                  </span>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-[#0c0c0f] border border-white/10 text-white cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="appraised">Appraised</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-zinc-500 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specs & Owner Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Customer</span>
                  <span className="text-white font-bold">{item.customerName}</span>
                  <div className="text-zinc-400">{item.phone}</div>
                  <div className="text-zinc-400">{item.email}</div>
                </div>

                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Odometer & Rego</span>
                  <span className="text-white font-bold">{item.mileage.toLocaleString()} km</span>
                  <div className="text-zinc-400">Plate: {item.registration || 'N/A'}</div>
                </div>

                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Expected Price</span>
                  <span className="text-[#f4d410] font-black text-sm font-['Outfit']">
                    {item.expectedPrice ? `$${item.expectedPrice.toLocaleString()}` : 'Best Offer'}
                  </span>
                </div>

                {item.photos && (
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">Attached Photo</span>
                    <a
                      href={item.photos}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block w-20 h-12 rounded-lg overflow-hidden border border-white/10"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.photos} alt="" className="w-full h-full object-cover" />
                    </a>
                  </div>
                )}
              </div>

              {item.message && (
                <div className="p-3 rounded-xl bg-[#0c0c0f] text-xs text-zinc-300 italic">
                  &ldquo;{item.message}&rdquo;
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
