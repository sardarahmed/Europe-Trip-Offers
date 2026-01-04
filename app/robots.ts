import { MetadataRoute } from 'next';

const BASE_URL = 'https://europetripoffers.com'; // Change to real domain

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
