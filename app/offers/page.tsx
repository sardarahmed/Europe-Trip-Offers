'use client';

import { Container } from '@/components/Container';
import { ActivityCard } from '@/components/ActivityCard';
import { Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

import { useSearchParams } from 'next/navigation';

export default function OffersPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('Recommended');

    // Search params
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';

    useEffect(() => {
        async function fetchActivities() {
            try {
                // Fetch all activities (filtering done client-side for simplicity)
                const { data, error } = await supabase
                    .from('activities')
                    .select('*, cities(name, country), stores(*)'); // Added stores

                if (data && !error) {
                    const mapped: Activity[] = data.map((a: any) => ({
                        id: a.id,
                        title: a.title,
                        slug: a.slug,
                        cityId: a.city_id,
                        cityName: a.cities?.name || 'Unknown',
                        price: a.price,
                        discountPrice: a.discount_price,
                        rating: a.rating,
                        reviewsCount: a.reviews_count,
                        imageUrl: a.image_url,
                        duration: a.duration,
                        isFeatured: a.is_featured,
                        categoryId: a.category_id,
                        highlights: a.highlights,
                        storeId: a.store_id,
                        store: a.stores ? {
                            id: a.stores.id,
                            name: a.stores.name,
                            slug: a.stores.slug,
                            logoUrl: a.stores.logo_url,
                            description: a.stores.description,
                            websiteUrl: a.stores.website_url,
                            isFeatured: a.stores.is_featured,
                            rating: a.stores.rating,
                            reviewCount: a.stores.review_count
                        } : undefined
                        // Add hidden metadata for search if needed (e.g. description)
                    }));
                    setActivities(mapped);
                }
            } catch (err) {
                console.error('Error fetching activities:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
    }, []);

    // Filter & Sort
    const filteredActivities = activities.filter(a => {
        if (!query) return true;
        const searchStr = `${a.title} ${a.cityName}`.toLowerCase();
        return searchStr.includes(query);
    });

    const sortedActivities = [...filteredActivities].sort((a, b) => {
        if (sort === 'Price: Low to High') {
            return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        }
        if (sort === 'Price: High to Low') {
            return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        }
        if (sort === 'Top Rated') {
            return b.rating - a.rating;
        }
        return 0; // Default
    });

    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Best Travel Deals & Activities</h1>
                        <p className="text-muted-foreground text-lg">
                            Discover top-rated tours, skip-the-line tickets, and unique experiences at unbeatable prices.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option>Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Top Rated</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading deals...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sortedActivities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
