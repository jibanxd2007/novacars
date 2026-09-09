'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import NovaLoader from '@/components/NovaLoader';
import {
  Heart,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface VehicleDetail {
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
  engine?: string | null;
  engineSize?: string | null;
  power?: string | null;
  drivetrain?: string | null;
  bodyType: string;
  doors?: number | null;
  seats?: number | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  registration?: string | null;
  vin?: string | null;
  stockNumber: string;
  description: string;
  status: string;
  featured: boolean;
  slug: string;
  location: string;
  condition: string;
  images: Array<{ id: string; url: string; isPrimary: boolean; alt?: string | null }>;
  features: Array<{ id: string; name: string }>;
}

export default function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Enquiry Form State
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Test Drive Modal State
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [tdName, setTdName] = useState('');
  const [tdEmail, setTdEmail] = useState('');
  const [tdPhone, setTdPhone] = useState('');
  const [tdDate, setTdDate] = useState('');
  const [tdTime, setTdTime] = useState('10:00 AM');
  const [tdSubmitted, setTdSubmitted] = useState(false);

  // Finance Calculator State
  const [deposit, setDeposit] = useState(15000);
  const [loanTerm, setLoanTerm] = useState(48); // months
  const [interestRate, setInterestRate] = useState(8.95);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/cars/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setVehicle(data);
          setDeposit(Math.round(data.price * 0.2));

          const simRes = await fetch(`/api/cars?bodyType=${data.bodyType}&limit=4`);
          if (simRes.ok) {
            const simData = await simRes.json();
            setSimilarCars((simData.vehicles || []).filter((v: any) => v.id !== data.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error loading vehicle:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#f4d410] rounded-full animate-spin" />
        <span className="mt-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Loading Vehicle Details...
        </span>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-center items-center px-4">
        <Navbar />
        <h1 className="text-2xl font-light font-['Outfit']">Vehicle Not Found</h1>
        <p className="text-zinc-500 mt-2 text-xs">
          This vehicle is no longer in active showroom inventory.
        </p>
        <Link
          href="/cars"
          className="mt-6 px-6 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider"
        >
          View All Inventory
        </Link>
        <Footer />
      </div>
    );
  }

  const images = vehicle.images.length > 0 ? vehicle.images : [
    { id: '1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=85', isPrimary: true, alt: vehicle.model }
  ];

  const carPrice = vehicle.salePrice || vehicle.price;
  const loanAmount = Math.max(0, carPrice - deposit);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0 && loanTerm > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : loanAmount / (loanTerm || 1);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: enquiryName,
          email: enquiryEmail,
          phone: enquiryPhone,
          message: enquiryMessage || `Inquiry regarding ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock: ${vehicle.stockNumber})`,
          preferredContact: 'phone',
        }),
      });
      if (res.ok) {
        setEnquirySubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnquiryLoading(false);
    }
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/test-drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: tdName,
          email: tdEmail,
          phone: tdPhone,
          date: tdDate,
          time: tdTime,
          message: `Private viewing requested for ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        }),
      });
      if (res.ok) {
        setTdSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <NovaLoader text="Loading Vehicle Details..." subtext="Accessing Showroom Record" />;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-4 max-w-md">
            <h1 className="text-3xl font-light text-white font-['Outfit']">Vehicle Unavailable</h1>
            <p className="text-xs text-zinc-400">This vehicle is no longer in inventory or has been relocated.</p>
            <Link href="/cars" className="inline-block px-6 py-3 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#f4d410] transition-colors">
              Return to Inventory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const metadataSpecs = [
    { label: 'Year', val: vehicle.year },
    { label: 'Mileage', val: `${vehicle.mileage.toLocaleString()} km` },
    { label: 'Transmission', val: vehicle.transmission },
    { label: 'Fuel Type', val: vehicle.fuelType },
    { label: 'Engine', val: vehicle.engine || 'High Performance' },
    { label: 'Engine Size', val: vehicle.engineSize || 'N/A' },
    { label: 'Power Output', val: vehicle.power || 'N/A' },
    { label: 'Drivetrain', val: vehicle.drivetrain || 'AWD' },
    { label: 'Body Style', val: vehicle.bodyType },
    { label: 'Doors / Seats', val: `${vehicle.doors || 5} Doors / ${vehicle.seats || 5} Seats` },
    { label: 'Exterior Finish', val: vehicle.exteriorColor || 'Metallic' },
    { label: 'Interior Leather', val: vehicle.interiorColor || 'Leather' },
    { label: 'Registration', val: vehicle.registration || 'Current' },
    { label: 'Stock Number', val: vehicle.stockNumber },
    { label: 'VIN', val: vehicle.vin || 'Available upon request' },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <Navbar />

      {/* Main Container */}
      <main className="pt-28 pb-28 max-w-6xl mx-auto px-6 lg:px-10 w-full flex-1 space-y-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Car',
              name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}`.trim(),
              brand: {
                '@type': 'Brand',
                name: vehicle.make,
              },
              model: vehicle.model,
              vehicleModelDate: vehicle.year.toString(),
              mileageFromOdometer: {
                '@type': 'QuantitativeValue',
                value: vehicle.mileage,
                unitCode: 'KMT',
              },
              fuelType: vehicle.fuelType,
              vehicleTransmission: vehicle.transmission,
              vehicleIdentificationNumber: vehicle.vin || undefined,
              bodyType: vehicle.bodyType,
              offers: {
                '@type': 'Offer',
                price: vehicle.salePrice || vehicle.price,
                priceCurrency: 'NZD',
                availability:
                  vehicle.status === 'published'
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                seller: {
                  '@type': 'AutoDealer',
                  name: 'NOVA CARS',
                  telephone: '+64 9 888 4321',
                },
              },
              image: vehicle.images.map((img) => img.url),
            }),
          }}
        />

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Link href="/cars" className="hover:text-white transition-colors">
            ← Back to Inventory
          </Link>
          <span>/</span>
          <span className="text-zinc-400">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* 1. IMMERSIVE HERO GALLERY */}
        <div className="space-y-4">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.08] shadow-2xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedImgIndex]?.url}
              alt={vehicle.model}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen Trigger */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 hover:bg-black"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>

          {/* Minimal Horizontal Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative w-28 aspect-[16/10] rounded-lg overflow-hidden shrink-0 border transition-all duration-200 ${
                    selectedImgIndex === idx
                      ? 'border-[#f4d410] opacity-100'
                      : 'border-transparent opacity-40 hover:opacity-80'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. HEADER: Title, Pricing & Primary CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-12 border-b border-white/[0.08] gap-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#f4d410] uppercase tracking-[0.25em] block">
              {vehicle.year} · Stock {vehicle.stockNumber}
            </span>
            <h1 className="text-4xl sm:text-6xl font-light text-white font-['Outfit'] tracking-tight">
              {vehicle.make} <span className="font-extrabold">{vehicle.model}</span>{' '}
              {vehicle.variant && <span className="text-zinc-400 font-normal">{vehicle.variant}</span>}
            </h1>
            <p className="text-xs text-zinc-400 tracking-wide font-mono">
              {vehicle.mileage.toLocaleString()} km · {vehicle.transmission} · {vehicle.fuelType} · {vehicle.location}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-4">
            <div className="text-left sm:text-right">
              <span className="text-3xl sm:text-5xl font-light text-white font-['Outfit'] tracking-tight">
                ${carPrice.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-500 block mt-1">Drive away in New Zealand</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#enquiry-section"
                className="px-6 py-3.5 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all duration-200"
              >
                Enquire Now
              </a>
              <button
                onClick={() => setTestDriveOpen(true)}
                className="px-6 py-3.5 rounded-lg bg-[#141419] hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all duration-200"
              >
                Book Test Drive
              </button>
              <a
                href={`https://wa.me/64218884321?text=Inquiry%20on%20${vehicle.year}%20${vehicle.make}%20${vehicle.model}%20(${vehicle.stockNumber})`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 3. OVERVIEW / DESCRIPTION */}
        <section className="space-y-4 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
            Vehicle Overview
          </span>
          <div className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed whitespace-pre-line space-y-4">
            {vehicle.description}
          </div>
        </section>

        {/* 4. SPECIFICATION UI (Elegant Metadata Rows) */}
        <section className="space-y-6 pt-6 border-t border-white/[0.08]">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
            Specifications
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
            {metadataSpecs.map((spec, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3.5 border-b border-white/[0.06] text-xs font-mono"
              >
                <span className="text-zinc-500 uppercase tracking-wider">{spec.label}</span>
                <span className="text-white font-semibold">{spec.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FACTORY FEATURES CHECKLIST */}
        {vehicle.features.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/[0.08]">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Equipment & Features
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {vehicle.features.map((feat) => (
                <div
                  key={feat.id}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0c0c0f] border border-white/[0.06] text-xs text-zinc-300 font-light"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#f4d410] shrink-0" />
                  <span>{feat.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. CLEAN FINANCE CALCULATOR */}
        <section className="pt-6 border-t border-white/[0.08] space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Financing
            </span>
            <h2 className="text-2xl font-light text-white font-['Outfit'] mt-1">
              Estimated Repayments
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0c0c0f] border border-white/[0.08] rounded-2xl p-8">
            {/* Left Sliders (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400">Cash Deposit</span>
                  <span className="text-white font-bold">${deposit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={carPrice * 0.8}
                  step="1000"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full accent-[#f4d410]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400">Loan Term</span>
                  <span className="text-white font-bold">{loanTerm} Months</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="12"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
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
                  min="6"
                  max="16"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#f4d410]"
                />
              </div>
            </div>

            {/* Right Estimated Payment Card (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-[#141419] border border-white/[0.08] space-y-4 text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block">
                Estimated Payment
              </span>
              <div>
                <span className="text-4xl font-extrabold text-white font-['Outfit']">
                  ${Math.round(monthlyPayment).toLocaleString()}
                </span>
                <span className="text-xs text-zinc-400 block mt-0.5">/ month</span>
              </div>
              <div className="text-xs text-zinc-400 font-mono pt-2 border-t border-white/5">
                Loan Amount: <span className="text-white">${loanAmount.toLocaleString()}</span>
              </div>
              <Link
                href={`/finance?vehicleId=${vehicle.id}&price=${carPrice}&deposit=${deposit}&term=${loanTerm}`}
                className="w-full py-3 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider block transition-colors"
              >
                Apply for Finance
              </Link>
            </div>
          </div>
        </section>

        {/* 7. ENQUIRY SECTION */}
        <section id="enquiry-section" className="pt-6 border-t border-white/[0.08] space-y-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Concierge Inquiry
            </span>
            <h2 className="text-2xl font-light text-white font-['Outfit'] mt-1">
              Direct Showroom Inquiry
            </h2>
            <p className="text-xs text-zinc-400 font-light mt-1">
              Our client specialist will respond with the full vehicle dossier within 60 minutes.
            </p>
          </div>

          <div className="max-w-xl bg-[#0c0c0f] border border-white/[0.08] rounded-2xl p-8">
            {enquirySubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white font-['Outfit']">Enquiry Received</h4>
                <p className="text-xs text-zinc-400 font-light">
                  Thank you, {enquiryName}. Our concierge will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
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
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
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
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Inquiry about this vehicle..."
                    className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquiryLoading}
                  className="w-full py-3.5 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>{enquiryLoading ? 'Sending...' : 'Send Enquiry →'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 8. SIMILAR VEHICLES */}
        {similarCars.length > 0 && (
          <section className="pt-12 border-t border-white/[0.08] space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410]">
                Similar Models
              </span>
              <Link
                href="/cars"
                className="text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-wider"
              >
                All Inventory →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCars.map((car) => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* STICKY MOBILE CTA BAR (Prompt Requirement 24) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-extrabold text-white font-['Outfit'] block">
            ${carPrice.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-mono">Drive Away</span>
        </div>
        <a
          href="#enquiry-section"
          className="px-6 py-2.5 rounded-lg bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider"
        >
          Enquire Now
        </a>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[selectedImgIndex]?.url}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}

      {/* Test Drive Modal */}
      {testDriveOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0f] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setTestDriveOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {tdSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">Test Drive Booked</h3>
                <p className="text-xs text-zinc-400">
                  We look forward to hosting you for the {vehicle.year} {vehicle.make} {vehicle.model}.
                </p>
                <button
                  onClick={() => {
                    setTdSubmitted(false);
                    setTestDriveOpen(false);
                  }}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#f4d410] uppercase tracking-wider block">
                    Private Appointment
                  </span>
                  <h3 className="text-xl font-light text-white font-['Outfit'] mt-0.5">
                    Schedule Test Drive
                  </h3>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={tdName}
                    onChange={(e) => setTdName(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={tdPhone}
                      onChange={(e) => setTdPhone(e.target.value)}
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={tdEmail}
                      onChange={(e) => setTdEmail(e.target.value)}
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={tdDate}
                      onChange={(e) => setTdDate(e.target.value)}
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Time</label>
                    <select
                      value={tdTime}
                      onChange={(e) => setTdTime(e.target.value)}
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Confirm Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
