import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Init Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = 'https://europetripoffers.com'; // Change to your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Fetch Dynamic Data
    const { data: cities } = await supabase.from('cities').select('slug, created_at');
    const { data: activities } = await supabase.from('activities').select('slug, created_at');
    const { data: posts } = await supabase.from('posts').select('slug, published_at');
    const { data: stores } = await supabase.from('stores').select('slug');

    const sitemap: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/cities`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/offers`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    // 2. Add Cities
    cities?.forEach((city) => {
        sitemap.push({
            url: `${BASE_URL}/cities/${city.slug}`,
            lastModified: new Date(city.created_at),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // 3. Add Activities
    activities?.forEach((activity) => {
        sitemap.push({
            url: `${BASE_URL}/offers/${activity.slug}`,
            lastModified: new Date(activity.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    });

    // 4. Add Blog Posts
    posts?.forEach((post) => {
        sitemap.push({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.published_at || new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
        });
    });

    // 5. Add Stores
    stores?.forEach((store) => {
        sitemap.push({
            url: `${BASE_URL}/stores/${store.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    });

    return sitemap;
}
