import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nova Cars database...');

  // 1. Create Default Admin User
  await prisma.user.upsert({
    where: { email: 'admin@novacars.com' },
    update: {},
    create: {
      name: 'Nova Concierge Admin',
      email: 'admin@novacars.com',
      password: 'admin', // Simple default demo password
      role: 'admin',
    },
  });

  // 2. Default Website Settings
  const settings = [
    { key: 'business_name', value: 'NOVA CARS' },
    { key: 'business_tagline', value: 'Drive Your Next Chapter' },
    { key: 'hero_title', value: 'Drive Your Next Chapter' },
    { key: 'hero_subtitle', value: 'Premium cars. Verified quality. Unmatched service. Your dream ride is just a click away.' },
    { key: 'phone', value: '+64 9 888 4321' },
    { key: 'email', value: 'concierge@novacars.co.nz' },
    { key: 'whatsapp', value: '+64218884321' },
    { key: 'address', value: '104 Great North Road, Ponsonby, Auckland 1021' },
    { key: 'opening_hours', value: 'Mon - Fri: 8:30 AM – 6:00 PM | Sat: 9:00 AM – 5:00 PM | Sun: By Appointment' },
    { key: 'instagram', value: 'https://instagram.com/novacars' },
    { key: 'facebook', value: 'https://facebook.com/novacars' },
    { key: 'youtube', value: 'https://youtube.com/@novacars' },
    { key: 'tiktok', value: 'https://tiktok.com/@novacars' },
    { key: 'currency_symbol', value: '$' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // Clear existing seed vehicles if any to ensure clean re-seeding
  await prisma.vehicleImage.deleteMany({});
  await prisma.vehicleFeature.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.testDrive.deleteMany({});
  await prisma.tradeIn.deleteMany({});
  await prisma.financeApplication.deleteMany({});
  await prisma.vehicle.deleteMany({});

  // 3. Realistic Luxury Vehicles
  const vehicles = [
    {
      make: 'BMW',
      model: 'X5',
      variant: 'xDrive40i M Sport',
      year: 2022,
      price: 74990,
      salePrice: 72990,
      mileage: 42500,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engine: '3.0L BMW TwinPower Turbo Inline-6',
      engineSize: '2,998 cc',
      power: '335 HP / 450 Nm',
      drivetrain: 'All-Wheel Drive (AWD)',
      bodyType: 'SUV',
      doors: 5,
      seats: 5,
      exteriorColor: 'Black Sapphire Metallic',
      interiorColor: 'Vernasca Perforated Black Leather',
      registration: 'NVA-051',
      vin: 'WBAJU82070L389102',
      stockNumber: 'NC-1021',
      description: 'The definitive benchmark of luxury performance. Finished in stunning Black Sapphire with gloss shadowline trim, this BMW X5 xDrive40i M Sport delivers peerless road presence and executive comfort. Meticulously inspected through our 150-point certified program, featuring a full dealership service record and single executive owner from new.',
      status: 'published',
      featured: true,
      slug: '2022-bmw-x5-xdrive40i-m-sport',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'BMW X5 Front 3/4' },
        { url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'BMW X5 Luxury Interior Cabin' },
        { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'BMW X5 Rear Profile' },
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'BMW Cockpit Dashboard' }
      ],
      features: [
        'M Sport Aerodynamics Package',
        '22-inch M V-Spoke Alloy Wheels',
        'Panoramic Sky Lounge LED Glass Roof',
        'Harman Kardon Surround Sound System (16 Speakers)',
        'BMW Live Cockpit Professional with Dual 12.3-inch Displays',
        'Head-Up Display with Augmented Navigation',
        'Active Cruise Control with Stop & Go Function',
        'Parking Assistant Plus with 360-Degree Surround Cameras',
        'Ventilated & Heated Front Comfort Seats with Memory',
        'Wireless Apple CarPlay & Android Auto'
      ]
    },
    {
      make: 'Mercedes-Benz',
      model: 'E-Class',
      variant: 'E 350 AMG Line',
      year: 2023,
      price: 72500,
      mileage: 21000,
      fuelType: 'Petrol Hybrid',
      transmission: '9G-Tronic Automatic',
      engine: '2.0L Turbo Inline-4 with EQ Boost',
      engineSize: '1,991 cc',
      power: '255 HP + 20 HP EQ Boost',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      bodyType: 'Sedan',
      doors: 4,
      seats: 5,
      exteriorColor: 'Polar White',
      interiorColor: 'Nappa Black Leather with Open-Pore Ash Wood',
      registration: 'NVA-082',
      vin: 'W1KZF4GB8PA912831',
      stockNumber: 'NC-1022',
      description: 'Elegance personified. This 2023 Mercedes-Benz E 350 AMG Line merges timeless luxury aesthetics with bleeding-edge intelligence. Featuring the iconic diamond grille, AMG body styling, and Burmester sound architecture. Hand-selected and delivered in immaculate condition with remainder of manufacturer warranty.',
      status: 'published',
      featured: true,
      slug: '2023-mercedes-benz-e-class-e350-amg-line',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Mercedes E-Class Front Angle' },
        { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Mercedes Luxury Cockpit' },
        { url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Mercedes Profile View' },
        { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Mercedes Ambient Lighting Interior' }
      ],
      features: [
        'AMG Sports Styling Package with Diamond Radiator Grille',
        'Burmester 13-Speaker 590W Surround Sound',
        'MBUX Multimedia System with "Hey Mercedes" Voice Control',
        'Dual 12.3-inch Widescreen Digital Instrument Displays',
        '64-Color Ambient Interior Mood Lighting',
        'Active Distance Assist DISTRONIC with Steering Assist',
        'Multibeam LED Headlamps with Adaptive Highbeam Assist Plus',
        'Heated Front Seats with Electric Lumbar & Memory',
        'Panoramic Sliding Sunroof'
      ]
    },
    {
      make: 'Audi',
      model: 'Q7',
      variant: '55 TFSI Quattro S Line',
      year: 2023,
      price: 88900,
      salePrice: 86500,
      mileage: 18400,
      fuelType: 'Petrol',
      transmission: 'Tiptronic Automatic',
      engine: '3.0L Turbocharged V6 Mild-Hybrid',
      engineSize: '2,995 cc',
      power: '335 HP / 500 Nm',
      drivetrain: 'Quattro Permanent All-Wheel Drive',
      bodyType: 'SUV',
      doors: 5,
      seats: 7,
      exteriorColor: 'Daytona Grey Pearl Effect',
      interiorColor: 'Valcona Diamond Stitched Rotor Grey Leather',
      registration: 'NVA-117',
      vin: 'WAUZZZ4M3ND038419',
      stockNumber: 'NC-1023',
      description: 'The pinnacle 7-passenger grand tourer. Finished in Audi exclusive Daytona Grey Pearl with Black Optics trim, this Q7 55 TFSI S Line combines immense Quattro grip, air suspension ride serenity, and executive 3-row capability. Serviced exclusively through Audi genuine dealership network.',
      status: 'published',
      featured: true,
      slug: '2023-audi-q7-55-tfsi-quattro-s-line',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Audi Q7 Front 3/4' },
        { url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Audi Virtual Cockpit' },
        { url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Audi Q7 Dynamic Rear' }
      ],
      features: [
        'S Line Black Exterior Styling Package',
        'Adaptive Air Suspension with Continuous Damping',
        'Audi Virtual Cockpit Plus (12.3-inch Full HD)',
        'Dual Touchscreen MMI Navigation Plus with MMI Touch Response',
        'Bang & Olufsen 3D Premium Sound System',
        'Electric Folding 3rd Row (7 Seats)',
        '360-Degree Camera with 3D Virtual Surround View',
        'Panoramic Dual-Pane Sunroof',
        'Matrix LED Headlights with Dynamic Indicators'
      ]
    },
    {
      make: 'Land Rover',
      model: 'Range Rover Sport',
      variant: 'HSE Dynamic P400',
      year: 2022,
      price: 112000,
      mileage: 31200,
      fuelType: 'Petrol Hybrid',
      transmission: '8-Speed Automatic',
      engine: '3.0L i6 Turbocharged & Supercharged MHEV',
      engineSize: '2,996 cc',
      power: '395 HP / 550 Nm',
      drivetrain: 'Intelligent All-Wheel Drive (iAWD)',
      bodyType: 'SUV',
      doors: 5,
      seats: 5,
      exteriorColor: 'Santorini Black Metallic',
      interiorColor: 'Perforated Windsor Ebony / Ivory Leather',
      registration: 'NVA-770',
      vin: 'SALWR2V42NA889312',
      stockNumber: 'NC-1024',
      description: 'Commanding stature, unmistakable presence. This Range Rover Sport HSE Dynamic in Santorini Black delivers genuine British luxury with sports agility. Equipped with configurable dynamics, Meridian surround acoustics, and electronic air suspension. Presented in immaculate showroom condition.',
      status: 'published',
      featured: true,
      slug: '2022-range-rover-sport-hse-dynamic',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Range Rover Sport Front Angle' },
        { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Range Rover Luxury Cabin' },
        { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Range Rover Exterior Stance' }
      ],
      features: [
        'Meridian Surround Audio System (825W, 19 Speakers)',
        'Electronic Air Suspension with Terrain Response 2',
        '21-inch 9-Spoke Gloss Black Alloy Wheels',
        'Sliding Panoramic Roof with Gesture Sunblind',
        'Heated & Cooled Front Seats with Heated Rear Seats',
        'Adaptive Cruise Control with Steering Assist',
        'Pixel LED Headlights with Signature DRL',
        'Soft Door Close & Powered Gesture Tailgate'
      ]
    },
    {
      make: 'Porsche',
      model: 'Cayenne',
      variant: 'GTS Coupe',
      year: 2022,
      price: 128500,
      mileage: 24000,
      fuelType: 'Petrol',
      transmission: '8-Speed Tiptronic S',
      engine: '4.0L Twin-Turbocharged V8',
      engineSize: '3,996 cc',
      power: '453 HP / 620 Nm',
      drivetrain: 'Porsche Traction Management AWD',
      bodyType: 'Coupe',
      doors: 5,
      seats: 5,
      exteriorColor: 'Carmine Red',
      interiorColor: 'GTS Package Alcantara & Black Leather with Carmine Stitching',
      registration: 'NVA-911',
      vin: 'WP1AA2AY2NDA01928',
      stockNumber: 'NC-1025',
      description: 'The sports car among SUVs. This Porsche Cayenne GTS Coupe boasts an intoxicating 4.0-liter Twin-Turbo V8 and Porsche Active Suspension Management. Clothed in legendary Carmine Red with Sport Design body styling, sport exhaust with dual bronze oval tips, and adaptive rear spoiler.',
      status: 'published',
      featured: true,
      slug: '2022-porsche-cayenne-gts-coupe',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Porsche Cayenne Coupe Profile' },
        { url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Porsche Sport Chrono Dashboard' },
        { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Porsche Cabin Detail' }
      ],
      features: [
        'Sport Chrono Package with Mode Switch',
        'Sports Exhaust System with Twin Center Tailpipes',
        '21-inch RS Spyder Design Wheels in Satin Black',
        'Adaptive Air Suspension including PASM (Lowered 10mm)',
        'BOSE Surround Sound System with 14 Speakers',
        'Carbon Fiber Roof with Lightweight Sport Package',
        'Porsche Dynamic Light System Plus (PDLS+)',
        'Adaptive 18-Way Electric Sports Seats'
      ]
    },
    {
      make: 'Land Rover',
      model: 'Defender',
      variant: '110 X-Dynamic SE',
      year: 2023,
      price: 89990,
      mileage: 16500,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      engine: '3.0L i6 Twin-Turbocharged Diesel MHEV',
      engineSize: '2,996 cc',
      power: '296 HP / 650 Nm',
      drivetrain: 'Permanent 4WD with Twin-Speed Transfer Box',
      bodyType: 'SUV',
      doors: 5,
      seats: 5,
      exteriorColor: 'Carpathian Grey Satin',
      interiorColor: 'Ebony Grained Leather with Robustec Accents',
      registration: 'NVA-444',
      vin: 'SALER2V46PA831920',
      stockNumber: 'NC-1026',
      description: 'An unstoppable icon reimagined. Finished in factory Carpathian Grey satin protective film with Black Contrast roof and gloss black chequer plate detailing. Delivers authentic go-anywhere capability paired with whisper-quiet highway composure.',
      status: 'published',
      featured: true,
      slug: '2023-land-rover-defender-110-x-dynamic',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Land Rover Defender Adventure Stance' },
        { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Defender Interior Cockpit' }
      ],
      features: [
        'Electronic Air Suspension with Adaptive Dynamics',
        'Terrain Response with Configurable Off-Road Modes',
        'ClearSight Ground View 3D Surround Camera',
        '11.4-inch Pivi Pro Infotainment with Connected Navigation',
        'Meridian Sound System 400W',
        'Sliding Panoramic Roof',
        'Black Exterior Pack & Black Roof Rails',
        'Electrically Deployable Towbar'
      ]
    },
    {
      make: 'Jaguar',
      model: 'F-Pace',
      variant: 'SVR Edition 1988',
      year: 2023,
      price: 105000,
      mileage: 14200,
      fuelType: 'Petrol',
      transmission: '8-Speed Automatic',
      engine: '5.0L Supercharged V8',
      engineSize: '5,000 cc',
      power: '542 HP / 700 Nm',
      drivetrain: 'All-Wheel Drive with Electronic Active Differential',
      bodyType: 'SUV',
      doors: 5,
      seats: 5,
      exteriorColor: 'Midnight Amethyst Gloss',
      interiorColor: 'Semi-Aniline Ebony Leather with Sunset Gold Detailing',
      registration: 'NVA-550',
      vin: 'SAJWA2V42NA994812',
      stockNumber: 'NC-1027',
      description: 'One of only 394 examples worldwide celebrating Jaguar’s 1988 Le Mans victory. Armed with a thunderous 542 HP 5.0-litre Supercharged V8 catapulting from 0-100 km/h in 4.0 seconds. Bespoke Midnight Amethyst paint paired with Champagne Gold forged wheels.',
      status: 'published',
      featured: false,
      slug: '2023-jaguar-f-pace-svr-edition-1988',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Jaguar F-Pace SVR Angle' },
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Jaguar SVR Cockpit' }
      ],
      features: [
        'Edition 1988 Limited Commemorative Build Plate',
        '22-inch Forged Alloy Wheels in Champagne Gold Satin',
        'Switchable Active Sports Exhaust System with Quad Tailpipes',
        'Meridian 650W Surround Sound System',
        'SVR Performance Heated & Cooled Semi-Aniline Leather Seats',
        'Open-Pore Carbon Fiber Dashboard Finishers',
        'Pixel LED Headlights with Signature "Double J" DRL'
      ]
    },
    {
      make: 'Tesla',
      model: 'Model S',
      variant: 'Plaid Tri-Motor AWD',
      year: 2023,
      price: 94900,
      mileage: 19800,
      fuelType: 'Electric',
      transmission: 'Direct Drive Single-Speed',
      engine: 'Tri-Motor Electric All-Wheel Drive',
      engineSize: 'Electric (100 kWh)',
      power: '1,020 HP / 0-100 km/h in 2.1s',
      drivetrain: 'All-Wheel Drive (AWD)',
      bodyType: 'Sedan',
      doors: 5,
      seats: 5,
      exteriorColor: 'Solid Black',
      interiorColor: 'All Black Premium Interior with Carbon Fiber Decor',
      registration: 'NVA-789',
      vin: '5YJSA1E67PF991240',
      stockNumber: 'NC-1028',
      description: 'Beyond supercar acceleration in a whisper-quiet executive cruiser. 1,020 horsepower, 600+ km of range, tri-zone climate, and 22-speaker audio system with active noise cancelling. Mint condition with Full Self-Driving Computer package included.',
      status: 'published',
      featured: false,
      slug: '2023-tesla-model-s-plaid',
      location: 'Auckland Showroom',
      condition: 'Pre-Owned Certified',
      images: [
        { url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80', isPrimary: true, alt: 'Tesla Model S Plaid Front' },
        { url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80', isPrimary: false, alt: 'Tesla Minimalist Cockpit' }
      ],
      features: [
        'Tri-Motor All-Wheel Drive with Torque Vectoring',
        '17-inch Cinematic Display with 2200x1300 Resolution',
        'Rear 8-inch Passenger Gaming & Media Display',
        '22-Speaker 960W Audio with Active Road Noise Reduction',
        'Full Self-Driving Capability Package Enabled',
        'Adaptive Air Suspension with GPS Location Geofencing',
        'Heated & Ventilated Front Seats + Heated Rear Seats'
      ]
    }
  ];

  for (const v of vehicles) {
    const { images, features, ...carData } = v;
    const createdVehicle = await prisma.vehicle.create({
      data: carData,
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.vehicleImage.create({
        data: {
          vehicleId: createdVehicle.id,
          url: images[i].url,
          alt: images[i].alt,
          isPrimary: images[i].isPrimary,
          sortOrder: i,
        },
      });
    }

    for (const f of features) {
      await prisma.vehicleFeature.create({
        data: {
          vehicleId: createdVehicle.id,
          name: f,
        },
      });
    }
  }

  // 4. Sample realistic enquiries & test drive leads
  const firstCar = await prisma.vehicle.findFirst();

  if (firstCar) {
    await prisma.enquiry.create({
      data: {
        vehicleId: firstCar.id,
        customerName: 'Marcus Sterling',
        email: 'marcus.sterling@aucklandholdings.co.nz',
        phone: '+64 21 555 9210',
        message: 'Interested in trading my 2020 Macan for this vehicle. Can you confirm if the factory warranty is transferable?',
        preferredContact: 'phone',
        status: 'new',
      },
    });

    await prisma.testDrive.create({
      data: {
        vehicleId: firstCar.id,
        customerName: 'Elena Rostova',
        email: 'elena.rostova@gmail.com',
        phone: '+64 27 492 8112',
        date: '2026-09-12',
        time: '14:30',
        message: 'Looking forward to testing the vehicle on the motorway test route.',
        status: 'confirmed',
      },
    });

    await prisma.financeApplication.create({
      data: {
        vehicleId: firstCar.id,
        customerName: 'David Chen',
        email: 'd.chen@chenarchitects.com',
        phone: '+64 22 809 1144',
        vehiclePrice: firstCar.price,
        deposit: 20000,
        loanTerm: 48,
        interestRate: 8.95,
        estimatedMonthly: 1362,
        employmentStatus: 'Self-Employed Director',
        annualIncome: 185000,
        status: 'pending',
      },
    });
  }

  await prisma.tradeIn.create({
    data: {
      customerName: 'Alistair Vance',
      email: 'a.vance@vancetech.io',
      phone: '+64 21 733 9081',
      make: 'Audi',
      model: 'RS5 Sportback',
      year: 2021,
      mileage: 38000,
      registration: 'AUD-882',
      condition: 'Excellent',
      expectedPrice: 65000,
      message: 'Full service history at Continental Cars. One owner, ceramic coated from day one.',
      photos: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80',
      status: 'pending',
    },
  });

  console.log('Nova Cars database successfully seeded with 8 luxury vehicles, settings, and demo leads!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
