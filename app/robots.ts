import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://invoxa.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/signup', '/forget-password'],
      disallow: ['/dashboard/', '/settings/', '/customers/', '/inventory/', '/invoice/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
