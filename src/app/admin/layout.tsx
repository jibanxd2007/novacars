'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NovaLoader from '@/components/NovaLoader';
import { AdminThemeProvider } from '@/context/AdminThemeContext';
import AdminThemeToggle from '@/components/AdminThemeToggle';
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
  ChevronRight,
} from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
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

  // Derive current section name
  const getCurrentSection = () => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.href === pathname) return item.label;
      }
    }
    if (pathname.includes('/admin/cars/')) return 'Edit Vehicle';
    return 'Dealer Management';
  };

  return (
    <div className="min-h-screen flex text-inherit transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0c0c0f] border-r border-white/[0.06] shrink-0 transition-colors duration-200">
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
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 px-3 block mb-1">
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
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          {/* Theme Toggle in Sidebar */}
          <div>
            <div className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 px-1 mb-1.5">
              Theme Appearance
            </div>
            <AdminThemeToggle />
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors pt-1"
          >
            <span>Live Showroom</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <div className="pt-2 flex items-center justify-between border-t border-white/5">
            <div className="text-[11px] text-zinc-400 truncate max-w-[130px]">
              {user?.name || 'Administrator'}
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-[#0c0c0f] border-b border-white/[0.06] transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-white font-sans font-medium">{getCurrentSection()}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-all"
            >
              <span>View Live Showroom</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Desktop Header Theme Toggle */}
            <div className="w-36">
              <AdminThemeToggle />
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#f4d410] text-black font-bold text-xs flex items-center justify-center">
                {(user?.name || 'A')[0].toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0c0c0f] border-b border-white/[0.06] transition-colors duration-200">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-1 text-zinc-400 hover:text-white"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img src="/logo-emblem.png" alt="Nova" className="h-6 w-auto object-contain" />
            <span className="font-bold text-xs uppercase tracking-widest font-['Outfit'] text-white">
              Nova CMS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AdminThemeToggle compact />
            <Link
              href="/"
              target="_blank"
              className="px-2.5 py-1 rounded border border-white/10 text-xs text-zinc-300"
            >
              Showroom ↗
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex">
            <div className="w-64 bg-[#0c0c0f] h-full flex flex-col p-4 border-r border-white/10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src="/logo-emblem.png" alt="Nova" className="h-6 w-auto" />
                  <span className="font-bold text-xs uppercase tracking-wider text-white">Nova CMS</span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                <AdminThemeToggle />
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto">
                {navGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 px-2 block mb-1">
                      {group.title}
                    </span>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            active
                              ? 'bg-white/10 text-white font-semibold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-zinc-400">{user?.name || 'Administrator'}</div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
