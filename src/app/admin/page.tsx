import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowUpRight, Plus, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    const [
      totalVehicles,
      publishedVehicles,
      testDrivesCount,
      tradeInsCount,
      financeCount,
      enquiriesCount,
      recentEnquiries,
      recentVehicles,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'published' } }),
      prisma.testDrive.count(),
      prisma.tradeIn.count(),
      prisma.financeApplication.count(),
      prisma.enquiry.count(),
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          vehicle: { select: { make: true, model: true, stockNumber: true, year: true } },
        },
      }),
      prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
    ]);

    const leadsCount = testDrivesCount + tradeInsCount + financeCount;

    return {
      totalVehicles,
      publishedVehicles,
      leadsCount,
      enquiriesCount,
      recentEnquiries,
      recentVehicles,
    };
  } catch (err) {
    console.error('Error fetching admin dashboard stats:', err);
    return {
      totalVehicles: 0,
      publishedVehicles: 0,
      leadsCount: 0,
      enquiriesCount: 0,
      recentEnquiries: [],
      recentVehicles: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-12 max-w-6xl">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div className="space-y-1">
          <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block">
            Good Morning
          </span>
          <h1 className="text-3xl font-light text-white font-['Outfit']">
            Here&apos;s what&apos;s happening with Nova Cars.
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars/new"
            className="px-4 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#f4d410] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* 4 Compact Metric Cards (Matching Prompt Diagram) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Vehicles */}
        <Link
          href="/admin/cars"
          className="p-5 rounded-xl bg-[#0c0c0f] border border-white/[0.08] hover:border-white/20 transition-all space-y-2 block"
        >
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="uppercase font-mono tracking-wider">Vehicles</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
          </div>
          <div className="text-3xl font-light text-white font-['Outfit']">
            {data.totalVehicles}
          </div>
        </Link>

        {/* Published */}
        <Link
          href="/admin/cars?status=published"
          className="p-5 rounded-xl bg-[#0c0c0f] border border-white/[0.08] hover:border-white/20 transition-all space-y-2 block"
        >
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="uppercase font-mono tracking-wider">Published</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
          </div>
          <div className="text-3xl font-light text-emerald-400 font-['Outfit']">
            {data.publishedVehicles}
          </div>
        </Link>

        {/* Leads */}
        <Link
          href="/admin/test-drives"
          className="p-5 rounded-xl bg-[#0c0c0f] border border-white/[0.08] hover:border-white/20 transition-all space-y-2 block"
        >
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="uppercase font-mono tracking-wider">Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
          </div>
          <div className="text-3xl font-light text-white font-['Outfit']">
            {data.leadsCount}
          </div>
        </Link>

        {/* Enquiries */}
        <Link
          href="/admin/enquiries"
          className="p-5 rounded-xl bg-[#0c0c0f] border border-white/[0.08] hover:border-white/20 transition-all space-y-2 block"
        >
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="uppercase font-mono tracking-wider">Enquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
          </div>
          <div className="text-3xl font-light text-[#f4d410] font-['Outfit']">
            {data.enquiriesCount}
          </div>
        </Link>
      </div>

      {/* Tables Row: Recent Enquiries & Active Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Recent Enquiries
            </span>
            <Link
              href="/admin/enquiries"
              className="text-[11px] font-mono text-zinc-400 hover:text-white"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentEnquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                No active enquiries
              </div>
            ) : (
              data.recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-lg bg-[#141419] border border-white/[0.04] flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{enq.customerName}</div>
                    <div className="text-[11px] text-zinc-400">
                      {enq.vehicle ? `${enq.vehicle.year} ${enq.vehicle.make} ${enq.vehicle.model}` : 'General Inquiry'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                      {enq.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Added Fleet (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Recent Inventory
            </span>
            <Link
              href="/admin/cars"
              className="text-[11px] font-mono text-zinc-400 hover:text-white"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentVehicles.map((car) => {
              const img =
                car.images[0]?.url ||
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80';
              return (
                <div
                  key={car.id}
                  className="p-2.5 rounded-lg bg-[#141419] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded overflow-hidden bg-zinc-950 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white line-clamp-1">
                        {car.make} {car.model}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        ${car.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/cars/${car.id}/edit`}
                    className="text-[11px] text-zinc-400 hover:text-white font-mono"
                  >
                    Edit
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
