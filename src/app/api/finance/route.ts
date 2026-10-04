import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendInquiryNotification } from '@/lib/mail';

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
      // Extended 5-step fields from comprehensive application
      tradeInValue,
      dob,
      licenceType,
      licenceNumber,
      licenceVersion,
      vehicleInterested,
      residentialStatus,
      address,
      timeAtAddress,
      maritalStatus,
      dependents,
      employerName,
      jobTitle,
      timeAtEmployer,
      employerPhone,
      netIncome,
      otherIncome,
      rentMortgage,
      livingExpenses,
      otherLoans,
      notes,
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

    // Lookup vehicle info if available
    let vehicle = null;
    if (vehicleId) {
      try {
        vehicle = await prisma.vehicle.findUnique({
          where: { id: vehicleId },
          select: { make: true, model: true, year: true, stockNumber: true, price: true },
        });
      } catch (e) {
        console.error('Vehicle lookup error for email:', e);
      }
    }

    // Dispatch email notification to sales@novaauto.co.nz
    sendInquiryNotification({
      type: 'Finance Pre-Approval',
      customerName: application.customerName,
      customerEmail: application.email,
      customerPhone: application.phone,
      vehicleDetails: vehicle || (vehicleInterested ? { make: vehicleInterested } : undefined),
      message: notes || undefined,
      extraDetails: {
        'Vehicle Price': `$${application.vehiclePrice.toLocaleString()}`,
        'Cash Deposit': `$${application.deposit.toLocaleString()}`,
        'Trade-In Value': tradeInValue ? `$${Number(tradeInValue).toLocaleString()}` : '$0',
        'Net Amount Borrowed': `$${Math.max(0, application.vehiclePrice - application.deposit - (Number(tradeInValue) || 0)).toLocaleString()}`,
        'Loan Term': `${application.loanTerm} Months`,
        'Estimated Repayment': `$${application.estimatedMonthly.toLocaleString()}/mo ($${Math.round(application.estimatedMonthly / 4.33)}/wk)`,
        'Interest Rate': `${application.interestRate}% p.a.`,
        'Date of Birth': dob || 'Not provided',
        'Driver Licence': licenceType ? `${licenceType} (No: ${licenceNumber || 'N/A'}, Ver: ${licenceVersion || 'N/A'})` : 'Not provided',
        'Residential Status': residentialStatus || 'Not provided',
        'Current Address': address || 'Not provided',
        'Time at Address': timeAtAddress || 'Not provided',
        'Marital Status': maritalStatus || 'Not provided',
        'Dependents': dependents || '0',
        'Employment Status': application.employmentStatus,
        'Employer': employerName ? `${employerName} (${jobTitle || 'Role N/A'})` : 'Not provided',
        'Time with Employer': timeAtEmployer || 'Not provided',
        'Employer Contact': employerPhone || 'Not provided',
        'Net Income': netIncome || (application.annualIncome ? `$${application.annualIncome.toLocaleString()}/yr` : 'Not specified'),
        'Other Income': otherIncome || 'None',
        'Rent / Mortgage': rentMortgage || 'None',
        'Living Expenses': livingExpenses || 'Standard',
        'Other Debt Commitments': otherLoans || 'None',
      },
    }).catch((e) => console.error('Failed to dispatch finance notification:', e));

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
