import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const tradeIns = await prisma.tradeIn.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tradeIns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rl = checkRateLimit(`tradein_${ip}`, 8, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      make,
      model,
      year,
      mileage,
      registration,
      condition,
      expectedPrice,
      message,
      photos,
      hp_field,
    } = body;

    // Honeypot trap
    if (hp_field) {
      return NextResponse.json({ success: true, id: 'mock' }, { status: 201 });
    }

    if (!customerName || !email || !phone || !make || !model) {
      return NextResponse.json({ error: 'Please provide all required vehicle and contact details' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const tradeIn = await prisma.tradeIn.create({
      data: {
        customerName: customerName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        make: make.trim(),
        model: model.trim(),
        year: Number(year) || new Date().getFullYear(),
        mileage: Number(mileage) || 0,
        registration: registration ? registration.trim() : '',
        condition: condition || 'Good',
        expectedPrice: expectedPrice ? Number(expectedPrice) : null,
        message: message ? message.trim() : '',
        photos: photos || '',
        status: 'pending',
      },
    });

    return NextResponse.json(tradeIn, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

    const updated = await prisma.tradeIn.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.tradeIn.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
