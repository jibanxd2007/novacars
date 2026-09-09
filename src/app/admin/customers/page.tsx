import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, Phone, Mail, MessageSquare, CalendarCheck, Repeat } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCustomersData() {
  try {
    const [enquiries, testDrives, tradeIns, financeApps] = await Promise.all([
      prisma.enquiry.findMany(),
      prisma.testDrive.findMany(),
      prisma.tradeIn.findMany(),
      prisma.financeApplication.findMany(),
    ]);

    // Aggregate by email
    const customerMap: { [email: string]: any } = {};

    const processRecord = (rec: any, type: string) => {
      const email = rec.email?.toLowerCase().trim();
      if (!email) return;

      if (!customerMap[email]) {
        customerMap[email] = {
          name: rec.customerName,
          email,
          phone: rec.phone,
          enquiries: 0,
          testDrives: 0,
          tradeIns: 0,
          financeApps: 0,
          firstSeen: rec.createdAt,
        };
      }

      if (type === 'enquiry') customerMap[email].enquiries++;
      if (type === 'testDrive') customerMap[email].testDrives++;
      if (type === 'tradeIn') customerMap[email].tradeIns++;
      if (type === 'finance') customerMap[email].financeApps++;

      if (new Date(rec.createdAt) < new Date(customerMap[email].firstSeen)) {
        customerMap[email].firstSeen = rec.createdAt;
      }
    };

    enquiries.forEach((e) => processRecord(e, 'enquiry'));
    testDrives.forEach((t) => processRecord(t, 'testDrive'));
    tradeIns.forEach((tr) => processRecord(tr, 'tradeIn'));
    financeApps.forEach((f) => processRecord(f, 'finance'));

    return Object.values(customerMap);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function AdminCustomersPage() {
  const customers = await getCustomersData();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#f4d410] block mb-1">
          RELATIONSHIP CRM
        </span>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Customer Directory
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Aggregated customer profiles across showroom inquiries, test drives, and trade appraisals.
        </p>
      </div>

      <div className="bg-[#111114] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {customers.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500">
            No customer profiles aggregated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0c0f] border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Client Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Enquiries</th>
                  <th className="p-4 text-center">Test Drives</th>
                  <th className="p-4 text-center">Trade-Ins</th>
                  <th className="p-4 text-center">Finance Apps</th>
                  <th className="p-4 pr-6 text-right">First Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c: any, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-6 font-bold text-white font-['Outfit'] text-sm">
                      {c.name}
                    </td>
                    <td className="p-4 font-mono text-zinc-300">
                      <a href={`tel:${c.phone}`} className="hover:underline">
                        {c.phone}
                      </a>
                    </td>
                    <td className="p-4 text-zinc-300">
                      <a href={`mailto:${c.email}`} className="hover:underline">
                        {c.email}
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 font-bold text-white">
                        {c.enquiries}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold">
                        {c.testDrives}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                        {c.tradeIns}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-[#f4d410]/20 text-[#f4d410] font-bold">
                        {c.financeApps}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right text-zinc-500 text-[11px]">
                      {new Date(c.firstSeen).toLocaleDateString()}
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
