import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novacars.co.nz';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/finance`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trade-in`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic vehicle pages from database
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    });

    const vehiclePages: MetadataRoute.Sitemap = vehicles.map((v) => ({
      url: `${baseUrl}/cars/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    return [...staticPages, ...vehiclePages];
  } catch (err) {
    return staticPages;
  }
}
