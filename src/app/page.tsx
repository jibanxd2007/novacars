import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import HeroSearch from '@/components/HeroSearch';
import { prisma } from '@/lib/prisma';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getHomePageData() {
  try {
    const featuredVehicles = await prisma.vehicle.findMany({
      where: { status: 'published' },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
      },
    });

    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc: any, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return { featuredVehicles, settings: settingsMap };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { featuredVehicles: [], settings: {} };
  }
}

export default async function HomePage() {
  const { featuredVehicles } = await getHomePageData();

  const marques = [
    'BMW',
    'Mercedes-Benz',
    'Porsche',
    'Audi',
    'Range Rover',
    'Jaguar',
    'Tesla',
  ];

  const autoDealerSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'NOVA CARS',
    image: 'https://novacars.co.nz/logo.png',
    url: 'https://novacars.co.nz',
    telephone: '+64 9 888 4321',
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '104 Great North Road',
      addressLocality: 'Grey Lynn',
      addressRegion: 'Auckland',
      postalCode: '1021',
      addressCountry: 'NZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -36.8587,
      longitude: 174.7431,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
      />
      <Navbar />

      {/* =========================================================================
          1. CINEMATIC HERO (Full Bleed, Editorial Typography)
      ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-36 pb-16 overflow-hidden">
        {/* Full-width Vehicle Image with Subtle Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2400&q=90"
            alt="Nova Cars Flagship Vehicle"
            className="w-full h-full object-cover object-center brightness-[0.70]"
          />
          {/* Subtle vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Hero Narrative Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-2xl space-y-6 pt-10">
            {/* Small Eyebrow */}
            <span className="text-xs font-semibold text-[#f4d410] uppercase tracking-[0.25em] block">
              Auckland Showroom
            </span>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white font-['Outfit'] leading-[1.02]">
              Drive <br />
              <span className="font-extrabold text-white">Something</span> <br />
              <span className="font-serif italic font-normal text-[#f4d410]">Exceptional.</span>
            </h1>

            {/* Short Supporting Copy */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-md leading-relaxed font-light">
              A curated collection of verified European luxury and performance motor vehicles.
            </p>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/cars"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 group shadow-lg"
              >
                <span>Explore Inventory</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Minimal Search Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full mt-16">
          <HeroSearch />
        </div>
      </section>

      {/* =========================================================================
          2. MINIMAL MARQUE TICKER
      ========================================================================= */}
      <section className="border-y border-white/[0.06] bg-[#09090c] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap items-center justify-between gap-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            Curated Marques
          </span>

          <div className="flex flex-wrap items-center gap-8 sm:gap-12 text-xs font-medium text-zinc-400">
            {marques.map((marque) => (
              <Link
                key={marque}
                href={`/cars?make=${encodeURIComponent(marque)}`}
                className="hover:text-white transition-colors uppercase tracking-widest text-[11px]"
              >
                {marque}
              </Link>
            ))}
          </div>

          <Link
            href="/cars"
            className="text-xs font-semibold text-[#f4d410] hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            <span>All Vehicles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED INVENTORY (Large Photography Cards)
      ========================================================================= */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Featured Inventory
            </span>
            <h2 className="text-3xl sm:text-5xl font-light text-white font-['Outfit'] tracking-tight">
              The Current <span className="font-extrabold">Collection.</span>
            </h2>
          </div>

          <Link
            href="/cars"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-2 group transition-colors"
          >
            <span>View All ({featuredVehicles.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Spacious Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles.map((car) => (
            <VehicleCard key={car.id} vehicle={car} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. EDITORIAL SHOWCASE (Full-Bleed Editorial Layout)
      ========================================================================= */}
      <section className="py-24 border-t border-white/[0.06] bg-[#0a0a0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Editorial Narrative */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
                Editorial Showcase
              </span>
              <h2 className="text-4xl sm:text-5xl font-light text-white font-['Outfit'] tracking-tight leading-[1.1]">
                Curated for <br />
                <span className="font-extrabold text-white">The Drive.</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                We believe true luxury is found in the confluence of engineering precision and immaculate provenance. Every model in our private collection has been hand-selected for the discerning motorist.
              </p>
              <div className="pt-2">
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#f4d410] transition-colors border-b border-white/20 pb-1"
                >
                  <span>Explore The Fleet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Large Immersive Car Photography */}
            <div className="lg:col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.08] shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
                alt="Porsche Editorial"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 flex items-baseline justify-between text-white">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest block">
                    Stuttgart Pedigree
                  </span>
                  <span className="text-xl font-bold font-['Outfit']">Porsche Cayenne GTS</span>
                </div>
                <span className="text-sm font-light text-zinc-400 font-mono">$128,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MINIMAL TRUST SECTION (Pure Typographic Pillars)
      ========================================================================= */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="space-y-4 mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
            The Nova Standard
          </span>
          <h2 className="text-3xl sm:text-5xl font-light text-white font-['Outfit'] tracking-tight">
            Why Nova <span className="font-extrabold">Cars.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/[0.08] pt-12">
          {/* 01 Quality */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-zinc-500 font-bold block">01</span>
            <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
              Quality
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Every vehicle undergoes a thorough 150-point mechanical certification, genuine servicing verification, and SwissVax cosmetic detailing before presentation.
            </p>
          </div>

          {/* 02 Transparency */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-zinc-500 font-bold block">02</span>
            <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
              Transparency
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Zero hidden documentation fees or dealer preparation markups. Full PPSR title certification and complete provenance reports provided upfront.
            </p>
          </div>

          {/* 03 Confidence */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-zinc-500 font-bold block">03</span>
            <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
              Confidence
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Backed by comprehensive nationwide warranties, tailored low-rate finance pre-approvals, and fair trade-in appraisals on any motor vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CLIENT VOICES (Minimal Editorial Quotes)
      ========================================================================= */}
      <section className="py-24 border-t border-white/[0.06] bg-[#09090c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl space-y-8">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4d410] block">
              Client Experiences
            </span>
            <blockquote className="text-2xl sm:text-4xl font-light text-zinc-200 font-['Outfit'] leading-snug">
              &ldquo;The team at Nova Cars delivered an experience closer to a private art gallery than a dealership. Complete clarity from initial consultation through handover.&rdquo;
            </blockquote>
            <div className="text-xs text-zinc-400">
              <span className="text-white font-semibold block">Marcus Sterling</span>
              <span>Auckland · BMW X5 Owner</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CALL TO ACTION (Restrained & Impactful)
      ========================================================================= */}
      <section className="py-28 max-w-7xl mx-auto px-6 lg:px-10 w-full text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-6xl font-light text-white font-['Outfit'] tracking-tight">
            Find Your Next <br />
            <span className="font-extrabold text-white">Drive Today.</span>
          </h2>
          <p className="text-sm text-zinc-400 font-light">
            Visit our private showroom in Grey Lynn or arrange nationwide enclosed transit.
          </p>
          <div className="pt-2">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md"
            >
              <span>Browse All Vehicles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
