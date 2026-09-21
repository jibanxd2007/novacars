'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NovaLoader from '@/components/NovaLoader';
import {
  Calendar,
  Gauge,
  Zap,
  Car,
  Shield,
  Palette,
  Armchair,
  Hash,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Check,
  Lock,
  Flame,
  Award,
  Compass,
  Sliders,
  DollarSign,
  ChevronDown,
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
  const [activeTab, setActiveTab] = useState<'specifications' | 'features' | 'financing'>('specifications');

  // Enquiry Modal State
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  // Test Drive Modal State
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [tdName, setTdName] = useState('');
  const [tdEmail, setTdEmail] = useState('');
  const [tdPhone, setTdPhone] = useState('');
  const [tdDate, setTdDate] = useState('');
  const [tdTime, setTdTime] = useState('10:00 AM');
  const [tdSubmitted, setTdSubmitted] = useState(false);
  const [tdLoading, setTdLoading] = useState(false);
  const [tdError, setTdError] = useState('');

  // Finance Calculator State
  const [deposit, setDeposit] = useState(1000000);
  const [loanTerm, setLoanTerm] = useState(48); // months
  const [interestRate, setInterestRate] = useState(7.95);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/cars/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setVehicle(data);
          setDeposit(Math.round(data.price * 0.2));

          // Fetch similar cars
          const simRes = await fetch(`/api/cars?limit=8`);
          if (simRes.ok) {
            const simData = await simRes.json();
            const filtered = (simData.vehicles || []).filter((v: any) => v.id !== data.id);
            setSimilarCars(filtered.length > 0 ? filtered : defaultSimilarCars);
          }
        } else {
          // Fallback if car not found
          setVehicle(null);
        }
      } catch (err) {
        console.error('Error loading vehicle:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Fallback similar cars matching the reference design
  const defaultSimilarCars = [
    {
      id: 'sim-1',
      slug: 'lamborghini-huracan-evo',
      make: 'Lamborghini',
      model: 'Huracán EVO',
      year: 2025,
      price: 5200000,
      transmission: 'Auto',
      drivetrain: 'AWD',
      images: [{ url: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=800&q=85' }],
    },
    {
      id: 'sim-2',
      slug: 'lamborghini-huracan-sto',
      make: 'Lamborghini',
      model: 'Huracán STO',
      year: 2025,
      price: 5800000,
      transmission: 'Auto',
      drivetrain: 'RWD',
      images: [{ url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=85' }],
    },
    {
      id: 'sim-3',
      slug: 'lamborghini-aventador',
      make: 'Lamborghini',
      model: 'Aventador',
      year: 2024,
      price: 7400000,
      transmission: 'Auto',
      drivetrain: 'AWD',
      images: [{ url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=85' }],
    },
    {
      id: 'sim-4',
      slug: 'lamborghini-urus',
      make: 'Lamborghini',
      model: 'Urus',
      year: 2024,
      price: 6800000,
      transmission: 'Auto',
      drivetrain: 'AWD',
      images: [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=85' }],
    },
  ];

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
            <p className="text-xs text-zinc-400">This vehicle is no longer in active showroom inventory.</p>
            <Link
              href="/cars"
              className="inline-block px-6 py-3 rounded-lg bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c70e] transition-colors"
            >
              Browse Inventory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Ensure high quality gallery images
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    { id: '1', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=90', isPrimary: true, alt: vehicle.model },
    { id: '2', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=90', isPrimary: false, alt: 'Rear Profile' },
    { id: '3', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90', isPrimary: false, alt: 'Front Fascia' },
    { id: '4', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=90', isPrimary: false, alt: 'Cockpit' },
    { id: '5', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=90', isPrimary: false, alt: 'Console' },
    { id: '6', url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=90', isPrimary: false, alt: 'Alloy Wheel' },
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
    setEnquiryError('');
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
          message: enquiryMessage || `Inquiry regarding ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant || ''} (Stock: ${vehicle.stockNumber})`,
          preferredContact: 'phone',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnquiryError(data.error || 'Failed to submit enquiry. Please try again.');
      } else {
        setEnquirySubmitted(true);
      }
    } catch (e) {
      setEnquiryError('Connection error occurred. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTdError('');
    setTdLoading(true);
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
          message: `Private viewing requested for ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTdError(data.error || 'Failed to schedule test drive. Please try again.');
      } else {
        setTdSubmitted(true);
      }
    } catch (e) {
      setTdError('Connection error occurred. Please try again.');
    } finally {
      setTdLoading(false);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displaySimilar = similarCars.length > 0 ? similarCars : defaultSimilarCars;

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
        {/* 1. BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-zinc-300 transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href="/cars" className="hover:text-zinc-300 transition-colors">
            Cars
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 font-normal truncate">
            {vehicle.make} {vehicle.model} {vehicle.variant || ''}
          </span>
        </nav>

        {/* 2. CORE TWO-COLUMN PRODUCT SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: VEHICLE GALLERY (~58-60% width) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Hero */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0d0d11] border border-white/[0.08] shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImgIndex]?.url}
                alt={images[selectedImgIndex]?.alt || `${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Top Left Badge: NEW ARRIVAL */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#f4d410] text-[#f4d410] bg-black/70 backdrop-blur-md">
                  New Arrival
                </span>
              </div>

              {/* Top Right Counter: • 1 / 6 */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-zinc-300 bg-black/70 backdrop-blur-md border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                  {selectedImgIndex + 1} / {images.length}
                </span>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                    }
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#f4d410] hover:text-black text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-80 hover:opacity-100 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#f4d410] hover:text-black text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-80 hover:opacity-100 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Fullscreen Icon in bottom right */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-colors"
                title="Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden transition-all duration-200 bg-[#0d0d11] ${
                      selectedImgIndex === idx
                        ? 'border-2 border-[#f4d410] shadow-[0_0_12px_rgba(244,212,16,0.35)] opacity-100 scale-[1.02]'
                        : 'border border-white/10 opacity-60 hover:opacity-90 hover:border-white/30'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT DETAILS & ACTIONS (~40-42% width) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Stock & Year Tag */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase">
              <span>{vehicle.year}</span>
              <span>·</span>
              <span>STOCK {vehicle.stockNumber}</span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit'] leading-tight">
                {vehicle.make} {vehicle.model}
                <span className="block mt-1 flex items-center gap-2 text-white font-extrabold">
                  <span className="w-1.5 h-6 bg-[#f4d410] inline-block rounded-full"></span>
                  {vehicle.variant || 'EVO RWD'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-normal">
                Pure performance. Unmatched elegance.
              </p>
            </div>

            {/* Price Prominent Display */}
            <div className="pt-1 border-t border-white/[0.06]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#f4d410] tracking-tight font-['Outfit']">
                ${carPrice.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                (Ex-showroom + taxes & fees)
              </p>
            </div>

            {/* Quick Product Specs 2-Column Compact Grid */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 py-4 px-4 rounded-xl bg-[#0f0f14]/80 border border-white/[0.06]">
              {/* Year */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Year</div>
                  <div className="text-xs font-bold text-white">{vehicle.year}</div>
                </div>
              </div>

              {/* Body Style */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Body Style</div>
                  <div className="text-xs font-bold text-white">{vehicle.bodyType || 'Coupe'}</div>
                </div>
              </div>

              {/* Transmission */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Gauge className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Transmission</div>
                  <div className="text-xs font-bold text-white">{vehicle.transmission}</div>
                </div>
              </div>

              {/* Exterior Color */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Palette className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Exterior Color</div>
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{vehicle.exteriorColor || 'Nero Noctis'}</div>
                </div>
              </div>

              {/* Engine */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Engine</div>
                  <div className="text-xs font-bold text-white">{vehicle.engine || 'V10 5.2L'}</div>
                </div>
              </div>

              {/* Interior */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Armchair className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Interior</div>
                  <div className="text-xs font-bold text-white">{vehicle.interiorColor || 'Leather'}</div>
                </div>
              </div>

              {/* Power Output */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Power Output</div>
                  <div className="text-xs font-bold text-white">{vehicle.power || '640 HP'}</div>
                </div>
              </div>

              {/* Stock Number */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                  <Hash className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Stock Number</div>
                  <div className="text-xs font-bold text-white font-mono">{vehicle.stockNumber}</div>
                </div>
              </div>
            </div>

            {/* Primary Conversion CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setTestDriveOpen(true)}
                className="w-full py-3.5 px-6 rounded-lg bg-[#f4d410] hover:bg-[#e5c70e] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_20px_rgba(244,212,16,0.25)] flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Book Test Drive</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => setEnquiryOpen(true)}
                className="w-full py-3.5 px-6 rounded-lg bg-[#121217] hover:bg-[#1a1a22] text-white border border-white/20 hover:border-white/40 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Inquire Now</span>
              </button>
            </div>

            {/* Trust and Value Proposition Points */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Free delivery available</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Finance options</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Trade-in accepted</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. VEHICLE OVERVIEW */}
        <section className="pt-8 border-t border-white/[0.08] space-y-8">
          <div>
            <span className="text-[11px] font-bold text-[#f4d410] uppercase tracking-widest block mb-2">
              — OVERVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left side: Editorial headline & 3 performance badges */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-['Outfit'] leading-tight">
                A masterpiece of<br />engineering and emotion.
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed">
                The {vehicle.make} {vehicle.model} {vehicle.variant || ''} combines breathtaking performance with everyday usability. With its naturally aspirated V10, precision handling and unmistakable design, it's built for those who want more than just a drive — they want an experience.
              </p>

              {/* Three Performance Metrics with Yellow Line Icons */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[#f4d410]/40 bg-[#f4d410]/5 flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-[#f4d410]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white font-['Outfit']">640 HP</div>
                    <div className="text-[11px] text-zinc-400">V10 Engine</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[#f4d410]/40 bg-[#f4d410]/5 flex items-center justify-center shrink-0">
                    <Gauge className="w-5 h-5 text-[#f4d410]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white font-['Outfit']">0–100 km/h</div>
                    <div className="text-[11px] text-zinc-400">3.3 seconds</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[#f4d410]/40 bg-[#f4d410]/5 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-[#f4d410]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white font-['Outfit']">Top Speed</div>
                    <div className="text-[11px] text-zinc-400">325 km/h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: 4 Key Value Points */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#0f0f14]/60 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#f4d410]/10 border border-[#f4d410]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Breathtaking Performance</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Naturally aspirated V10 with 640 HP.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14]/60 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#f4d410]/10 border border-[#f4d410]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Iconic Design</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Aggressive lines, sculpted for aerodynamics.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14]/60 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#f4d410]/10 border border-[#f4d410]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Advanced Dynamic Chassis</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Optimized for maximum control and agility.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14]/60 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#f4d410]/10 border border-[#f4d410]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Armchair className="w-4 h-4 text-[#f4d410]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Premium Interior</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Luxury meets functionality.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SPECIFICATIONS & FEATURES TABS SECTION (with Performance Card) */}
        <section className="pt-8 border-t border-white/[0.08] space-y-6">
          {/* Section Tabs */}
          <div className="flex items-center gap-8 border-b border-white/[0.08] text-sm">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`pb-3 font-bold transition-all uppercase tracking-wider text-xs relative ${
                activeTab === 'specifications'
                  ? 'text-[#f4d410]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Specifications
              {activeTab === 'specifications' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f4d410]"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 font-bold transition-all uppercase tracking-wider text-xs relative ${
                activeTab === 'features'
                  ? 'text-[#f4d410]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Equipment & Features
              {activeTab === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f4d410]"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('financing')}
              className={`pb-3 font-bold transition-all uppercase tracking-wider text-xs relative ${
                activeTab === 'financing'
                  ? 'text-[#f4d410]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Financing
              {activeTab === 'financing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f4d410]"></span>
              )}
            </button>
          </div>

          {/* Grid: Left Tab Content + Right Performance Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Area (Col 7) */}
            <div className="lg:col-span-7">
              {/* TAB 1: SPECIFICATIONS TABLE */}
              {activeTab === 'specifications' && (
                <div className="divide-y divide-white/[0.06] text-xs">
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Year</span>
                    <span className="text-white font-medium">{vehicle.year}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Transmission</span>
                    <span className="text-white font-medium">{vehicle.transmission}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Engine</span>
                    <span className="text-white font-medium">{vehicle.engine || 'V10 5.2L'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Power Output</span>
                    <span className="text-white font-medium">{vehicle.power || '640 HP'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Body Style</span>
                    <span className="text-white font-medium">{vehicle.bodyType || 'Coupe'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Exterior Color</span>
                    <span className="text-white font-medium">{vehicle.exteriorColor || 'Nero Noctis (Black)'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Interior</span>
                    <span className="text-white font-medium">{vehicle.interiorColor || 'Leather'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Stock Number</span>
                    <span className="text-white font-mono">{vehicle.stockNumber}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Drivetrain</span>
                    <span className="text-white font-medium">{vehicle.drivetrain || 'Rear-Wheel Drive (RWD)'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Fuel Type</span>
                    <span className="text-white font-medium">{vehicle.fuelType || 'Petrol'}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: EQUIPMENT & FEATURES */}
              {activeTab === 'features' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    'Naturally aspirated V10',
                    'Iconic Lamborghini design',
                    'Advanced AWD/RWD dynamic agility',
                    'Premium leather interior',
                    'Track-tested performance',
                    'Luxury meets functionality',
                    'Lamborghini Dynamic Steering (LDS)',
                    'P-TCS Performance Traction Control System',
                    'Carbon Ceramic Brakes with Giallo Calipers',
                    '8.4-inch HMI Capacitive Multi-touch Screen',
                    'Full LED lighting system with Y-shaped DRL',
                    'Titanium intake valves and tuned exhaust',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0e0e13] border border-white/[0.04]">
                      <Check className="w-4 h-4 text-[#f4d410] shrink-0" />
                      <span className="text-xs text-zinc-200">{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: FINANCING CALCULATOR */}
              {activeTab === 'financing' && (
                <div className="p-5 rounded-2xl bg-[#0e0e13] border border-white/[0.08] space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Cash Deposit Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400">Cash Deposit</span>
                        <span className="font-bold text-white">${deposit.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="100000"
                        max={carPrice * 0.7}
                        step="50000"
                        value={deposit}
                        onChange={(e) => setDeposit(Number(e.target.value))}
                        className="w-full accent-[#f4d410]"
                      />
                    </div>

                    {/* Loan Term Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400">Loan Term</span>
                        <span className="font-bold text-white">{loanTerm} months</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        step="12"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full accent-[#f4d410]"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400">Interest Rate</span>
                        <span className="font-bold text-white">{interestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="4.5"
                        max="14.5"
                        step="0.25"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-[#f4d410]"
                      />
                    </div>
                  </div>

                  {/* Calculated Output & Apply CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/[0.06] gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Estimated Payment</div>
                      <div className="text-2xl font-black text-[#f4d410] font-['Outfit']">
                        ${Math.round(monthlyPayment).toLocaleString()}
                        <span className="text-xs font-normal text-zinc-400 ml-1">/ month</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEnquiryOpen(true)}
                      className="px-6 py-2.5 rounded-lg bg-[#f4d410] hover:bg-[#e5c70e] text-black font-extrabold text-xs uppercase tracking-wider transition-all"
                    >
                      Apply For Finance →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Visual Performance Card (Col 5) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl group bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85"
                  alt="Lamborghini V10 High Performance Wheel and Brakes"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-[11px] font-bold text-[#f4d410] uppercase tracking-widest block mb-1">
                    — PERFORMANCE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
                    V10. 640 HP.
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Pure power. Unfiltered.
                  </p>

                  {/* Lamborghini Shield Motif */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-8 h-9 rounded-sm border border-[#f4d410]/60 bg-black/60 flex items-center justify-center p-1 shadow-md">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#f4d410]" fill="currentColor">
                        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 2.18l7 2.33v4.6c0 4.54-3.14 8.78-7 9.87-3.86-1.09-7-5.33-7-9.87V6.51l7-2.33z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SIMILAR VEHICLES CAROUSEL */}
        <section className="pt-8 border-t border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#f4d410] uppercase tracking-widest block">
              — SIMILAR VEHICLES
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#f4d410] hover:text-[#f4d410] text-zinc-400 flex items-center justify-center transition-colors"
                aria-label="Previous cars"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#f4d410] hover:text-[#f4d410] text-zinc-400 flex items-center justify-center transition-colors"
                aria-label="Next cars"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex items-stretch gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
          >
            {displaySimilar.map((car: any) => (
              <div
                key={car.id || car.slug}
                className="w-[280px] sm:w-[300px] shrink-0 rounded-xl bg-[#0d0d12] border border-white/[0.06] hover:border-white/20 transition-all group overflow-hidden flex flex-col justify-between"
              >
                <Link href={`/cars/${car.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=85'}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#f4d410] transition-colors truncate">
                      {car.make} {car.model}
                    </h4>
                    <div className="text-base font-extrabold text-white font-['Outfit']">
                      ${car.price.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono pt-1">
                      {car.year} • {car.transmission || 'Auto'} • {car.drivetrain || 'AWD'}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FINAL CONVERSION CTA BANNER */}
        <section className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
          {/* Subtle cinematic mountain/supercar background */}
          <div className="absolute inset-0 bg-[#09090d]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80"
              alt="Test Drive Background"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-[10px] font-bold text-[#f4d410] uppercase tracking-widest block">
                — READY TO DRIVE?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
                Book your test drive today.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Experience the thrill. Feel the power. Take the wheel.
              </p>
            </div>

            <div>
              <button
                onClick={() => setTestDriveOpen(true)}
                className="py-3 px-7 rounded-lg bg-[#f4d410] hover:bg-[#e5c70e] text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center gap-2 whitespace-nowrap"
              >
                <span>Book Test Drive</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* STICKY MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-md border-t border-white/10 p-3.5 flex items-center justify-between px-5">
        <div>
          <span className="text-base font-extrabold text-[#f4d410] font-['Outfit'] block leading-none">
            ${carPrice.toLocaleString()}
          </span>
          <span className="text-[9px] text-zinc-400 uppercase font-mono">Ex-showroom + taxes</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnquiryOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 text-white font-bold text-xs uppercase"
          >
            Inquire
          </button>
          <button
            onClick={() => setTestDriveOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#f4d410] text-black font-extrabold text-xs uppercase tracking-wider"
          >
            Test Drive
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
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

      {/* BOOK TEST DRIVE MODAL */}
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
                  We look forward to hosting you for the {vehicle.year} {vehicle.make} {vehicle.model}. Request dispatched to <strong className="text-white">SALES@NOVAAUTO.CO.NZ</strong>.
                </p>
                <button
                  onClick={() => {
                    setTdSubmitted(false);
                    setTestDriveOpen(false);
                  }}
                  className="px-6 py-2 rounded-lg bg-[#f4d410] text-black font-bold text-xs uppercase"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#f4d410] uppercase tracking-wider block">
                    Private Appointment
                  </span>
                  <h3 className="text-xl font-bold text-white font-['Outfit'] mt-0.5">
                    Schedule Test Drive
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Booking for {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.variant || ''}.
                  </p>
                </div>

                {tdError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{tdError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={tdName}
                    onChange={(e) => setTdName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
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
                      placeholder="+64 21 000 0000"
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={tdEmail}
                      onChange={(e) => setTdEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={tdDate}
                      onChange={(e) => setTdDate(e.target.value)}
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Preferred Time</label>
                    <select
                      value={tdTime}
                      onChange={(e) => setTdTime(e.target.value)}
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={tdLoading}
                  className="w-full py-3 rounded-lg bg-[#f4d410] hover:bg-[#e5c70e] text-black font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {tdLoading ? 'Scheduling...' : 'Confirm Appointment →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* INQUIRE NOW MODAL */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0f] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setEnquiryOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {enquirySubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">Enquiry Received</h3>
                <p className="text-xs text-zinc-400">
                  Thank you for your interest in the {vehicle.year} {vehicle.make} {vehicle.model}. A senior specialist will reach out shortly. Request sent to <strong className="text-white">SALES@NOVAAUTO.CO.NZ</strong>.
                </p>
                <button
                  onClick={() => {
                    setEnquirySubmitted(false);
                    setEnquiryOpen(false);
                  }}
                  className="px-6 py-2 rounded-lg bg-[#f4d410] text-black font-bold text-xs uppercase"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#f4d410] uppercase tracking-wider block">
                    Direct VIP Concierge
                  </span>
                  <h3 className="text-xl font-bold text-white font-['Outfit'] mt-0.5">
                    Vehicle Inquiry
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Concerning {vehicle.year} {vehicle.make} {vehicle.model} (Stock {vehicle.stockNumber}).
                  </p>
                </div>

                {enquiryError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{enquiryError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      placeholder="+64 21 000 0000"
                      className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="I am interested in viewing this vehicle or discussing trade-in options..."
                    className="w-full bg-[#141419] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquiryLoading}
                  className="w-full py-3 rounded-lg bg-[#f4d410] hover:bg-[#e5c70e] text-black font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {enquiryLoading ? 'Submitting...' : 'Submit Inquiry →'}
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
