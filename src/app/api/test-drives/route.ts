import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const testDrives = await prisma.testDrive.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            stockNumber: true,
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });
    return NextResponse.json(testDrives);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rl = checkRateLimit(`testdrive_${ip}`, 8, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many test drive requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { vehicleId, customerName, email, phone, date, time, message, hp_field } = body;

    // Honeypot spam trap
    if (hp_field) {
      return NextResponse.json({ success: true, id: 'mock' }, { status: 201 });
    }

    if (!customerName || !email || !phone || !date) {
      return NextResponse.json({ error: 'Customer name, email, phone, and date are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const testDrive = await prisma.testDrive.create({
      data: {
        vehicleId: vehicleId || null,
        customerName: customerName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        date,
        time: time || '10:00 AM',
        message: message ? message.trim() : '',
        status: 'requested',
      },
    });

    return NextResponse.json(testDrive, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

    const updated = await prisma.testDrive.update({
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

    await prisma.testDrive.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
