import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const bodyType = searchParams.get('bodyType');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minYear = searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined;
    const maxYear = searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const statusParam = searchParams.get('status');
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(searchParams.get('limit')) || 24);

    const where: any = {};

    if (statusParam && statusParam !== 'all') {
      where.status = statusParam;
    } else if (!statusParam) {
      // By default for public queries, only show published
      where.status = 'published';
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (make && make !== 'all') {
      where.make = { equals: make };
    }

    if (model && model !== 'all') {
      where.model = { contains: model };
    }

    if (bodyType && bodyType !== 'all') {
      where.bodyType = { equals: bodyType };
    }

    if (fuelType && fuelType !== 'all') {
      where.fuelType = { contains: fuelType };
    }

    if (transmission && transmission !== 'all') {
      where.transmission = { contains: transmission };
    }

    if (condition && condition !== 'all') {
      where.condition = { contains: condition };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minYear !== undefined || maxYear !== undefined) {
      where.year = {};
      if (minYear !== undefined) where.year.gte = minYear;
      if (maxYear !== undefined) where.year.lte = maxYear;
    }

    if (search.trim()) {
      where.OR = [
        { make: { contains: search } },
        { model: { contains: search } },
        { variant: { contains: search } },
        { description: { contains: search } },
        { stockNumber: { contains: search } },
      ];
    }

    // Determine sorting order
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'mileage_asc') orderBy = { mileage: 'asc' };
    if (sort === 'mileage_desc') orderBy = { mileage: 'desc' };
    if (sort === 'year_desc') orderBy = { year: 'desc' };
    if (sort === 'year_asc') orderBy = { year: 'asc' };

    const total = await prisma.vehicle.count({ where });
    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        features: true,
      },
    });

    return NextResponse.json({
      vehicles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error: any) {
    console.error('API /api/cars error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      make,
      model,
      variant,
      year,
      price,
      salePrice,
      mileage,
      fuelType,
      transmission,
      engine,
      engineSize,
      power,
      drivetrain,
      bodyType,
      doors,
      seats,
      exteriorColor,
      interiorColor,
      registration,
      vin,
      stockNumber,
      description,
      status,
      featured,
      slug: customSlug,
      location,
      condition,
      images = [],
      features = [],
    } = data;

    // Generate unique slug if not provided
    const baseSlug = customSlug || `${year}-${make}-${model}-${variant || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.vehicle.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // Generate stockNumber if not provided
    const stock = stockNumber || `NC-${Math.floor(1000 + Math.random() * 9000)}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        variant: variant || '',
        year: Number(year) || new Date().getFullYear(),
        price: Number(price) || 0,
        salePrice: salePrice ? Number(salePrice) : null,
        mileage: Number(mileage) || 0,
        fuelType: fuelType || 'Petrol',
        transmission: transmission || 'Automatic',
        engine: engine || '',
        engineSize: engineSize || '',
        power: power || '',
        drivetrain: drivetrain || 'AWD',
        bodyType: bodyType || 'SUV',
        doors: Number(doors) || 5,
        seats: Number(seats) || 5,
        exteriorColor: exteriorColor || '',
        interiorColor: interiorColor || '',
        registration: registration || '',
        vin: vin || '',
        stockNumber: stock,
        description: description || '',
        status: status || 'published',
        featured: Boolean(featured),
        slug: uniqueSlug,
        location: location || 'Auckland Showroom',
        condition: condition || 'Pre-Owned',
        images: {
          create: images.map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'string' ? `${make} ${model}` : img.alt || `${make} ${model}`,
            isPrimary: idx === 0 || Boolean(img.isPrimary),
            sortOrder: idx,
          })),
        },
        features: {
          create: features.map((f: any) => ({
            name: typeof f === 'string' ? f : f.name,
          })),
        },
      },
      include: {
        images: true,
        features: true,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create vehicle:', error);
    return NextResponse.json({ error: error.message || 'Failed to create vehicle' }, { status: 500 });
  }
}
