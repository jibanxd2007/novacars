'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Car,
  Trash2,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function AdminFinancePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/finance');
      const data = await res.json();
      setApplications(data);
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
      const res = await fetch('/api/finance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    try {
      const res = await fetch(`/api/finance?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
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
            LENDING PIPELINE
          </span>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Finance Applications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Pre-qualification submissions, deposit figures, and income declarations.
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
          <div className="py-20 text-center text-xs text-zinc-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500">No finance applications received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0c0f] border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Applicant</th>
                  <th className="p-4">Vehicle / Price</th>
                  <th className="p-4">Deposit & Term</th>
                  <th className="p-4">Est. Monthly</th>
                  <th className="p-4">Employment / Income</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-white text-sm font-['Outfit'] block">
                        {app.customerName}
                      </span>
                      <span className="text-zinc-400 text-[11px] block">{app.phone}</span>
                      <span className="text-zinc-400 text-[11px] block">{app.email}</span>
                    </td>
                    <td className="p-4">
                      {app.vehicle ? (
                        <div>
                          <span className="font-bold text-white">
                            {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}
                          </span>
                          <span className="text-[#f4d410] text-xs font-bold block">
                            ${app.vehiclePrice.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white font-bold">
                          ${app.vehiclePrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-white font-semibold">
                        Deposit: ${app.deposit.toLocaleString()}
                      </div>
                      <div className="text-zinc-400 text-[11px]">{app.loanTerm} Months</div>
                    </td>
                    <td className="p-4">
                      <span className="text-base font-extrabold text-[#f4d410] font-['Outfit']">
                        ${Math.round(app.estimatedMonthly).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">/ mo</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white block">{app.employmentStatus || 'Employed'}</span>
                      <span className="text-zinc-400 text-[11px]">
                        {app.annualIncome ? `$${app.annualIncome.toLocaleString()} / yr` : 'Not declared'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-[10px] font-extrabold uppercase rounded px-2.5 py-1 bg-[#0c0c0f] border cursor-pointer ${
                          app.status === 'approved'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : app.status === 'declined'
                            ? 'text-rose-400 border-rose-500/30'
                            : 'text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400"
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
