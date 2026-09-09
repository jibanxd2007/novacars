# NOVA CARS — Luxury Automotive Dealership Platform & Admin Panel

Build a production-grade, full-stack automotive dealership web platform for **NOVA CARS**, matching the dark luxury aesthetic of the provided reference visual (rich jet-black surfaces, warm amber/gold accents, crisp automotive typography, editorial cards) and the functional dealership architecture inspired by CAR4U NZ.

---

## User Review Required

> [!IMPORTANT]
> **Database Architecture**: We will use **Prisma ORM with SQLite** for local execution. This guarantees zero configuration, instant migrations, fully typed models, high performance, and complete portability without needing an external PostgreSQL or Docker instance running. The schema and queries are completely standard SQL and can be swapped to PostgreSQL in one line if deployed to production.
> 
> **Admin Credentials**: Default credentials will be pre-configured:
> - Email: `admin@novacars.com`
> - Password: `admin` (or any custom one you specify)
> - Quick "Demo Admin Login" button provided on the login page for instant access during testing.

---

## Proposed Changes

### 1. Design System & Aesthetics (Matching Reference Image)
- **Palette**:
  - Background: `#08080a` (Deep obsidian black)
  - Surface & Cards: `#111114`, `#16161a` (Sleek dark charcoal with subtle 1px border `rgba(255,255,255,0.08)`)
  - Accent / Brand Gold: `#E5A93B` / `#F59E0B` (Vibrant warm gold matching the reference "Drive Your Next Chapter", badges, pill buttons, and accents)
  - Text: Primary `#f4f4f5`, Secondary `#a1a1aa`, Muted `#71717a`
- **Typography & Details**:
  - Modern sans-serif (Inter / Plus Jakarta Sans / Outfit)
  - Gold badges (`BEST SELLER`, `FEATURED`, `NEW ARRIVAL`)
  - Round circular arrow buttons on vehicle cards as shown in the reference
  - 4-column feature highlights and 2x2 stat metrics (`500+ Happy Customers`, `8+ Luxury Brands`, `100+ Point Inspection`, `1,200+ Cars Delivered`)

---

### 2. Full-Stack Project Setup
- Initialize Next.js 14+ with TypeScript, Tailwind CSS, and Lucide icons.
- Set up Prisma ORM with SQLite schema:
  - `User`: Admin credentials & roles
  - `Vehicle`: Comprehensive automotive schema (make, model, variant, year, price, salePrice, mileage, fuelType, transmission, engine, engineSize, power, drivetrain, bodyType, doors, seats, exteriorColor, interiorColor, registration, vin, stockNumber, description, status, featured, slug)
  - `VehicleImage`: urls, alt, sortOrder, isPrimary
  - `VehicleFeature`: feature name tags
  - `Enquiry`: vehicle link, customer name, email, phone, message, status
  - `TestDrive`: vehicle link, customer info, preferred date & time, status
  - `TradeIn`: customer info, car details (make, model, year, mileage, condition, expected price), photos, status
  - `FinanceApplication`: vehicle link, customer info, deposit, term, employment, income, status
  - `Setting`: key-value website settings (hero headlines, phone, email, WhatsApp, address, social links)
- Seed script with **8+ realistic luxury vehicles** (BMW X5 M Sport, Mercedes-Benz E-Class AMG, Audi Q7 Quattro, Range Rover Sport HSE, Porsche Cayenne GTS, Land Rover Defender, Jaguar F-Pace, Tesla Model S) with rich specifications, features, and high-resolution automotive imagery.

---

### 3. Public Web Pages
#### [NEW] `src/app/page.tsx` (Homepage)
- **Hero**: Cinematic dark luxury showcase with gold headline *"Drive Your Next Chapter"*, subheadline, CTA buttons (*"Explore Inventory"*, *"Value My Trade"*).
- **Vehicle Search Bar**: Live search with Brand, Price Range, Transmission, and Location / Body filters that seamlessly queries inventory.
- **Popular Brands Ticker**: BMW, Mercedes-Benz, Audi, Porsche, Jaguar, Land Rover, Range Rover, Tesla.
- **The Finest Selection**: Featured vehicles grid matching the reference image layout with photo, badge, title, specs, price, and circular gold arrow button.
- **A Premium Experience**: Split section with luxury interior photography and 4 core value pillars (Expert Guidance, Transparent Deals, Quick Process, After-Sales Support).
- **Built on Trust. Driven by Excellence.**: Editorial story with 2x2 stat grid (500+ Happy Customers, 8+ Luxury Brands, 100+ Inspection Points, 1,200+ Delivered).
- **Testimonials**: *"Real People. Real Journeys."* with 5-star ratings and customer stories.
- **Dream Car Banner**: Sleek full-width call-to-action banner with gold button.
- **Footer**: Full navigation, opening hours, WhatsApp link, contact details, and newsletter.

#### [NEW] `src/app/cars/page.tsx` (Inventory Browsing)
- Real-time multi-filter sidebar: Make, Model, Body Type, Price Range, Year Range, Fuel Type, Transmission, Condition.
- Live keyword search, sorting (Newest, Price: Low-to-High, Price: High-to-Low, Lowest Mileage, Year).
- View mode switcher (Grid vs. List view), active filter chips, pagination, and results counter.
- Responsive mobile filter drawer.

