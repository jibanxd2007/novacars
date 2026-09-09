import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const applications = await prisma.financeApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
          },
        },
      },
    });
    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rl = checkRateLimit(`finance_${ip}`, 8, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      vehicleId,
      customerName,
      email,
      phone,
      vehiclePrice,
      deposit,
      loanTerm,
      interestRate,
      estimatedMonthly,
      employmentStatus,
      annualIncome,
      hp_field,
    } = body;

    // Honeypot spam protection
    if (hp_field) {
      return NextResponse.json({ success: true, id: 'mock' }, { status: 201 });
    }

    if (!customerName || !email || !phone || !vehiclePrice) {
      return NextResponse.json({ error: 'Please fill in all required customer details' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const application = await prisma.financeApplication.create({
      data: {
        vehicleId: vehicleId || null,
        customerName: customerName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        vehiclePrice: Number(vehiclePrice),
        deposit: Number(deposit) || 0,
        loanTerm: Number(loanTerm) || 48,
        interestRate: Number(interestRate) || 8.95,
        estimatedMonthly: Number(estimatedMonthly) || 0,
        employmentStatus: employmentStatus || 'Employed',
        annualIncome: annualIncome ? Number(annualIncome) : null,
        status: 'pending',
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

    const updated = await prisma.financeApplication.update({
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

    await prisma.financeApplication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
