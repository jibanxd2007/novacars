'use client';

import React, { useState } from 'react';
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

  // Specs
  const [mileage, setMileage] = useState(initialData?.mileage || '');
  const [fuelType, setFuelType] = useState(initialData?.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState(initialData?.transmission || 'Automatic');
  const [bodyType, setBodyType] = useState(initialData?.bodyType || 'SUV');
  const [engine, setEngine] = useState(initialData?.engine || '');
  const [engineSize, setEngineSize] = useState(initialData?.engineSize || '');
  const [power, setPower] = useState(initialData?.power || '');
  const [drivetrain, setDrivetrain] = useState(initialData?.drivetrain || 'All-Wheel Drive (AWD)');
  const [doors, setDoors] = useState(initialData?.doors || 5);
  const [seats, setSeats] = useState(initialData?.seats || 5);
  const [exteriorColor, setExteriorColor] = useState(initialData?.exteriorColor || '');
  const [interiorColor, setInteriorColor] = useState(initialData?.interiorColor || '');
  const [vin, setVin] = useState(initialData?.vin || '');

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

      {/* 01 BASIC INFORMATION */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          01 / BASIC INFORMATION
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Make *</label>
            <input
              type="text"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. BMW"
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
              placeholder="e.g. X5"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Variant</label>
            <input
              type="text"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="e.g. xDrive40i M Sport"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Year *</label>
            <input
              type="number"
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Price ($NZD) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="74990"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Sale Price</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="Optional"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Stock #</label>
            <input
              type="text"
              value={stockNumber}
              onChange={(e) => setStockNumber(e.target.value)}
              placeholder="NC-1029"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white font-mono"
            />
          </div>
        </div>
      </section>

      {/* 02 VEHICLE DETAILS */}
      <section className="bg-[#0c0c0f] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
        <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-500 block border-b border-white/5 pb-2">
          02 / SPECIFICATIONS
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
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Body Style</label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            >
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Coupe">Coupe</option>
            </select>
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
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Direct Drive">Direct Drive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Engine</label>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder="3.0L TwinPower Turbo"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Engine CC</label>
            <input
              type="text"
              value={engineSize}
              onChange={(e) => setEngineSize(e.target.value)}
              placeholder="2,998 cc"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">Power Output</label>
            <input
              type="text"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="335 HP"
              className="w-full bg-[#141419] border border-white/[0.08] rounded-lg p-2.5 text-xs text-white"
            />
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
