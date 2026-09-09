import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Award,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  Target,
  Sparkles,
  Building,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 border-b border-white/10 bg-gradient-to-b from-[#111115] to-[#08080a]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f4d410] block">
            THE NOVA STANDARD
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-['Outfit']">
            Driven by Passion. <br />
            <span className="text-[#f4d410]">Defined by Integrity.</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Nova Cars was founded on a singular conviction: buying a luxury motor vehicle should feel as exhilarating, transparent, and refined as driving it.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex-1 space-y-24">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f4d410] block">
              OUR HERITAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              A Boutique Showroom Designed Around You
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Established in Auckland, Nova Cars operates at the intersection of prestige automotive passion and executive concierge service. We don’t run a sprawling generic used car lot; we curate a boutique portfolio of only the finest European marques, high-performance coupes, and luxury SUVs.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every vehicle admitted into our showroom has undergone comprehensive mechanical vetting, cosmetic reconditioning to factory standards, and independent title verification. We pride ourselves on complete openness with full vehicle histories provided upfront.
            </p>
            <div className="pt-2">
              <Link
                href="/cars"
                className="px-6 py-3 rounded-full bg-[#f4d410] text-black font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#fae033] transition-all"
              >
                <span>View Showroom</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
              alt="Nova Cars Showroom Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-sm font-bold text-white font-['Outfit']">
                Auckland Flagship Showroom
              </div>
              <div className="text-xs text-zinc-400">104 Great North Road, Grey Lynn</div>
            </div>
          </div>
        </div>

        {/* 150-Point Inspection Standards */}
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f4d410]">
              QUALITY PROMISE
            </span>
            <h2 className="text-3xl font-extrabold text-white font-['Outfit']">
              The 150-Point Nova Certification
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Before a car enters our collection, it must pass rigorous testing conducted by certified automotive technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/5 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#f4d410]" />
              <h4 className="text-white font-bold text-base font-['Outfit']">
                1. Powertrain & Diagnostics
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full diagnostic ECU scanning, compression testing, transmission shifting validation, and fluid analysis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/5 space-y-3">
              <Compass className="w-6 h-6 text-[#f4d410]" />
              <h4 className="text-white font-bold text-base font-['Outfit']">
                2. Chassis & Dynamics
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Electronic damper and air suspension inspection, brake disc thickness verification, and 4-wheel laser alignment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/5 space-y-3">
              <Sparkles className="w-6 h-6 text-[#f4d410]" />
              <h4 className="text-white font-bold text-base font-['Outfit']">
                3. Cosmetic & Interior Concierge
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Multi-stage paint correction, SwissVax leather conditioning, sanitization, and optical wheel detailing.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#111114] border border-white/10 space-y-3">
            <Award className="w-6 h-6 text-[#f4d410]" />
            <h4 className="text-white font-bold text-base font-['Outfit']">Prestige Selection</h4>
            <p className="text-xs text-zinc-400">
              Only low-mileage, impeccably documented European and performance sports cars.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-white/10 space-y-3">
            <Target className="w-6 h-6 text-[#f4d410]" />
            <h4 className="text-white font-bold text-base font-['Outfit']">Fixed Transparent Prices</h4>
            <p className="text-xs text-zinc-400">
              No pushy negotiation tactics or hidden delivery fees. Straightforward pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-white/10 space-y-3">
            <Users className="w-6 h-6 text-[#f4d410]" />
            <h4 className="text-white font-bold text-base font-['Outfit']">Client Concierge</h4>
            <p className="text-xs text-zinc-400">
              Personalized private showroom viewings, doorstep test drives, and nationwide enclosed transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111114] border border-white/10 space-y-3">
            <Building className="w-6 h-6 text-[#f4d410]" />
            <h4 className="text-white font-bold text-base font-['Outfit']">Certified Warranties</h4>
            <p className="text-xs text-zinc-400">
              Comprehensive 12 to 36 month nationwide mechanical warranties for complete confidence.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
