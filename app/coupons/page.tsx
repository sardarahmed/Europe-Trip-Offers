'use client';

import { Container } from '@/components/Container';
import { CouponCard } from '@/components/CouponCard';
import { Button } from '@/components/ui/button';
import { Coupon } from '@/types';
import { useState } from 'react';

// Extended Mock Data
const ALL_COUPONS: Coupon[] = [
    {
        id: '1',
        code: 'PARIS10',
        title: '10% OFF Paris Tours',
        description: 'Save 10% on all museum tickets and city tours in Paris.',
        discountAmount: '10% OFF',
        expiryDate: '2025-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=300&auto=format&fit=crop',
        isFeatured: true,
    },
    {
        id: '2',
        code: 'SUMMER25',
        title: '€25 OFF Summer Bookings',
        description: 'Get €25 off when you spend €150 or more on any activity.',
        discountAmount: '€25 OFF',
        expiryDate: '2025-08-31',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop',
        isFeatured: true,
    },
    {
        id: '3',
        code: 'ROME5',
        title: '5% OFF Rome Attractions',
        description: 'Valid for Colosseum, Vatican, and other top Rome sites.',
        discountAmount: '5% OFF',
        expiryDate: '2025-11-30',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=300&auto=format&fit=crop',
        isFeatured: true,
    },
    {
        id: '4',
        code: 'LONDON20',
        title: '20% OFF London Eye',
        description: 'Exclusive deal for standard admission tickets.',
        discountAmount: '20% OFF',
        expiryDate: '2025-10-15',
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=300&auto=format&fit=crop',
        isFeatured: false,
    },
    {
        id: '5',
        code: 'AMSTERDAM',
        title: 'Free Canal Cruise Upgrade',
        description: 'Book a dinner cruise and get a free drink package upgrade.',
        discountAmount: 'FREE UPGRADE',
        expiryDate: '2025-09-01',
        imageUrl: 'https://images.unsplash.com/photo-1512470876302-6a084e9c6422?q=80&w=300&auto=format&fit=crop',
        isFeatured: false,
    },
    {
        id: '6',
        code: 'BARCELONA15',
        title: '15% OFF Sagrada Familia',
        description: 'Skip the line tickets at a discounted rate.',
        discountAmount: '15% OFF',
        expiryDate: '2025-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=300&auto=format&fit=crop',
        isFeatured: false,
    },
];

export default function CouponsPage() {
    const [filter, setFilter] = useState('All');

    const filters = ['All', 'Paris', 'Rome', 'London', 'Amsterdam', 'Barcelona'];

    const filteredCoupons = filter === 'All'
        ? ALL_COUPONS
        : ALL_COUPONS.filter(c => c.title.includes(filter) || c.description.includes(filter));

    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Travel Coupons & Promo Codes</h1>
                    <p className="text-muted-foreground text-lg">
                        Save on your next European adventure with our exclusive discount codes.
                        Updated daily to ensure you get the best deals.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {filters.map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)}
                            className="rounded-full"
                        >
                            {f}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCoupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </div>

                {filteredCoupons.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No coupons found for this category.
                    </div>
                )}
            </Container>
        </div>
    );
}
