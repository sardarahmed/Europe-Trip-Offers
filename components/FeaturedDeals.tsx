'use client';

import { Activity } from '@/types';
import { ActivityCard } from './ActivityCard';
import { Container } from './Container';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function FeaturedDeals() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const { data, error } = await supabase
                    .from('activities')
                    .select('*, cities(name)') // Join with cities to get city name
                    .eq('is_featured', true)
                    .limit(4);

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
                        highlights: a.highlights
                    }));
                    setActivities(mapped);
                }
            } catch (err) {
                console.error('Error fetching featured deals:', err);
            }
        }
        fetchActivities();
    }, []);

    if (activities.length === 0) return null;

    return (
        <section>
            <Container>
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Top Trending Activities</h2>
                        <p className="text-muted-foreground mt-2">
                            Unforgettable experiences curated just for you.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href="/offers">View all offers &rarr;</a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
