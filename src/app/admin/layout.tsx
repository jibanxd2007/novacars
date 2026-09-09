'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NovaLoader from '@/components/NovaLoader';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  MessageSquare,
  CalendarCheck,
  Repeat,
  DollarSign,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setUser(data.user);
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (e) {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) return <>{children}</>;

  if (!authChecked) {
    return <NovaLoader text="Verifying Dealer Credentials..." />;
  }

  const navGroups = [
    {
      title: 'Catalog',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Inventory', href: '/admin/cars', icon: Car },
        { label: 'Add Vehicle', href: '/admin/cars/new', icon: PlusCircle },
      ],
    },
    {
      title: 'Leads & Clients',
      items: [
        { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
        { label: 'Test Drives', href: '/admin/test-drives', icon: CalendarCheck },
        { label: 'Trade-Ins', href: '/admin/trade-ins', icon: Repeat },
        { label: 'Finance', href: '/admin/finance', icon: DollarSign },
        { label: 'Customers', href: '/admin/customers', icon: Users },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex">
      {/* Desktop Sidebar (Minimal Professional CMS) */}
      <aside className="hidden md:flex flex-col w-56 bg-[#0c0c0f] border-r border-white/[0.06] shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <img src="/logo-emblem.png" alt="NOVA" className="h-8 w-auto object-contain" />
            <div>
              <span className="font-extrabold text-sm tracking-[0.2em] text-white uppercase font-['Outfit'] block">
                NOVA<span className="text-[#f4d410]">CMS</span>
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                Dealer OS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-6 flex-1 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-600 px-3 block mb-1">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Live Showroom</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>

          <div className="pt-2 flex items-center justify-between border-t border-white/5">
            <div className="text-[11px] text-zinc-400 truncate max-w-[120px]">
              {user?.name || 'Administrator'}
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0c0c0f] border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img src="/logo-emblem.png" alt="Nova" className="h-5 w-auto object-contain" />
            <span className="font-bold text-xs uppercase tracking-widest font-['Outfit']">
              Nova CMS
            </span>
          </div>
          <Link href="/" target="_blank" className="text-xs text-zinc-400">
            Showroom ↗
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 sm:p-12 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
