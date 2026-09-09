'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function FinanceContent() {
  const searchParams = useSearchParams();
  const initialPrice = Number(searchParams.get('price')) || 85000;
  const initialDeposit = Number(searchParams.get('deposit')) || 17000;
  const initialTerm = Number(searchParams.get('term')) || 48;
  const vehicleIdParam = searchParams.get('vehicleId') || '';

  const [price, setPrice] = useState(initialPrice);
  const [deposit, setDeposit] = useState(initialDeposit);
  const [term, setTerm] = useState(initialTerm);
  const [interestRate, setInterestRate] = useState(8.95);

  // Application Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employment, setEmployment] = useState('Full-Time Employed');
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const loanAmount = Math.max(0, price - deposit);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyRepayment =
    monthlyRate > 0 && term > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1)
      : loanAmount / (term || 1);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicleIdParam || null,
          customerName: name,
          email,
          phone,
          vehiclePrice: price,
          deposit,
          loanTerm: term,
          interestRate,
          estimatedMonthly: Math.round(monthlyRepayment),
          employmentStatus: employment,
        }),
      });
      if (res.ok) {
        setApplied(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <Navbar />

      {/* Header */}
      <div className="pt-36 pb-12 border-b border-white/[0.06] bg-[#09090c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Financing
            </span>
            <h1 className="text-4xl sm:text-6xl font-light text-white font-['Outfit'] tracking-tight">
              Bespoke Lending. <br />
              <span className="font-extrabold text-white">Transparent Terms.</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light pt-2">
              Competitive rates, flexible loan terms up to 84 months, and rapid pre-approval with zero hidden fees.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 w-full flex-1 space-y-16">
        {/* Main 2-Column Clean Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-[#0c0c0f] border border-white/[0.08] rounded-2xl p-8 sm:p-12">
          {/* Left Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Vehicle Price</span>
                <span className="text-white font-bold">${price.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="250000"
                step="2500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#f4d410]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Deposit</span>
                <span className="text-white font-bold">${deposit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={price * 0.8}
                step="1000"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full accent-[#f4d410]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Loan Term</span>
                <span className="text-white font-bold">{term} Months</span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="12"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full accent-[#f4d410]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Interest Rate</span>
                <span className="text-[#f4d410] font-bold">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="5"
                max="16"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#f4d410]"
              />
            </div>
          </div>

          {/* Right Estimated Payment Card (5 Cols) */}
          <div className="lg:col-span-5 p-8 rounded-xl bg-[#141419] border border-white/[0.08] space-y-6 text-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block">
              Estimated Payment
            </span>
            <div>
              <span className="text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
                ${Math.round(monthlyRepayment).toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400 block mt-1">/ month</span>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Loan amount:</span>
                <span className="text-white font-bold">${loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Deposit paid:</span>
                <span className="text-white">${deposit.toLocaleString()}</span>
              </div>
            </div>

            <a
              href="#apply-form"
              className="w-full py-3.5 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider block transition-colors shadow-md"
            >
              Apply for Finance
            </a>
          </div>
        </div>

        {/* Application Form */}
        <div id="apply-form" className="max-w-xl mx-auto bg-[#0c0c0f] border border-white/[0.08] rounded-2xl p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Pre-Approval Application
            </span>
            <h2 className="text-2xl font-light text-white font-['Outfit'] mt-1">
              Apply in Under 2 Minutes
            </h2>
          </div>

          {applied ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Application Received</h3>
              <p className="text-xs text-zinc-400 font-light">
                Our finance director will review your pre-qualification and reach out shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+64 21 000 0000"
                    className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                  Employment Status
                </label>
                <select
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value)}
                  className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Full-Time Employed">Full-Time Employed</option>
                  <option value="Self-Employed / Director">Self-Employed / Director</option>
                  <option value="Contract / Retired">Contract / Retired</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                {loading ? 'Processing...' : 'Submit Application →'}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709]" />}>
      <FinanceContent />
    </Suspense>
  );
}
