import React from 'react';
import VehicleForm from '@/components/admin/VehicleForm';

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <VehicleForm isEdit={false} />
    </div>
  );
}
