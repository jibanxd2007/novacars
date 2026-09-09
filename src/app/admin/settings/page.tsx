'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Globe, Phone, Share2, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    business_name: 'NOVA CARS',
    hero_title: 'Drive Your Next Chapter',
    hero_subtitle: 'Premium cars. Verified quality. Unmatched service. Your dream ride is just a click away.',
    phone: '+64 9 888 4321',
    email: 'concierge@novacars.co.nz',
    whatsapp: '+64218884321',
    address: '104 Great North Road, Grey Lynn, Auckland 1021',
    opening_hours: 'Mon - Fri: 8:30 AM – 6:00 PM | Sat: 9:00 AM – 5:00 PM | Sun: By Appointment',
    instagram: 'https://instagram.com/novacars',
    facebook: 'https://facebook.com/novacars',
    youtube: 'https://youtube.com/@novacars',
    tiktok: 'https://tiktok.com/@novacars',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings((prev: any) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-zinc-500">Loading website settings...</div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#f4d410] block mb-1">
            CONFIGURATION
          </span>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Website & Dealership Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Update your public showroom contact details, homepage headlines, and social channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website settings updated successfully! Live website reflects changes immediately.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Homepage Hero Settings */}
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-['Outfit'] border-b border-white/5 pb-3">
            <Sparkles className="w-4 h-4 text-[#f4d410]" />
            <span>Homepage Hero Content</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Hero Title</label>
              <input
                type="text"
                value={settings.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={settings.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Business Contact Info */}
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-['Outfit'] border-b border-white/5 pb-3">
            <Phone className="w-4 h-4 text-[#f4d410]" />
            <span>Showroom Contact Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Dealership Name</label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Showroom Opening Hours</label>
              <input
                type="text"
                value={settings.opening_hours || ''}
                onChange={(e) => handleChange('opening_hours', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Channels */}
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-['Outfit'] border-b border-white/5 pb-3">
            <Share2 className="w-4 h-4 text-[#f4d410]" />
            <span>Social Media Presence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">YouTube URL</label>
              <input
                type="url"
                value={settings.youtube || ''}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">TikTok URL</label>
              <input
                type="url"
                value={settings.tiktok || ''}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#f4d410]/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
