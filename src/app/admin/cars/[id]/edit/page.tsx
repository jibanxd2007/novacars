'use client';

import React, { useState, useEffect, use } from 'react';
import VehicleForm from '@/components/admin/VehicleForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCar() {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVehicle(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#f4d410] border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="text-xs text-zinc-500">Loading vehicle editor...</span>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Vehicle Not Found</h2>
        <Link href="/admin/cars" className="text-xs text-[#f4d410] hover:underline">
          ← Back to All Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VehicleForm initialData={vehicle} isEdit={true} />
    </div>
  );
}