#### [NEW] `src/app/cars/[slug]/page.tsx` (Vehicle Detail Page)
- High-resolution gallery with interactive thumbnail selector and full-screen lightbox zoom.
- Key specification summary bar (Year, Mileage, Fuel, Transmission, Drivetrain, Engine).
- 18+ Field Technical Specifications breakdown table (Dimensions, Engine CC, Power, Doors, Seats, VIN, Stock #).
- Features & Equipment checklist grid (Adaptive Cruise, Sunroof, Leather Seats, 360 Camera, etc.).
- Vehicle Overview description.
- Sticky Action Card: Enquire Now form, WhatsApp dealer button, Call dealer, and Book Test Drive modal.
- Built-in Finance Calculator pre-filled with this vehicle's price.
- Similar Recommended Vehicles carousel/grid.

#### [NEW] `src/app/finance/page.tsx` (Finance Page)
- Interactive loan calculator with real-time sliders for Vehicle Price, Deposit, Loan Term (12–84 months), and Interest Rate.
- Monthly repayment, total interest, and total payable calculations.
- Seamless "Apply for Finance" pre-approval application form submitting to database.

#### [NEW] `src/app/trade-in/page.tsx` (Trade-In / Valuation)
- "What's Your Car Worth?" interactive multi-step valuation form.
- Inputs for Make, Model, Year, Mileage, Condition, Registration, Expected Price, and vehicle photo upload/URLs.
- Saves directly to the database for admin review.

#### [NEW] `src/app/about/page.tsx` & `src/app/contact/page.tsx`
- About Nova Cars story, heritage, quality promise, and 150-point inspection protocol.
- Contact page with dealer address, showroom opening hours, Google Maps visual embed, direct WhatsApp chat, and inquiry form.

---

### 4. Admin Portal (`/admin`)
#### [NEW] `src/app/admin/login/page.tsx`
- Secure dark-themed authentication with quick-fill demo credentials.

#### [NEW] `src/app/admin/page.tsx` (Dashboard Overview)
- Metric KPI cards: Total Inventory, Active Listings, Sold, Drafts, Enquiries, Test Drives, Trade-Ins, Finance Leads.
- Inventory statistics breakdown by Make and Status.
- Recent Inquiries & Test Drive requests feed with quick status toggles.

#### [NEW] `src/app/admin/cars/page.tsx` (Vehicle CMS Table)
- Data table: Image, Vehicle Title, Stock #, Price, Year, Mileage, Status Badge (Published, Draft, Reserved, Sold), Featured toggle, Actions (Edit, Duplicate, Delete, View).
- Quick filter by status and keyword search.

#### [NEW] `src/app/admin/cars/new/page.tsx` & `src/app/admin/cars/[id]/edit/page.tsx`
- Multi-section vehicle creation and editor:
  - Basic Info: Make, Model, Variant, Year, Price, Sale Price, Stock Number, Registration, Condition.
  - Technical Specs: Mileage, Fuel Type, Transmission, Engine Size, Power, Drivetrain, Body Type, Doors, Seats, Colors, VIN.
  - Image Manager: Drag-and-drop / URL / file upload, thumbnail preview, set primary cover, reorder, delete.
  - Features Manager: Dynamic chip tags (add/remove features like "Panoramic Sunroof", "Heated Seats").
  - Description: Long-form overview.
  - SEO & Publishing: Status (Draft, Published, Reserved, Sold), Featured switch, custom slug.

#### [NEW] `src/app/admin/enquiries/page.tsx` & `/admin/test-drives` & `/admin/trade-ins` & `/admin/finance`
- Manage customer leads with status pipelines: `New`, `Contacted`, `Follow-up`, `Converted`, `Closed`.
- Detailed modal/drawer to read messages, inspect vehicle details, and update notes.

#### [NEW] `src/app/admin/settings/page.tsx`
- Manage dealership business details (Phone, Email, WhatsApp, Showroom Address, Hours, Social Media links, Hero text).

---

## Verification Plan

### Automated & Build Verification
1. `npm run build` — Verify TypeScript compile without errors and valid Next.js server/client bundle.
2. `npx prisma db push` & `npx prisma db seed` — Verify schema migration and initial seed data creation.
3. API route tests (`/api/cars`, `/api/enquiries`, `/api/trade-ins`, `/api/finance`).

### Browser Subagent & Visual Verification
1. Launch browser subagent to test:
   - Homepage layout matching the reference image (colors, hero, search bar, vehicle cards, stats).
   - Live search bar navigation to filtered inventory results.
   - Filter adjustments on `/cars` (price, make, fuel type) and sort changes.
   - Vehicle detail page (`/cars/[slug]`) image gallery, specs, and enquiry form submission.
   - Finance calculator slider computations and submission.
   - Trade-in valuation form submission.
   - Admin login, viewing dashboard KPIs, adding/editing a vehicle, and updating lead status.
