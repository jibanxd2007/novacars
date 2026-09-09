'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function TradeInPage() {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [registration, setRegistration] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/trade-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          make,
          model,
          year: Number(year),
          mileage: Number(mileage),
          registration,
          condition,
          expectedPrice: Number(expectedPrice) || null,
          message,
          photos: photoUrl,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
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
              Valuations & Trade-Ins
            </span>
            <h1 className="text-4xl sm:text-6xl font-light text-white font-['Outfit'] tracking-tight">
              What&apos;s Your Car <br />
              <span className="font-extrabold text-white">Worth?</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light pt-2">
              Receive a fair, guaranteed market valuation or trade towards any vehicle in our showroom.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 w-full flex-1 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: 3-step narrative (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
                The Process
              </span>
              <h2 className="text-2xl font-light text-white font-['Outfit']">
                Fast, Objective Appraisals.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Our appraisal team evaluates live wholesale demand and genuine market transactions to ensure you receive the true value of your vehicle.
              </p>
            </div>

            <div className="space-y-6 text-xs font-mono border-t border-white/[0.08] pt-6">
              <div className="space-y-1">
                <span className="text-zinc-500 block">01 / SUBMIT DETAILS</span>
                <p className="text-zinc-300 font-sans font-light">
                  Provide vehicle registration, mileage, condition, and optional photos.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 block">02 / EXPERT VALUATION</span>
                <p className="text-zinc-300 font-sans font-light">
                  Receive a written, firm market appraisal within 60 minutes.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 block">03 / SAME-DAY SETTLEMENT</span>
                <p className="text-zinc-300 font-sans font-light">
                  Apply credit towards your next drive or receive cleared bank funds.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clean Valuation Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0c0c0f] border border-white/[0.08] rounded-2xl p-8 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
                Vehicle Appraisal Form
              </span>
              <h3 className="text-xl font-light text-white font-['Outfit'] mt-1">
                Enter Details
              </h3>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Appraisal Request Submitted</h4>
                <p className="text-xs text-zinc-400 font-light">
                  Thank you, {customerName}. Our valuation director will contact you via {phone} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full name"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Make *
                    </label>
                    <input
                      type="text"
                      required
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      placeholder="e.g. BMW"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. M3"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Mileage (km) *
                    </label>
                    <input
                      type="number"
                      required
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="e.g. 38000"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      License Plate
                    </label>
                    <input
                      type="text"
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      placeholder="Plate"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Expected Price ($NZD optional)
                    </label>
                    <input
                      type="number"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="e.g. 55000"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Photo Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {submitting ? 'Submitting...' : 'Request Valuation →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
