'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Car,
  Trash2,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface EnquiryItem {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: string;
  status: string;
  createdAt: string;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    stockNumber: string;
    price: number;
  } | null;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      setEnquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = enquiries.filter(
    (e) => statusFilter === 'all' || e.status === statusFilter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#f4d410] block mb-1">
            CLIENT LEADS
          </span>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Customer Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Incoming prospective buyer questions, price quotes, and showroom inquiries.
          </p>
        </div>

        <button
          onClick={loadEnquiries}
          className="p-2.5 rounded-xl bg-[#111114] border border-white/10 text-zinc-400 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['all', 'new', 'contacted', 'follow-up', 'converted', 'closed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors ${
              statusFilter === st
                ? 'bg-[#f4d410] text-black'
                : 'bg-[#111114] text-zinc-400 border border-white/10 hover:text-white'
            }`}
          >
            {st} ({enquiries.filter((e) => st === 'all' || e.status === st).length})
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500">Loading enquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#111114] border border-white/10 rounded-3xl text-zinc-500 text-xs">
            No inquiries match this status.
          </div>
        ) : (
          filtered.map((enq) => (
            <div
              key={enq.id}
              className="bg-[#111114] border border-white/10 rounded-2xl p-6 space-y-4 card-hover-fx"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-white font-['Outfit']">
                    {enq.customerName}
                  </span>
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-[#0c0c0f] border cursor-pointer ${
                      enq.status === 'new'
                        ? 'text-amber-400 border-amber-500/30'
                        : enq.status === 'converted'
                        ? 'text-emerald-400 border-emerald-500/30'
                        : 'text-zinc-400 border-white/10'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow-up">Follow-Up</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#f4d410]" />
                    {new Date(enq.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#f4d410]" />
                  <a href={`tel:${enq.phone}`} className="hover:underline text-white font-mono">
                    {enq.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#f4d410]" />
                  <a href={`mailto:${enq.email}`} className="hover:underline text-white">
                    {enq.email}
                  </a>
                </div>
                <div className="text-zinc-400">
                  Prefers: <span className="text-white uppercase font-bold text-[10px]">{enq.preferredContact}</span>
                </div>
              </div>

              {enq.vehicle && (
                <div className="p-3 rounded-xl bg-[#0c0c0f] border border-white/5 flex items-center gap-2 text-xs">
                  <Car className="w-4 h-4 text-[#f4d410]" />
                  <span className="text-zinc-400">Referenced Vehicle:</span>
                  <span className="font-bold text-white">
                    {enq.vehicle.year} {enq.vehicle.make} {enq.vehicle.model}
                  </span>
                  <span className="text-[#f4d410] font-mono">({enq.vehicle.stockNumber})</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#0c0c0f] text-xs text-zinc-200 italic leading-relaxed">
                &ldquo;{enq.message}&rdquo;
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
