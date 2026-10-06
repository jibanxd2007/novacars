'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Send,
  Navigation,
  ExternalLink,
} from 'lucide-react';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps?sca_esv=99fa615e217dff4e&rlz=1C1GCEA_enNZ1144NZ1145&output=search&q=298+great+south+road+manurewa&source=lnms&fbs=ABfTbFVyMZGZf1hfvX9uKjN_-G8cTs4PJElQ4Z4ROUfAdKhH1pgN3jaVPpJtZ8IN28B_o1lYqtnDALglqDPRhVL6HplIgTemOWjx2ojgLHIc4xg2qpTj8SlxDMUFw13IP8E1ULiEBuyZMl77DANXvv0NhZ9PWApk9obY8QMT6KWXfW151Jm32YAGV4ysQ0jIeaDEuJkslkiVZ_4PZl44HWRh62tiBJNsKQ&entry=mc&ved=1t:200715&ictx=111';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Showroom Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          email,
          phone,
          message: `[${subject}] ${message}`,
          preferredContact: 'phone',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send message. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col selection:bg-[#f4d410] selection:text-black">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-12 border-b border-white/10 bg-gradient-to-b from-[#111115] to-[#08080a]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f4d410] block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Visit Our Auckland Showroom
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Whether you are searching for a specific vehicle or scheduling a private viewing, our concierge is at your service.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Opening Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Direct Contact Details
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0c0c0f] border border-white/5">
                  <Phone className="w-5 h-5 text-[#f4d410] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-bold block">
                      Phone Concierge
                    </span>
                    <a href="tel:+6498884321" className="text-white font-semibold hover:text-[#f4d410]">
                      +64 9 888 4321
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0c0c0f] border border-white/5">
                  <Mail className="w-5 h-5 text-[#f4d410] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-bold block">
                      Email Inquiries
                    </span>
                    <a href="mailto:sales@novaauto.co.nz" className="text-white font-semibold hover:text-[#f4d410] text-sm break-all">
                      SALES@NOVAAUTO.CO.NZ
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0c0c0f] border border-white/5">
                  <MapPin className="w-5 h-5 text-[#f4d410] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-bold block">
                      Showroom Address
                    </span>
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white font-semibold hover:text-[#f4d410] transition-colors"
                    >
                      298B Great South Road, Manurewa, Auckland
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0c0c0f] border border-white/5">
                  <Clock className="w-5 h-5 text-[#f4d410] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-bold block">
                      Operating Hours
                    </span>
                    <span className="text-zinc-300 text-xs block">
                      Mon – Fri: 8:30 AM – 6:00 PM
                    </span>
                    <span className="text-zinc-300 text-xs block">
                      Saturday: 9:00 AM – 5:00 PM
                    </span>
                    <span className="text-zinc-300 text-xs block">
                      Sunday: Private Appointment Only
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct CTA */}
              <a
                href="https://wa.me/64218884321?text=Hi%20Nova%20Cars,%20I%20would%20like%20to%20inquire%20about%20your%20vehicles"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>

            {/* Interactive Location Card */}
            <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-white font-bold text-sm">Manurewa Showroom Location</h4>
                  <p className="text-[11px] text-zinc-400">298B Great South Road, Manurewa, Auckland</p>
                </div>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#f4d410] hover:text-[#fde047] flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded-lg bg-[#f4d410]/10 border border-[#f4d410]/20 hover:border-[#f4d410]/40 transition-all shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Live Interactive Google Map */}
              <div className="w-full h-80 rounded-2xl overflow-hidden bg-zinc-900 relative border border-white/10 shadow-lg">
                <iframe
                  title="Nova Cars - 298 Great South Road, Manurewa, Auckland"
                  src="https://maps.google.com/maps?q=298+great+south+road+manurewa&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f4d410] shrink-0" />
                  Complimentary customer parking on-site
                </span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-white hover:text-[#f4d410] font-medium transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#f4d410] block mb-1">
                ONLINE ENQUIRY
              </span>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                Send a Message to Our Concierge
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                All digital inquiries are routed directly to <strong className="text-white font-mono">SALES@NOVAAUTO.CO.NZ</strong> and our dealer management desk. We respond within 60 minutes.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h4 className="text-2xl font-bold text-white font-['Outfit']">
                  Message Transmitted!
                </h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Thank you, {name}. Your inquiry details have been forwarded to <strong className="text-[#f4d410]">SALES@NOVAAUTO.CO.NZ</strong> and logged in our management portal. We will be in touch shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#f4d410] text-black font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rachel Adams"
                      className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rachel@domain.com"
                      className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+64 21 000 0000"
                      className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                      Topic / Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                    >
                      <option value="General Showroom Inquiry">General Showroom Inquiry</option>
                      <option value="Vehicle Sourcing Request">Vehicle Sourcing Request</option>
                      <option value="Trade-in / Selling Vehicle">Trade-in / Selling Vehicle</option>
                      <option value="Finance & Leasing Options">Finance & Leasing Options</option>
                      <option value="After-Sales & Warranty">After-Sales & Warranty</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can assist you..."
                    className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#f4d410]/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
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
