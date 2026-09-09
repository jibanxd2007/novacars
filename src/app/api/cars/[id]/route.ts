import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Search either by ID or by Slug
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { images, features, ...fields } = data;

    // First delete old relations if images/features were supplied
    if (images && Array.isArray(images)) {
      await prisma.vehicleImage.deleteMany({ where: { vehicleId: id } });
    }
    if (features && Array.isArray(features)) {
      await prisma.vehicleFeature.deleteMany({ where: { vehicleId: id } });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...fields,
        year: fields.year ? Number(fields.year) : undefined,
        price: fields.price ? Number(fields.price) : undefined,
        salePrice: fields.salePrice ? Number(fields.salePrice) : null,
        mileage: fields.mileage ? Number(fields.mileage) : undefined,
        doors: fields.doors ? Number(fields.doors) : undefined,
        seats: fields.seats ? Number(fields.seats) : undefined,
        featured: fields.featured !== undefined ? Boolean(fields.featured) : undefined,
        ...(images && {
          images: {
            create: images.map((img: any, idx: number) => ({
              url: typeof img === 'string' ? img : img.url,
              alt: typeof img === 'string' ? `${fields.make || ''} ${fields.model || ''}` : img.alt || '',
              isPrimary: idx === 0 || Boolean(img.isPrimary),
              sortOrder: idx,
            })),
          },
        }),
        ...(features && {
          features: {
            create: features.map((f: any) => ({
              name: typeof f === 'string' ? f : f.name,
            })),
          },
        }),
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
      },
    });

    return NextResponse.json(updatedVehicle);
  } catch (error: any) {
    console.error('Failed to update vehicle:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.vehicle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
