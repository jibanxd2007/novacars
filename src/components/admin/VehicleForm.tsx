'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Upload,
  X,
  Star,
  ArrowLeft,
  Trash2,
  Save,
  Check,
  Calendar,
  Car,
  Gauge,
  Palette,
  Flame,
  Armchair,
  Zap,
  Hash,
} from 'lucide-react';

interface VehicleFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function VehicleForm({ initialData, isEdit = false }: VehicleFormProps) {
  const router = useRouter();

  const [make, setMake] = useState(initialData?.make || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [variant, setVariant] = useState(initialData?.variant || '');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [price, setPrice] = useState(initialData?.price || '');
  const [salePrice, setSalePrice] = useState(initialData?.salePrice || '');
  const [stockNumber, setStockNumber] = useState(initialData?.stockNumber || '');
  const [registration, setRegistration] = useState(initialData?.registration || '');
  const [condition, setCondition] = useState(initialData?.condition || 'Pre-Owned Certified');
  const [location, setLocation] = useState(initialData?.location || 'Auckland Showroom');

  // Specs & Frontend Specs Card attributes
  const [mileage, setMileage] = useState(initialData?.mileage || '');
  const [fuelType, setFuelType] = useState(initialData?.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState(initialData?.transmission || 'Automatic');
  const [bodyType, setBodyType] = useState(initialData?.bodyType || 'Sedan');
  const [engine, setEngine] = useState(initialData?.engine || '');
  const [engineSize, setEngineSize] = useState(initialData?.engineSize || '');
  const [power, setPower] = useState(initialData?.power || '');
  const [drivetrain, setDrivetrain] = useState(initialData?.drivetrain || 'All-Wheel Drive (AWD)');
  const [doors, setDoors] = useState(initialData?.doors || 5);
  const [seats, setSeats] = useState(initialData?.seats || 5);
  const [exteriorColor, setExteriorColor] = useState(initialData?.exteriorColor || '');
  const [interiorColor, setInteriorColor] = useState(initialData?.interiorColor || '');
  const [vin, setVin] = useState(initialData?.vin || '');

  // Synchronize state when initialData loads or changes
  useEffect(() => {
    if (initialData) {
      if (initialData.make !== undefined) setMake(initialData.make || '');
      if (initialData.model !== undefined) setModel(initialData.model || '');
      if (initialData.variant !== undefined) setVariant(initialData.variant || '');
      if (initialData.year !== undefined) setYear(initialData.year);
      if (initialData.price !== undefined) setPrice(initialData.price);
      if (initialData.salePrice !== undefined) setSalePrice(initialData.salePrice || '');
      if (initialData.stockNumber !== undefined) setStockNumber(initialData.stockNumber || '');
      if (initialData.bodyType !== undefined) setBodyType(initialData.bodyType || 'Sedan');
      if (initialData.transmission !== undefined) setTransmission(initialData.transmission || 'Automatic');
      if (initialData.exteriorColor !== undefined) setExteriorColor(initialData.exteriorColor || '');
      if (initialData.interiorColor !== undefined) setInteriorColor(initialData.interiorColor || '');
      if (initialData.engine !== undefined) setEngine(initialData.engine || '');
      if (initialData.power !== undefined) setPower(initialData.power || '');
      if (initialData.engineSize !== undefined) setEngineSize(initialData.engineSize || '');
      if (initialData.mileage !== undefined) setMileage(initialData.mileage);
      if (initialData.fuelType !== undefined) setFuelType(initialData.fuelType || 'Petrol');
      if (initialData.drivetrain !== undefined) setDrivetrain(initialData.drivetrain || 'All-Wheel Drive (AWD)');
      if (initialData.doors !== undefined) setDoors(initialData.doors || 5);
      if (initialData.seats !== undefined) setSeats(initialData.seats || 5);
      if (initialData.registration !== undefined) setRegistration(initialData.registration || '');
      if (initialData.vin !== undefined) setVin(initialData.vin || '');
      if (initialData.condition !== undefined) setCondition(initialData.condition || 'Pre-Owned Certified');
      if (initialData.location !== undefined) setLocation(initialData.location || 'Auckland Showroom');
      if (initialData.description !== undefined) setDescription(initialData.description || '');
      if (initialData.status !== undefined) setStatus(initialData.status || 'published');
      if (initialData.featured !== undefined) setFeatured(Boolean(initialData.featured));
      if (initialData.slug !== undefined) setSlug(initialData.slug || '');
      if (initialData.features) {
        setFeatures(initialData.features.map((f: any) => (typeof f === 'string' ? f : f.name)));
      }
      if (initialData.images) {
        setImages(initialData.images.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url,
          isPrimary: Boolean(img.isPrimary),
          alt: img.alt || '',
        })));
      }
    }
  }, [initialData]);

  // Description & Features
  const [description, setDescription] = useState(initialData?.description || '');
  const [features, setFeatures] = useState<string[]>(
    initialData?.features?.map((f: any) => (typeof f === 'string' ? f : f.name)) || [
      'Panoramic Glass Sunroof',
      'Adaptive Cruise Control',
      'Surround View 360 Camera',
      'Heated & Ventilated Front Seats',
      'Apple CarPlay & Android Auto',
    ]
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Images
  const [images, setImages] = useState<Array<{ url: string; isPrimary: boolean; alt?: string }>>(
    initialData?.images?.map((img: any) => ({
      url: typeof img === 'string' ? img : img.url,
      isPrimary: Boolean(img.isPrimary),
      alt: img.alt || '',
    })) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Status & SEO
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [slug, setSlug] = useState(initialData?.slug || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeatureInput.trim() && !features.includes(newFeatureInput.trim())) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter((f) => f !== feat));
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages([
        ...images,
        {
          url: newImageUrl.trim(),
          isPrimary: images.length === 0,
          alt: `${make} ${model}`,
        },
      ]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setError('');
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        let uploadedUrl: string | null = null;

        // 1. Try server upload API first
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.url) {
            uploadedUrl = data.url;
          } else if (data.error) {
            console.warn('Server upload notice:', data.error);
          }
        } catch (apiErr) {
          console.warn('Upload API network error, falling back to client reader:', apiErr);
        }

        // 2. If server upload failed, read image directly as data URL
        if (!uploadedUrl) {
          uploadedUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        if (uploadedUrl) {
          setImages((prev) => [
            ...prev,
            { url: uploadedUrl!, isPrimary: prev.length === 0, alt: `${make || 'Vehicle'} ${model || ''}`.trim() },
          ]);
        }
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError('Could not process image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const setPrimaryImage = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const handleSubmit = async (submitStatus: string = status) => {
    setSaving(true);
    setError('');

    const payload = {
      make,
      model,
      variant,
      year: Number(year),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      stockNumber,
      registration,
      condition,
      location,
      mileage: Number(mileage),
      fuelType,
      transmission,
      bodyType,
      engine,
      engineSize,
      power,
      drivetrain,
      doors: Number(doors),
      seats: Number(seats),
      exteriorColor,
      interiorColor,
      vin,
      description,
      status: submitStatus,
      featured,
      slug: slug || undefined,
      images,
      features,
    };

    try {
      const url = isEdit ? `/api/cars/${initialData.id}` : '/api/cars';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save vehicle');
      }

      router.push('/admin/cars');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cars"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
              {isEdit ? 'Vehicle Editor' : 'New Listing'}
            </span>
            <h1 className="text-2xl font-light text-white font-['Outfit']">
              {isEdit ? `${initialData?.make} ${initialData?.model}` : 'Add Vehicle to Catalog'}
            </h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* 01 BASIC & PRICING INFORMATION */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          01 / BASIC & PRICING INFORMATION
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Make *</label>
            <input
              type="text"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Ford, BMW, Toyota"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Model *</label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Mondeo, X5, Camry"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Variant / Trim</label>
            <input
              type="text"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="e.g. Ambiente, Titanium, M Sport"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Price ($NZD) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="16995"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Sale Price</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="Optional discount"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Condition</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Pre-Owned Certified"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Auckland Showroom"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </section>

      {/* 02 VEHICLE SPECIFICATIONS (FRONTEND SPECS CARD) */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-widest text-[#f4d410] font-semibold block">
              02 / VEHICLE SPECIFICATIONS (FRONTEND SPECS CARD)
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Edit the 8 primary specifications displayed on the product detail page specs card.
            </p>
          </div>
        </div>

        {/* The 8 Primary Specs Card Fields */}
        <div className="bg-[#121217]/90 rounded-xl p-5 border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Product Page Specs Card Attributes
            </span>
            <span className="text-[10px] uppercase font-mono text-[#f4d410] font-bold">
              8 Core Fields
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Year */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Year *</span>
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                placeholder="e.g. 2016"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white font-mono outline-none"
              />
            </div>

            {/* 2. Body Style */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Car className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Body Style *</span>
              </label>
              <input
                type="text"
                list="bodyTypeList"
                required
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                placeholder="e.g. Sedan, SUV, Coupe"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <datalist id="bodyTypeList">
                <option value="Sedan" />
                <option value="SUV" />
                <option value="Coupe" />
                <option value="Hatchback" />
                <option value="Wagon" />
                <option value="Convertible" />
                <option value="Ute / Truck" />
                <option value="Van" />
              </datalist>
            </div>

            {/* 3. Transmission */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Transmission *</span>
              </label>
              <input
                type="text"
                list="transmissionList"
                required
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                placeholder="e.g. Automatic, Manual"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white outline-none"
              />
              <datalist id="transmissionList">
                <option value="Automatic" />
                <option value="Manual" />
                <option value="Dual-Clutch (DCT)" />
                <option value="CVT" />
                <option value="Direct Drive" />
                <option value="Tiptronic" />
              </datalist>
            </div>

            {/* 4. Exterior Color */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Palette className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Exterior Color *</span>
              </label>
              <input
                type="text"
                value={exteriorColor}
                onChange={(e) => setExteriorColor(e.target.value)}
                placeholder="e.g. Deep Impact Blue, Black"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* 5. Engine */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Engine *</span>
              </label>
              <input
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                placeholder="e.g. 2.0, 2.0L EcoBoost, 3.0L Turbo"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* 6. Interior */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Armchair className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Interior *</span>
              </label>
              <input
                type="text"
                value={interiorColor}
                onChange={(e) => setInteriorColor(e.target.value)}
                placeholder="e.g. Leather, Charcoal Cloth"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* 7. Power Output */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Power Output *</span>
              </label>
              <input
                type="text"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="e.g. 180 HP, 132 kW, 640 HP"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white outline-none"
              />
            </div>

            {/* 8. Stock Number */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Hash className="w-3.5 h-3.5 text-[#f4d410]" />
                <span>Stock Number *</span>
              </label>
              <input
                type="text"
                required
                value={stockNumber}
                onChange={(e) => setStockNumber(e.target.value)}
                placeholder="e.g. NC-001"
                className="w-full bg-[#181820] border border-white/10 focus:border-[#f4d410] rounded-lg p-2.5 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Frontend Specs Card Preview */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
              Live Product Page Specs Card Preview
            </span>
            <span className="text-[10px] text-[#f4d410] font-mono">
              Matches customer-facing layout
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 py-4 px-4 rounded-xl bg-[#0f0f14]/80 border border-white/[0.06] max-w-xl">
            {/* Year */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Year</div>
                <div className="text-xs font-bold text-white">{year || '—'}</div>
              </div>
            </div>

            {/* Body Style */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Body Style</div>
                <div className="text-xs font-bold text-white">{bodyType || '—'}</div>
              </div>
            </div>

            {/* Transmission */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Transmission</div>
                <div className="text-xs font-bold text-white">{transmission || '—'}</div>
              </div>
            </div>

            {/* Exterior Color */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Exterior Color</div>
                <div className="text-xs font-bold text-white truncate max-w-[120px]">{exteriorColor || '—'}</div>
              </div>
            </div>

            {/* Engine */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Engine</div>
                <div className="text-xs font-bold text-white">{engine || '—'}</div>
              </div>
            </div>

            {/* Interior */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Armchair className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Interior</div>
                <div className="text-xs font-bold text-white">{interiorColor || '—'}</div>
              </div>
            </div>

            {/* Power Output */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Power Output</div>
                <div className="text-xs font-bold text-white">{power || '—'}</div>
              </div>
            </div>

            {/* Stock Number */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#f4d410]/10 flex items-center justify-center shrink-0">
                <Hash className="w-4 h-4 text-[#f4d410]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Stock Number</div>
                <div className="text-xs font-bold text-white font-mono">{stockNumber || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Technical & Chassis Details */}
        <div className="space-y-4 pt-4 border-t border-white/[0.06]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
            Additional Technical & Chassis Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Mileage (km) *</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="42500"
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Drivetrain</label>
              <input
                type="text"
                list="drivetrainList"
                value={drivetrain}
                onChange={(e) => setDrivetrain(e.target.value)}
                placeholder="e.g. All-Wheel Drive (AWD)"
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
              />
              <datalist id="drivetrainList">
                <option value="All-Wheel Drive (AWD)" />
                <option value="Four-Wheel Drive (4WD)" />
                <option value="Rear-Wheel Drive (RWD)" />
                <option value="Front-Wheel Drive (FWD)" />
              </datalist>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Engine CC</label>
              <input
                type="text"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                placeholder="e.g. 1,999 cc"
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Doors</label>
              <input
                type="number"
                value={doors}
                onChange={(e) => setDoors(Number(e.target.value))}
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Seats</label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Registration Plate</label>
              <input
                type="text"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="e.g. NVA-051"
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">VIN Number</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="17-character VIN"
                className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 03 PHOTOGRAPHS */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          03 / PHOTOGRAPHS
        </span>

        {/* Dropzone */}
        <div className="border border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors relative cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
          <span className="text-xs text-white font-medium block">
            {uploading ? 'Uploading...' : 'Drop vehicle photos here, or browse from computer'}
          </span>
          <span className="text-[10px] text-zinc-500">JPG, PNG, WebP up to 10MB</span>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Or enter direct photo URL (https://images.unsplash.com/...)"
            className="flex-1 bg-[#141419] border border-white/[0.08] rounded-lg p-2 text-xs text-white"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
          >
            Add
          </button>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden border bg-zinc-950 group ${
                  img.isPrimary ? 'border-[#f4d410]' : 'border-white/10'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {img.isPrimary && (
                  <div className="absolute top-2 left-2 bg-[#f4d410] text-black text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                    ★ Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(idx)}
                    className="p-1 rounded bg-black/80 text-[#f4d410]"
                    title="Set as Cover"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 rounded bg-black/80 text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 04 FEATURES */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          04 / FEATURES & FACTORY EQUIPMENT
        </span>

        <div className="flex flex-wrap gap-2">
          {features.map((feat) => (
            <span
              key={feat}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141419] border border-white/[0.06] text-xs text-zinc-300"
            >
              <span>{feat}</span>
              <button
                type="button"
                onClick={() => handleRemoveFeature(feat)}
                className="hover:text-rose-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newFeatureInput}
            onChange={(e) => setNewFeatureInput(e.target.value)}
            placeholder="Add factory feature..."
            className="flex-1 bg-[#141419] border border-white/[0.08] rounded-lg p-2 text-xs text-white"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold"
          >
            Add
          </button>
        </div>
      </section>

      {/* 05 DESCRIPTION */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          05 / OVERVIEW & DESCRIPTION
        </span>

        <textarea
          rows={5}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Long-form narrative describing provenance and key specifications..."
          className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-3 text-xs text-white"
        />
      </section>

      {/* 06 SEO & STATUS */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          06 / SEO & STATUS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Featured</label>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`w-full p-2.5 rounded-lg text-xs font-bold border transition-colors ${
                featured ? 'bg-[#f4d410]/15 text-[#f4d410] border-[#f4d410]/30' : 'bg-[#141419] border-white/10 text-zinc-400'
              }`}
            >
              {featured ? '★ Featured on Homepage' : 'Standard'}
            </button>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-if-empty"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white font-mono"
            />
          </div>
        </div>
      </section>

      {/* STICKY SAVE BAR (Prompt Requirement 22) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0f]/95 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Unsaved changes
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/cars"
              className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-white hover:bg-[#f4d410] text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Vehicle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
