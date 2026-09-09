'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Phone,
  Mail,
  Car,
  Trash2,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function AdminTestDrivesPage() {
  const [testDrives, setTestDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-drives');
      const data = await res.json();
      setTestDrives(data);
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
      const res = await fetch('/api/test-drives', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setTestDrives((prev) =>
          prev.map((td) => (td.id === id ? { ...td, status: newStatus } : td))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      const res = await fetch(`/api/test-drives?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestDrives((prev) => prev.filter((td) => td.id !== id));
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
            APPOINTMENTS
          </span>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Test Drive Bookings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Confirmed and requested test drive appointments with vehicle assignments.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-[#111114] border border-white/10 text-zinc-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#111114] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500">Loading appointments...</div>
        ) : testDrives.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500">No test drives scheduled yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0c0f] border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {testDrives.map((td) => (
                  <tr key={td.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-white text-sm font-['Outfit'] block">
                        {td.customerName}
                      </span>
                      {td.message && (
                        <span className="text-[11px] text-zinc-400 italic block mt-0.5 line-clamp-1">
                          &ldquo;{td.message}&rdquo;
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <a href={`tel:${td.phone}`} className="text-white hover:underline block font-mono">
                        {td.phone}
                      </a>
                      <a href={`mailto:${td.email}`} className="text-zinc-400 hover:underline block text-[11px]">
                        {td.email}
                      </a>
                    </td>
                    <td className="p-4">
                      {td.vehicle ? (
                        <div className="font-semibold text-white">
                          {td.vehicle.year} {td.vehicle.make} {td.vehicle.model}
                          <span className="text-[#f4d410] text-[10px] block font-mono">
                            {td.vehicle.stockNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500">Showroom Fleet Choice</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#f4d410]" />
                        <span>{td.date} @ {td.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={td.status}
                        onChange={(e) => handleStatusChange(td.id, e.target.value)}
                        className={`text-[10px] font-extrabold uppercase rounded px-2.5 py-1 bg-[#0c0c0f] border cursor-pointer ${
                          td.status === 'confirmed'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : td.status === 'completed'
                            ? 'text-blue-400 border-blue-500/30'
                            : td.status === 'cancelled'
                            ? 'text-rose-400 border-rose-500/30'
                            : 'text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="requested">Requested</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(td.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
