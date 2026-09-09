import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVA CARS — Premium Luxury Automotive Dealership",
  description: "Drive Your Next Chapter. Explore New Zealand's finest selection of hand-picked luxury vehicles, sports coupes, and executive SUVs.",
  keywords: ["luxury cars", "automotive dealership", "BMW", "Mercedes-Benz", "Porsche", "Audi", "Range Rover", "Nova Cars"],
  openGraph: {
    title: "NOVA CARS — Premium Luxury Automotive Dealership",
    description: "Drive Your Next Chapter. Hand-picked luxury vehicles, verified quality, unmatched service.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#08080a] text-[#f4f4f6] antialiased selection:bg-[#f4d410] selection:text-black">
        {children}
      </body>
    </html>
  );
}
