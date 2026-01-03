'use client';

import { Container } from '@/components/Container';
import { ActivityCard } from '@/components/ActivityCard';
import { Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Extended Mock Activities
const ACTIVITIES: Activity[] = [
    {
        id: '1',
        title: 'Louvre Museum Skip-the-Line Hosted Tour',
        slug: 'louvre-museum-ticket',
        cityId: '1',
        cityName: 'Paris',
        price: 65,
        discountPrice: 55,
        rating: 4.8,
        reviewsCount: 1250,
        imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93930dfa874?q=80&w=2070&auto=format&fit=crop',
        duration: '2.5 hours',
        isFeatured: true,
    },
    {
        id: '2',
        title: 'Colosseum, Roman Forum & Palatine Hill Tour',
        slug: 'colosseum-tour',
        cityId: '2',
        cityName: 'Rome',
        price: 55,
        discountPrice: 49,
        rating: 4.9,
        reviewsCount: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1552483775-55f909110ddf?q=80&w=2000&auto=format&fit=crop',
        duration: '3 hours',
        isFeatured: true,
    },
    {
        id: '3',
        title: 'Sagrada Familia Fast-Track Access',
        slug: 'sagrada-familia',
        cityId: '3',
        cityName: 'Barcelona',
        price: 35,
        rating: 4.7,
        reviewsCount: 950,
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop',
        duration: '1.5 hours',
        isFeatured: true,
    },
    {
        id: '4',
        title: 'Amsterdam Canal Cruise with Dinner',
        slug: 'amsterdam-cruise',
        cityId: '4',
        cityName: 'Amsterdam',
        price: 45,
        discountPrice: 35,
        rating: 4.6,
        reviewsCount: 680,
        imageUrl: 'https://images.unsplash.com/photo-1624606048123-dc95ece40738?q=80&w=2066&auto=format&fit=crop',
        duration: '2 hours',
        isFeatured: true,
    },
    {
        id: '5',
        title: 'London Eye Standard Ticket',
        slug: 'london-eye',
        cityId: '5',
        cityName: 'London',
        price: 42,
        discountPrice: 38,
        rating: 4.5,
        reviewsCount: 5400,
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
        duration: '30 mins',
        isFeatured: false,
    },
    {
        id: '6',
        title: 'Vatican Museums & Sistine Chapel',
        slug: 'vatican-museums',
        cityId: '2',
        cityName: 'Rome',
        price: 70,
        rating: 4.8,
        reviewsCount: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
        duration: '3 hours',
        isFeatured: true,
    },
    {
        id: '7',
        title: 'Venice Gondola Ride',
        slug: 'venice-gondola',
        cityId: '7',
        cityName: 'Venice',
        price: 30,
        discountPrice: 25,
        rating: 4.4,
        reviewsCount: 890,
        imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=2070&auto=format&fit=crop',
        duration: '45 mins',
        isFeatured: false,
    },
    {
        id: '8',
        title: 'Santorini Catamaran Cruise',
        slug: 'santorini-cruise',
        cityId: '8',
        cityName: 'Santorini',
        price: 120,
        discountPrice: 100,
        rating: 5.0,
        reviewsCount: 450,
        imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4c79e641e?q=80&w=2070&auto=format&fit=crop',
        duration: '5 hours',
        isFeatured: true,
    },
];

export default function OffersPage() {
    const [sort, setSort] = useState('Recommended');

    // Simple sorting logic for demo
    const sortedActivities = [...ACTIVITIES].sort((a, b) => {
        if (sort === 'Price: Low to High') {
            return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        }
        if (sort === 'Price: High to Low') {
            return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        }
        if (sort === 'Top Rated') {
            return b.rating - a.rating;
        }
        return 0; // Default / Recommended
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
