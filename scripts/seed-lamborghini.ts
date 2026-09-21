import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Lamborghini Huracán EVO RWD & Similar Vehicles...');

  // 1. Primary Hero Car
  const heroCar = await prisma.vehicle.upsert({
    where: { slug: 'lamborghini-huracan-evo-rwd' },
    update: {
      make: 'Lamborghini',
      model: 'Huracán',
      variant: 'EVO RWD',
      year: 2026,
      price: 5454654,
      salePrice: null,
      mileage: 1200,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engine: 'V10 5.2L',
      engineSize: '5,204 cc',
      power: '640 HP',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      exteriorColor: 'Nero Noctis (Black)',
      interiorColor: 'Leather',
      stockNumber: '#39503',
      description:
        "The Lamborghini Huracán EVO RWD combines breathtaking performance with everyday usability. With its naturally aspirated V10, precision handling and unmistakable design, it's built for those who want more than just a drive — they want an experience.",
      status: 'published',
      featured: true,
      location: 'Auckland Flagship Showroom',
      condition: 'New / Showroom Edition',
    },
    create: {
      make: 'Lamborghini',
      model: 'Huracán',
      variant: 'EVO RWD',
      year: 2026,
      price: 5454654,
      mileage: 1200,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engine: 'V10 5.2L',
      engineSize: '5,204 cc',
      power: '640 HP',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      exteriorColor: 'Nero Noctis (Black)',
      interiorColor: 'Leather',
      stockNumber: '#39503',
      description:
        "The Lamborghini Huracán EVO RWD combines breathtaking performance with everyday usability. With its naturally aspirated V10, precision handling and unmistakable design, it's built for those who want more than just a drive — they want an experience.",
      status: 'published',
      featured: true,
      slug: 'lamborghini-huracan-evo-rwd',
      location: 'Auckland Flagship Showroom',
      condition: 'New / Showroom Edition',
    },
  });

  // Clear previous images & features for this vehicle
  await prisma.vehicleImage.deleteMany({ where: { vehicleId: heroCar.id } });
  await prisma.vehicleFeature.deleteMany({ where: { vehicleId: heroCar.id } });

  // 6 Gallery Images
  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=90',
      isPrimary: true,
      alt: 'Lamborghini Huracán EVO RWD Front 3/4 Exterior in Nero Noctis',
    },
    {
      url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=90',
      isPrimary: false,
      alt: 'Lamborghini Huracán EVO RWD Rear Aerodynamic Diffuser and Exhausts',
    },
    {
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90',
      isPrimary: false,
      alt: 'Lamborghini Huracán EVO RWD Aggressive Front Fascia',
    },
    {
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=90',
      isPrimary: false,
      alt: 'Lamborghini Cockpit & Alcantara Steering Wheel with Digital Cluster',
    },
    {
      url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=90',
      isPrimary: false,
      alt: 'Lamborghini Huracán Center Console ANIMA Selector & Jet-Fighter Starter',
    },
    {
      url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=90',
      isPrimary: false,
      alt: 'Lamborghini Huracán 20-inch Aesir Alloy Wheel with Giallo Brake Calipers',
    },
  ];

  for (const img of galleryImages) {
    await prisma.vehicleImage.create({
      data: {
        vehicleId: heroCar.id,
        url: img.url,
        isPrimary: img.isPrimary,
        alt: img.alt,
      },
    });
  }

  // Key Features
  const features = [
    'Naturally aspirated V10',
    'Iconic Lamborghini design',
    'Advanced AWD system',
    'Premium leather interior',
    'Track-tested performance',
    'Luxury meets functionality',
    'Lamborghini Dynamic Steering (LDS)',
    'P-TCS Performance Traction Control System',
    'Carbon Ceramic Brakes with Giallo Calipers',
    '8.4-inch HMI Capacitive Multi-touch Screen',
  ];

  for (const f of features) {
    await prisma.vehicleFeature.create({
      data: {
        vehicleId: heroCar.id,
        name: f,
      },
    });
  }

  // 2. Similar Vehicles shown in the mockup
  const similarCars = [
    {
      slug: 'lamborghini-huracan-evo',
      make: 'Lamborghini',
      model: 'Huracán EVO',
      variant: 'AWD Coupe',
      year: 2025,
      price: 5200000,
      transmission: 'Auto',
      drivetrain: 'AWD',
      bodyType: 'Coupe',
      stockNumber: '#39410',
      img: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=800&q=85',
    },
    {
      slug: 'lamborghini-huracan-sto',
      make: 'Lamborghini',
      model: 'Huracán STO',
      variant: 'Super Trofeo Omologata',
      year: 2025,
      price: 5800000,
      transmission: 'Auto',
      drivetrain: 'RWD',
      bodyType: 'Coupe',
      stockNumber: '#39411',
      img: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=85',
    },
    {
      slug: 'lamborghini-aventador',
      make: 'Lamborghini',
      model: 'Aventador',
      variant: 'LP 780-4 Ultimae',
      year: 2024,
      price: 7400000,
      transmission: 'Auto',
      drivetrain: 'AWD',
      bodyType: 'Coupe',
      stockNumber: '#39412',
      img: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=85',
    },
    {
      slug: 'lamborghini-urus',
      make: 'Lamborghini',
      model: 'Urus',
      variant: 'Performante V8 Bi-Turbo',
      year: 2024,
      price: 6800000,
      transmission: 'Auto',
      drivetrain: 'AWD',
      bodyType: 'SUV',
      stockNumber: '#39413',
      img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=85',
    },
  ];

  for (const car of similarCars) {
    const v = await prisma.vehicle.upsert({
      where: { slug: car.slug },
      update: {
        make: car.make,
        model: car.model,
        variant: car.variant,
        year: car.year,
        price: car.price,
        transmission: car.transmission,
        drivetrain: car.drivetrain,
        bodyType: car.bodyType,
        stockNumber: car.stockNumber,
        status: 'published',
      },
      create: {
        slug: car.slug,
        make: car.make,
        model: car.model,
        variant: car.variant,
        year: car.year,
        price: car.price,
        mileage: 2400,
        fuelType: 'Petrol',
        transmission: car.transmission,
        engine: 'V10 5.2L',
        power: '640 HP',
        drivetrain: car.drivetrain,
        bodyType: car.bodyType,
        stockNumber: car.stockNumber,
        description: `${car.year} ${car.make} ${car.model}. High-performance luxury supercar available at Nova Cars.`,
        status: 'published',
        featured: true,
        location: 'Auckland Showroom',
        condition: 'Pre-Owned Certified',
      },
    });

    await prisma.vehicleImage.deleteMany({ where: { vehicleId: v.id } });
    await prisma.vehicleImage.create({
      data: {
        vehicleId: v.id,
        url: car.img,
        isPrimary: true,
        alt: `${car.make} ${car.model}`,
      },
    });
  }

  console.log('Successfully seeded Lamborghini models!');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
