'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Calculator,
  ShieldCheck,
  Zap,
  Sparkles,
  Sliders,
  DollarSign,
  Car,
  Calendar,
  Clock,
  User,
  Home,
  Briefcase,
  Wallet,
  FileText,
  Star,
  ChevronRight,
  Check,
  Building,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react';

function FinanceContent() {
  const searchParams = useSearchParams();
  const initialPrice = Number(searchParams.get('price')) || 74990;
  const initialDeposit = Number(searchParams.get('deposit')) || 15000;
  const initialTerm = Number(searchParams.get('term')) || 48;
  const vehicleIdParam = searchParams.get('vehicleId') || '';

  // Calculator State
  const [calcPrice, setCalcPrice] = useState(initialPrice);
  const [calcDeposit, setCalcDeposit] = useState(initialDeposit);
  const [calcTradeIn, setCalcTradeIn] = useState(0);
  const [calcTerm, setCalcTerm] = useState(initialTerm);
  const [calcInterestRate, setCalcInterestRate] = useState(9.95);

  // Available Showroom Vehicles
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await fetch('/api/cars?limit=50');
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.vehicles || []);
        }
      } catch (e) {
        console.error('Failed to load vehicles:', e);
      }
    }
    loadVehicles();
  }, []);

  // Calculate Financed Amount and Repayments
  const amountFinanced = Math.max(0, calcPrice - calcDeposit - calcTradeIn);
  const monthlyRate = calcInterestRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0 && calcTerm > 0 && amountFinanced > 0
      ? (amountFinanced * monthlyRate * Math.pow(1 + monthlyRate, calcTerm)) /
        (Math.pow(1 + monthlyRate, calcTerm) - 1)
      : amountFinanced / (calcTerm || 1);

  const weeklyPayment = (monthlyPayment * 12) / 52;
  const fortnightlyPayment = weeklyPayment * 2;
  const totalRepayment = monthlyPayment * calcTerm;
  const totalInterestCost = Math.max(0, totalRepayment - amountFinanced);

  // Multi-step Application State (Step 1 to 5)
  const [step, setStep] = useState(1);

  // Step 1: Personal & Vehicle
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenceType, setLicenceType] = useState('Full');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [licenceVersion, setLicenceVersion] = useState('');
  const [vehicleInterested, setVehicleInterested] = useState('');
  const [appPrice, setAppPrice] = useState(calcPrice);
  const [appDeposit, setAppDeposit] = useState(calcDeposit);
  const [appTradeIn, setAppTradeIn] = useState(calcTradeIn);

  // Step 2: Living
  const [residentialStatus, setResidentialStatus] = useState('Own Home (with mortgage)');
  const [address, setAddress] = useState('');
  const [suburbCity, setSuburbCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [timeAtAddressYears, setTimeAtAddressYears] = useState('3');
  const [timeAtAddressMonths, setTimeAtAddressMonths] = useState('0');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [dependents, setDependents] = useState('0');

  // Step 3: Employment
  const [employmentStatus, setEmploymentStatus] = useState('Full-Time Employed');
  const [employerName, setEmployerName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [timeAtEmployerYears, setTimeAtEmployerYears] = useState('2');
  const [timeAtEmployerMonths, setTimeAtEmployerMonths] = useState('6');
  const [employerPhone, setEmployerPhone] = useState('');

  // Step 4: Income & Expenses
  const [netIncome, setNetIncome] = useState('');
  const [incomeFrequency, setIncomeFrequency] = useState('Monthly');
  const [otherIncome, setOtherIncome] = useState('');
  const [rentMortgage, setRentMortgage] = useState('');
  const [livingExpenses, setLivingExpenses] = useState('');
  const [otherLoans, setOtherLoans] = useState('');
  const [notes, setNotes] = useState('');

  // Step 5: Review & Consent
  const [consentCreditCheck, setConsentCreditCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  // Pre-fill from calculator when user clicks "Apply with these figures"
  const handleApplyWithFigures = () => {
    setAppPrice(calcPrice);
    setAppDeposit(calcDeposit);
    setAppTradeIn(calcTradeIn);
    const applySection = document.getElementById('apply');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const calcSection = document.getElementById('calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToApply = () => {
    const applySection = document.getElementById('apply');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step Validations
  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) return 'Please enter your first and last name.';
    if (!dob) return 'Please enter your date of birth.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (!phone.trim()) return 'Please enter your contact mobile number.';
    if (!appPrice || appPrice <= 0) return 'Please specify a vehicle price.';
    return null;
  };

  const validateStep2 = () => {
    if (!address.trim()) return 'Please enter your residential street address.';
    if (!suburbCity.trim()) return 'Please enter your suburb and city.';
    return null;
  };

  const validateStep3 = () => {
    if (!employerName.trim()) return 'Please enter your employer or business name.';
    if (!jobTitle.trim()) return 'Please enter your current occupation / job title.';
    return null;
  };

  const validateStep4 = () => {
    if (!netIncome.trim()) return 'Please provide your net take-home income.';
    return null;
  };

  const handleNextStep = () => {
    setError('');
    let err = null;
    if (step === 1) err = validateStep1();
    if (step === 2) err = validateStep2();
    if (step === 3) err = validateStep3();
    if (step === 4) err = validateStep4();

    if (err) {
      setError(err);
      return;
    }

    setStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consentCreditCheck) {
      setError('Please agree to the privacy statement and credit check consent before submitting.');
      return;
    }

    setLoading(true);

    try {
      const fullAddress = `${address}, ${suburbCity} ${postcode}`.trim();
      const timeAtAddressStr = `${timeAtAddressYears} yrs ${timeAtAddressMonths} mos`;
      const timeWithEmployerStr = `${timeAtEmployerYears} yrs ${timeAtEmployerMonths} mos`;
      const incomeStr = `$${netIncome} (${incomeFrequency})`;

      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicleIdParam || null,
          customerName: `${firstName} ${lastName}`.trim(),
          email: email.trim(),
          phone: phone.trim(),
          vehiclePrice: Number(appPrice),
          deposit: Number(appDeposit) || 0,
          tradeInValue: Number(appTradeIn) || 0,
          loanTerm: Number(calcTerm) || 48,
          interestRate: Number(calcInterestRate) || 9.95,
          estimatedMonthly: Math.round(monthlyPayment),
          employmentStatus,
          annualIncome:
            incomeFrequency === 'Annually'
              ? Number(netIncome)
              : incomeFrequency === 'Monthly'
              ? Number(netIncome) * 12
              : incomeFrequency === 'Weekly'
              ? Number(netIncome) * 52
              : Number(netIncome) * 26,
          // Extended Dossier
          dob,
          licenceType,
          licenceNumber,
          licenceVersion,
          vehicleInterested: vehicleInterested || 'Unspecified Showroom Vehicle',
          residentialStatus,
          address: fullAddress,
          timeAtAddress: timeAtAddressStr,
          maritalStatus,
          dependents,
          employerName,
          jobTitle,
          timeAtEmployer: timeWithEmployerStr,
          employerPhone,
          netIncome: incomeStr,
          otherIncome: otherIncome ? `$${otherIncome}` : undefined,
          rentMortgage: rentMortgage ? `$${rentMortgage}` : undefined,
          livingExpenses: livingExpenses ? `$${livingExpenses}` : undefined,
          otherLoans: otherLoans ? `$${otherLoans}` : undefined,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit application. Please check your details.');
      } else {
        const refId = `NC-FIN-${Math.floor(100000 + Math.random() * 900000)}`;
        setApplicationRef(refId);
        setApplied(true);
      }
    } catch (err: any) {
      setError('A connection error occurred. Please try again or call us on +64 9 888 4321.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-[#f4d410] selection:text-black font-sans">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="pt-32 pb-16 sm:pb-20 border-b border-white/[0.06] bg-gradient-to-b from-[#0e0e13] via-[#09090c] to-[#070709] relative overflow-hidden">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#f4d410]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#f4d410] font-medium">Finance</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-[#f4d410]">
              <Sparkles className="w-3.5 h-3.5 text-[#f4d410]" />
              <span>Tailored Dealership Lending</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight leading-[1.1]">
              Finance your next vehicle <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#f4d410]">
                with complete ease.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
              Get a quick estimate, explore your repayment options, and apply for vehicle finance in just a few simple steps. Checked against New Zealand’s premier lending partners.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToApply}
                className="px-7 py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#f4d410]/20 flex items-center gap-2"
              >
                <span>Apply for finance</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToCalculator}
                className="px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-[#f4d410]" />
                <span>Calculate repayments</span>
              </button>
            </div>

            {/* Value Highlights Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-400 font-medium">
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Quick application</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg">
                <Sliders className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Flexible options</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Secure process</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FINANCE MADE SIMPLE & LENDING PARTNERS                                  */}
      {/* ========================================================================= */}
      <section className="py-16 border-b border-white/[0.06] bg-[#09090c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] font-bold block">
                Finance Made Simple
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
                One application, checked against our lending partners.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                We work with New Zealand’s trusted vehicle finance institutions to help find an option tailored to your circumstances, credit tier, and monthly budget.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero initial credit score impact for estimation review</span>
              </div>
            </div>

            {/* Lending Partner Badges Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Heartland Bank', tag: 'Tier 1 Auto Bank' },
                { name: 'UDC Finance', tag: "NZ's #1 Asset Financier" },
                { name: 'Marac / Finance Now', tag: 'Fast Turnaround' },
                { name: 'Avanti Finance', tag: 'Flexible Terms' },
                { name: 'Oxford Finance', tag: 'Competitive Rates' },
                { name: 'Geneva Finance', tag: 'Custom Solutions' },
              ].map((lender, idx) => (
                <div
                  key={idx}
                  className="bg-[#111114] border border-white/[0.08] hover:border-[#f4d410]/30 rounded-2xl p-4 text-center transition-all group"
                >
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building className="w-4 h-4 text-[#f4d410]" />
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">{lender.name}</div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5 block">
                    {lender.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY FINANCE WITH US                                                    */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-white/[0.06] bg-[#070709]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] font-bold block">
              Why Finance With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Built to be straightforward
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Clear terms, no confusing banking jargon, and a seamless process from application to showroom handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Quick application',
                desc: 'Complete your application in just a few simple steps with immediate review and rapid pre-qualification.',
              },
              {
                icon: Sliders,
                title: 'Flexible options',
                desc: 'Explore repayment options that work for your budget, with terms extending from 12 up to 84 months.',
              },
              {
                icon: User,
                title: 'Expert support',
                desc: 'Our dedicated Auckland finance team helps you understand your finance options and structures.',
              },
              {
                icon: ShieldCheck,
                title: 'Secure process',
                desc: 'Your personal and financial information is handled securely with bank-grade 256-bit encryption.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-[#0c0c0f] border border-white/[0.08] hover:border-[#f4d410]/30 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f4d410]/10 border border-[#f4d410]/20 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-[#f4d410]" />
                </div>
                <h3 className="text-base font-bold text-white font-['Outfit']">{card.title}</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REVIEWS & TESTIMONIALS                                                 */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-white/[0.06] bg-[#09090c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] font-bold block mb-1">
                Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
                Trusted by drivers
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
                Hear from recent buyers who financed their luxury vehicle with Nova Cars Auckland.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#f4d410] text-xs font-mono bg-white/5 border border-white/10 px-4 py-2 rounded-xl self-start md:self-auto">
              <Star className="w-4 h-4 fill-[#f4d410] text-[#f4d410]" />
              <span className="font-bold text-white">4.9 / 5.0</span>
              <span className="text-zinc-500 ml-1">(120+ Verified Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                quote: 'Smooth easy process and awesome service. They got my finance sorted in an afternoon, highly recommend.',
                author: 'Marcus S.',
                location: 'Auckland',
                vehicle: 'BMW X5 xDrive40i',
              },
              {
                quote: 'Great communication and very honest throughout the purchase. Transparent interest rates with zero unexpected fees.',
                author: 'Elena R.',
                location: 'Ponsonby',
                vehicle: 'Mercedes-Benz E 350',
              },
              {
                quote: 'Best dealership experience I have had in New Zealand. Quality vehicles and great people who care about your budget.',
                author: 'David C.',
                location: 'Takapuna',
                vehicle: 'Porsche Cayenne GTS',
              },
              {
                quote: 'They made the whole process easy. Appraised my trade-in fairly and structured repayments perfectly. Will return.',
                author: 'Alistair V.',
                location: 'Grey Lynn',
                vehicle: 'Audi Q7 55 TFSI',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-[#111114] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#f4d410] text-[#f4d410]" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-300 font-light italic leading-relaxed">
                    “{review.quote}”
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <div className="text-xs font-bold text-white">{review.author}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {review.location} &bull; {review.vehicle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE BASICS: FINANCE THAT FITS YOUR BUDGET                             */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-white/[0.06] bg-[#070709]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] font-bold block">
                The Basics
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
                Finance that fits your budget
              </h2>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                Vehicle finance is simpler than it sounds. You choose a vehicle, put in what you can up front, and repay the rest over a term that suits you.
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Send us your application and we check it with our lending partners. We come back to you with the options available and talk you through them — no obligation, and no approval is guaranteed until a lender confirms it.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                onClick={scrollToApply}
                className="px-8 py-4 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#f4d410]/20 flex items-center gap-2"
              >
                <span>Start your application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6 Essential Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Vehicle finance',
                desc: 'A loan for the vehicle you want, repaid over an agreed term. You drive the vehicle away from day one.',
              },
              {
                title: 'Deposit',
                desc: 'Cash you put in up front. A larger deposit lowers the amount you borrow, saving you interest and reducing your weekly payments.',
              },
              {
                title: 'Trade-in',
                desc: 'The trade-in value of your current vehicle can be used the exact same way as a cash deposit toward your purchase.',
              },
              {
                title: 'Loan term',
                desc: 'How long you take to repay — from 12 up to 84 months. A shorter term costs less overall; a longer term lowers each payment.',
              },
              {
                title: 'Repayments',
                desc: 'Set weekly, fortnightly, or monthly amounts tailored to your pay cycle that steadily pay off the loan across the term.',
              },
              {
                title: 'Interest rate',
                desc: 'The cost of borrowing. Your indicative rate is determined by the lender based on your credit profile and equity.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0e0e13] border border-white/[0.08] rounded-2xl p-6 space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="text-xs font-mono font-bold text-[#f4d410] uppercase tracking-wider">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white font-['Outfit']">{item.title}</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REPAYMENT ESTIMATOR / CALCULATOR                                        */}
      {/* ========================================================================= */}
      <section id="calculator" className="py-20 border-b border-white/[0.06] bg-[#0a0a0e] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] font-bold block">
              Repayment Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Calculate your repayments
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Estimate your repayments before you apply. Adjust the price, deposit, trade-in, and term to see what fits your budget.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Calculator Inputs (7 Cols) */}
            <div className="lg:col-span-7 bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-7 shadow-xl">
              {/* Vehicle Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-zinc-300">Vehicle price</label>
                  <div className="flex items-center gap-1 bg-[#0c0c0f] border border-white/10 rounded-lg px-3 py-1 font-mono text-white font-bold">
                    <span className="text-[#f4d410]">$</span>
                    <input
                      type="number"
                      min="5000"
                      max="300000"
                      step="500"
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(Number(e.target.value))}
                      className="bg-transparent text-right w-24 focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="1000"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full accent-[#f4d410] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>$10,000</span>
                  <span>$125,000</span>
                  <span>$250,000+</span>
                </div>
              </div>

              {/* Cash Deposit */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-zinc-300">Cash deposit</label>
                  <div className="flex items-center gap-1 bg-[#0c0c0f] border border-white/10 rounded-lg px-3 py-1 font-mono text-white font-bold">
                    <span className="text-[#f4d410]">$</span>
                    <input
                      type="number"
                      min="0"
                      max={calcPrice}
                      step="500"
                      value={calcDeposit}
                      onChange={(e) => setCalcDeposit(Number(e.target.value))}
                      className="bg-transparent text-right w-24 focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={calcPrice * 0.8}
                  step="500"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(Number(e.target.value))}
                  className="w-full accent-[#f4d410] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>$0 (No deposit)</span>
                  <span>20% (~${Math.round(calcPrice * 0.2).toLocaleString()})</span>
                  <span>50% (~${Math.round(calcPrice * 0.5).toLocaleString()})</span>
                </div>
              </div>

              {/* Trade-in Value */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-zinc-300">Trade-in value</label>
                  <div className="flex items-center gap-1 bg-[#0c0c0f] border border-white/10 rounded-lg px-3 py-1 font-mono text-white font-bold">
                    <span className="text-[#f4d410]">$</span>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="500"
                      value={calcTradeIn}
                      onChange={(e) => setCalcTradeIn(Number(e.target.value))}
                      className="bg-transparent text-right w-24 focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80000"
                  step="500"
                  value={calcTradeIn}
                  onChange={(e) => setCalcTradeIn(Number(e.target.value))}
                  className="w-full accent-[#f4d410] cursor-pointer"
                />
              </div>

              {/* Loan Term Selector (Pills) */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-300">
                  <span>Loan term</span>
                  <span className="text-[#f4d410] font-mono font-bold">{calcTerm} months ({calcTerm / 12} yrs)</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[12, 24, 36, 48, 60, 72, 84].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCalcTerm(t)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-mono font-bold transition-all ${
                        calcTerm === t
                          ? 'bg-[#f4d410] text-black shadow-md shadow-[#f4d410]/20'
                          : 'bg-[#0c0c0f] text-zinc-400 border border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {t} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <label className="font-semibold text-zinc-300 block">Interest rate</label>
                    <span className="text-[11px] text-zinc-500">
                      Indicative rate only — your actual rate is set by the lender on approval.
                    </span>
                  </div>
                  <span className="text-sm font-bold font-mono text-[#f4d410] bg-[#0c0c0f] border border-white/10 px-3 py-1 rounded-lg">
                    {calcInterestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="6.95"
                  max="15.95"
                  step="0.25"
                  value={calcInterestRate}
                  onChange={(e) => setCalcInterestRate(Number(e.target.value))}
                  className="w-full accent-[#f4d410] cursor-pointer"
                />
              </div>
            </div>

            {/* Repayment Output Card (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#141419] to-[#0f0f14] border border-white/15 rounded-3xl p-7 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase font-mono tracking-widest text-[#f4d410] font-bold block">
                  Your estimated repayment
                </span>
                <div className="pt-2">
                  <span className="text-5xl sm:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight">
                    ${Math.round(weeklyPayment).toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono block mt-1">/ week</span>
                </div>
              </div>

              {/* Dual Frequencies */}
              <div className="grid grid-cols-2 gap-3 bg-[#0a0a0d] border border-white/5 p-3 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Fortnightly</span>
                  <span className="text-base font-bold text-white font-mono">
                    ${Math.round(fortnightlyPayment).toLocaleString()}
                  </span>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Monthly</span>
                  <span className="text-base font-bold text-white font-mono">
                    ${Math.round(monthlyPayment).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Breakdown Details */}
              <div className="space-y-3 pt-3 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Amount financed</span>
                  <span className="text-white font-bold">${amountFinanced.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Total repayment</span>
                  <span className="text-white font-bold">${Math.round(totalRepayment).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated interest & finance cost</span>
                  <span className="text-[#f4d410] font-bold">${Math.round(totalInterestCost).toLocaleString()}</span>
                </div>
              </div>

              {/* Apply with these figures CTA */}
              <button
                type="button"
                onClick={handleApplyWithFigures}
                className="w-full py-4 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#f4d410]/20 flex items-center justify-center gap-2"
              >
                <span>Apply with these figures</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                Figures are estimates only and may vary depending on lender, interest rate, fees, deposit, term and approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 5-STEP COMPREHENSIVE FINANCE APPLICATION                                */}
      {/* ========================================================================= */}
      <section id="apply" className="py-20 bg-[#070709] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#f4d410] font-bold block">
              Application
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
              Apply for finance
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto">
              Five short steps. Your answers are kept as you move between them, so you can go back and change anything before you submit.
            </p>
          </div>

          {applied ? (
            /* APPLICATION SUCCESS SCREEN */
            <div className="bg-[#111114] border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                  Application Logged
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  Thank you, {firstName}!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto font-light leading-relaxed">
                  Your finance pre-approval application has been securely transmitted to our dealership finance team at <strong className="text-white">SALES@NOVAAUTO.CO.NZ</strong>.
                </p>
              </div>

              <div className="bg-[#0c0c0f] border border-white/5 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Application Reference:</span>
                  <span className="text-[#f4d410] font-bold">{applicationRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Applicant:</span>
                  <span className="text-white font-semibold">{firstName} {lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Vehicle Amount:</span>
                  <span className="text-white font-semibold">${Number(appPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Deposit / Trade-In:</span>
                  <span className="text-white font-semibold">${(Number(appDeposit) + Number(appTradeIn)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Turnaround Time:</span>
                  <span className="text-emerald-400 font-semibold">Under 2 Business Hours</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/inventory"
                  className="px-6 py-3 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  Browse Showroom Inventory
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            /* MULTI-STEP APPLICATION FORM CONTAINER */
            <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
              {/* Stepper Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">
                    Step <strong className="text-white">{step}</strong> of 5
                  </span>
                  <span className="text-[#f4d410] font-bold">
                    {step === 1 && '01 Personal & Vehicle'}
                    {step === 2 && '02 Living Situation'}
                    {step === 3 && '03 Employment'}
                    {step === 4 && '04 Income & Expenses'}
                    {step === 5 && '05 Review & Consent'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#f4d410] to-[#fae033] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>

                {/* Stepper Pills Navigation */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {[
                    { s: 1, label: '01 Personal' },
                    { s: 2, label: '02 Living' },
                    { s: 3, label: '03 Employment' },
                    { s: 4, label: '04 Income' },
                    { s: 5, label: '05 Review' },
                  ].map((item) => (
                    <button
                      key={item.s}
                      type="button"
                      disabled={item.s > step}
                      onClick={() => setStep(item.s)}
                      className={`py-2 px-1 text-center rounded-xl text-[10px] sm:text-xs font-mono transition-all truncate ${
                        step === item.s
                          ? 'bg-[#f4d410] text-black font-extrabold shadow-md shadow-[#f4d410]/20'
                          : item.s < step
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                          : 'bg-[#0c0c0f] text-zinc-500 border border-white/5 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 1: PERSONAL DETAILS & VEHICLE                            */}
              {/* ============================================================= */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Personal details</h3>
                    <p className="text-xs text-zinc-400">
                      Let us know who you are and the vehicle you have in mind.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        First name <span className="text-[#f4d410]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Given name"
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Last name <span className="text-[#f4d410]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Family name"
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Date of birth <span className="text-[#f4d410]">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Mobile phone <span className="text-[#f4d410]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+64 21 000 0000"
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Email address <span className="text-[#f4d410]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.co.nz"
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>
                  </div>

                  {/* Driver Licence Section */}
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <span className="text-xs font-bold text-white font-['Outfit'] block">
                      Driver Licence
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Licence type
                        </label>
                        <select
                          value={licenceType}
                          onChange={(e) => setLicenceType(e.target.value)}
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        >
                          <option value="Full">Full Licence</option>
                          <option value="Restricted">Restricted</option>
                          <option value="Learner">Learner</option>
                          <option value="Overseas">Overseas Licence</option>
                          <option value="None">None / Passport</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Licence number
                        </label>
                        <input
                          type="text"
                          value={licenceNumber}
                          onChange={(e) => setLicenceNumber(e.target.value)}
                          placeholder="e.g. AA123456"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Licence version
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={licenceVersion}
                          onChange={(e) => setLicenceVersion(e.target.value)}
                          placeholder="e.g. 001"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Finance Numbers */}
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <span className="text-xs font-bold text-white font-['Outfit'] block">
                      Vehicle & Finance Targets
                    </span>

                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Vehicle you are interested in
                      </label>
                      {vehicles.length > 0 ? (
                        <select
                          value={vehicleInterested}
                          onChange={(e) => {
                            setVehicleInterested(e.target.value);
                            const selected = vehicles.find((v) => `${v.year} ${v.make} ${v.model}` === e.target.value);
                            if (selected) {
                              setAppPrice(selected.salePrice || selected.price);
                            }
                          }}
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        >
                          <option value="">-- Choose from our current showroom inventory (Optional) --</option>
                          {vehicles.map((v) => (
                            <option key={v.id} value={`${v.year} ${v.make} ${v.model}`}>
                              {v.year} {v.make} {v.model} {v.variant || ''} — ${(v.salePrice || v.price).toLocaleString()}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={vehicleInterested}
                          onChange={(e) => setVehicleInterested(e.target.value)}
                          placeholder="e.g. 2022 BMW X5 or specific vehicle model"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Vehicle price ($) <span className="text-[#f4d410]">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={appPrice}
                          onChange={(e) => setAppPrice(Number(e.target.value))}
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Cash deposit ($)
                        </label>
                        <input
                          type="number"
                          value={appDeposit}
                          onChange={(e) => setAppDeposit(Number(e.target.value))}
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Trade-in value ($)
                        </label>
                        <input
                          type="number"
                          value={appTradeIn}
                          onChange={(e) => setAppTradeIn(Number(e.target.value))}
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#f4d410]/20"
                    >
                      <span>Continue to Living</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 2: LIVING SITUATION                                      */}
              {/* ============================================================= */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Living situation</h3>
                    <p className="text-xs text-zinc-400">
                      Your current accommodation and residential history in New Zealand.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Residential status
                      </label>
                      <select
                        value={residentialStatus}
                        onChange={(e) => setResidentialStatus(e.target.value)}
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      >
                        <option value="Own Home (with mortgage)">Own Home (with mortgage)</option>
                        <option value="Own Home (outright)">Own Home (mortgage-free / outright)</option>
                        <option value="Renting">Renting (Tenancy agreement)</option>
                        <option value="Boarding">Boarding</option>
                        <option value="Living with Parents">Living with Parents / Family</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Current street address <span className="text-[#f4d410]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 42 Remuera Road"
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Suburb & City <span className="text-[#f4d410]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={suburbCity}
                          onChange={(e) => setSuburbCity(e.target.value)}
                          placeholder="e.g. Remuera, Auckland"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          placeholder="e.g. 1050"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Time at current address
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={timeAtAddressYears}
                            onChange={(e) => setTimeAtAddressYears(e.target.value)}
                            className="bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                          >
                            {[...Array(21)].map((_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? 'Year' : 'Years'}
                              </option>
                            ))}
                          </select>
                          <select
                            value={timeAtAddressMonths}
                            onChange={(e) => setTimeAtAddressMonths(e.target.value)}
                            className="bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                          >
                            {[...Array(12)].map((_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? 'Month' : 'Months'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-zinc-400 block mb-1">
                            Marital status
                          </label>
                          <select
                            value={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.value)}
                            className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                          >
                            <option value="Single">Single</option>
                            <option value="Married / De Facto">Married / De Facto</option>
                            <option value="Separated / Divorced">Separated / Divorced</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-zinc-400 block mb-1">
                            Dependents
                          </label>
                          <select
                            value={dependents}
                            onChange={(e) => setDependents(e.target.value)}
                            className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4+">4+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#f4d410]/20"
                    >
                      <span>Continue to Employment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 3: EMPLOYMENT                                            */}
              {/* ============================================================= */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Employment details</h3>
                    <p className="text-xs text-zinc-400">
                      Tell us about your current occupation and source of income.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Employment status
                      </label>
                      <select
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      >
                        <option value="Full-Time Employed">Full-Time Employed (PAYE)</option>
                        <option value="Part-Time Employed">Part-Time Employed</option>
                        <option value="Self-Employed / Director">Self-Employed / Business Owner</option>
                        <option value="Contractor">Independent Contractor</option>
                        <option value="Casual">Casual</option>
                        <option value="Retired / Investment">Retired / Investment Income</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Employer / Company name <span className="text-[#f4d410]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={employerName}
                          onChange={(e) => setEmployerName(e.target.value)}
                          placeholder="e.g. Auckland Health / Self"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Job title / Occupation <span className="text-[#f4d410]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g. Senior Architect / Director"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Time with current employer
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={timeAtEmployerYears}
                            onChange={(e) => setTimeAtEmployerYears(e.target.value)}
                            className="bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                          >
                            {[...Array(26)].map((_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? 'Year' : 'Years'}
                              </option>
                            ))}
                          </select>
                          <select
                            value={timeAtEmployerMonths}
                            onChange={(e) => setTimeAtEmployerMonths(e.target.value)}
                            className="bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                          >
                            {[...Array(12)].map((_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? 'Month' : 'Months'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Work contact / Employer phone
                        </label>
                        <input
                          type="tel"
                          value={employerPhone}
                          onChange={(e) => setEmployerPhone(e.target.value)}
                          placeholder="+64 9 000 0000"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#f4d410]/20"
                    >
                      <span>Continue to Income</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 4: INCOME & EXPENSES                                     */}
              {/* ============================================================= */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Income & expenses</h3>
                    <p className="text-xs text-zinc-400">
                      Help our lenders determine the most comfortable repayment structure.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Net take-home income ($) <span className="text-[#f4d410]">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={netIncome}
                          onChange={(e) => setNetIncome(e.target.value)}
                          placeholder="e.g. 7500"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Pay frequency
                        </label>
                        <select
                          value={incomeFrequency}
                          onChange={(e) => setIncomeFrequency(e.target.value)}
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Fortnightly">Fortnightly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Annually">Annually</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Other income (Rental, Bonus, Partner) ($)
                        </label>
                        <input
                          type="number"
                          value={otherIncome}
                          onChange={(e) => setOtherIncome(e.target.value)}
                          placeholder="Optional"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Rent or mortgage payment ($/mo)
                        </label>
                        <input
                          type="number"
                          value={rentMortgage}
                          onChange={(e) => setRentMortgage(e.target.value)}
                          placeholder="e.g. 2400"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Living expenses & bills ($/mo)
                        </label>
                        <input
                          type="number"
                          value={livingExpenses}
                          onChange={(e) => setLivingExpenses(e.target.value)}
                          placeholder="Groceries, utilities, insurance"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-400 block mb-1">
                          Other loan commitments / Credit cards ($)
                        </label>
                        <input
                          type="number"
                          value={otherLoans}
                          onChange={(e) => setOtherLoans(e.target.value)}
                          placeholder="Other debt repayments"
                          className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#f4d410]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-400 block mb-1">
                        Additional notes / Preferences (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information regarding your term preference or current vehicle"
                        className="w-full bg-[#0c0c0f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f4d410]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#f4d410]/20"
                    >
                      <span>Review Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 5: REVIEW & SUBMIT                                       */}
              {/* ============================================================= */}
              {step === 5 && (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Review & Submit</h3>
                    <p className="text-xs text-zinc-400">
                      Please verify your details before submitting to our finance team.
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#0c0c0f] border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className="text-[11px] font-bold text-[#f4d410] uppercase flex items-center justify-between">
                        <span>Personal Details</span>
                        <button type="button" onClick={() => setStep(1)} className="text-zinc-500 hover:text-white underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-white font-semibold">{firstName} {lastName}</div>
                      <div className="text-zinc-400">{email} &bull; {phone}</div>
                      <div className="text-zinc-500">DOB: {dob} | Licence: {licenceType}</div>
                    </div>

                    <div className="bg-[#0c0c0f] border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className="text-[11px] font-bold text-[#f4d410] uppercase flex items-center justify-between">
                        <span>Vehicle & Loan Figures</span>
                        <button type="button" onClick={() => setStep(1)} className="text-zinc-500 hover:text-white underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-white font-semibold">{vehicleInterested || 'Showroom Vehicle'}</div>
                      <div className="text-zinc-400">
                        Price: ${Number(appPrice).toLocaleString()} | Deposit: ${Number(appDeposit).toLocaleString()}
                      </div>
                      <div className="text-[#f4d410]">
                        Net Borrowed: ${Math.max(0, appPrice - appDeposit - appTradeIn).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-[#0c0c0f] border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className="text-[11px] font-bold text-[#f4d410] uppercase flex items-center justify-between">
                        <span>Living Situation</span>
                        <button type="button" onClick={() => setStep(2)} className="text-zinc-500 hover:text-white underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-white font-semibold">{residentialStatus}</div>
                      <div className="text-zinc-400">{address}, {suburbCity}</div>
                      <div className="text-zinc-500">Time at address: {timeAtAddressYears}y {timeAtAddressMonths}m</div>
                    </div>

                    <div className="bg-[#0c0c0f] border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className="text-[11px] font-bold text-[#f4d410] uppercase flex items-center justify-between">
                        <span>Employment & Income</span>
                        <button type="button" onClick={() => setStep(3)} className="text-zinc-500 hover:text-white underline">
                          Edit
                        </button>
                      </div>
                      <div className="text-white font-semibold">{employerName} — {jobTitle}</div>
                      <div className="text-zinc-400">Status: {employmentStatus}</div>
                      <div className="text-emerald-400">Net: ${netIncome} ({incomeFrequency})</div>
                    </div>
                  </div>

                  {/* Privacy & Credit Consent Checkbox */}
                  <div className="bg-[#0c0c0f] border border-white/10 rounded-2xl p-4 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={consentCreditCheck}
                        onChange={(e) => setConsentCreditCheck(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded accent-[#f4d410] cursor-pointer"
                      />
                      <span className="text-xs text-zinc-300 font-light leading-relaxed">
                        I confirm that the information provided is true and correct. I authorize Nova Cars Auckland and its accredited lending partners (including Heartland Bank, UDC, Marac, Avanti, and Oxford Finance) to verify my identity and conduct a credit check under the New Zealand Privacy Act 2020.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-10 py-4 rounded-xl bg-[#f4d410] hover:bg-[#fae033] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#f4d410]/25 flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>{loading ? 'Transmitting Application...' : 'Submit Finance Application'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER DIRECTORY & DEALERSHIP CONTACT                                   */}
      {/* ========================================================================= */}
      <section className="py-14 border-t border-white/[0.06] bg-[#09090c]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Need immediate financing advice?</h3>
              <p className="text-xs text-zinc-400">
                Speak directly with our Auckland Dealership Finance Director.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+6498884321"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>+64 9 888 4321</span>
              </a>

              <a
                href="mailto:sales@novaauto.co.nz"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>sales@novaauto.co.nz</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709]" />}>
      <FinanceContent />
    </Suspense>
  );
}
