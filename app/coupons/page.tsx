'use client';

import { Container } from '@/components/Container';
import { CouponCard } from '@/components/CouponCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Coupon } from '@/types';
import { supabase } from '@/lib/supabase';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('Recommended');

    useEffect(() => {
        async function fetchCoupons() {
            try {
                const { data, error } = await supabase
                    .from('coupons')
                    .select('*, created_at, stores(*)')
                    .order('is_featured', { ascending: false });

                if (data && !error) {
                    const mapped: Coupon[] = data.map((c: any) => ({
                        id: c.id,
                        code: c.code,
                        title: c.title,
                        description: c.description || '',
                        discountAmount: c.discount_amount,
                        expiryDate: c.expiry_date,
                        createdAt: c.created_at,
                        imageUrl: c.image_url,
                        isFeatured: c.is_featured,
                        categoryId: c.category_id,
                        activityId: c.activity_id,
                        usedCount: c.used_count,
                        successRate: c.success_rate,
                        storeId: c.store_id,
                        store: c.stores ? {
                            id: c.stores.id,
                            name: c.stores.name,
                            slug: c.stores.slug,
                            logoUrl: c.stores.logo_url,
                            description: c.stores.description,
                            websiteUrl: c.stores.website_url,
                            isFeatured: c.stores.is_featured,
                            rating: c.stores.rating,
                            reviewCount: c.stores.review_count
                        } : undefined
                    }));
                    setCoupons(mapped);
                }
            } catch (err) {
                console.error('Error fetching coupons:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCoupons();
    }, []);

    const filteredCoupons = coupons.filter(coupon =>
        coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCoupons = [...filteredCoupons].sort((a, b) => {
        if (sort === 'Most Popular') {
            return (b.usedCount || 0) - (a.usedCount || 0);
        }
        if (sort === 'Newest') {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sort === 'Success Rate') {
            return (b.successRate || 0) - (a.successRate || 0);
        }
        // Recommended (Default) - prioritize Viator
        return a.store?.slug === 'viator' ? -1 : b.store?.slug === 'viator' ? 1 : 0;
    });

    return (
        <div className="min-h-screen py-20">
            <Container>
                {/* Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Travel Coupons & Promo Codes</h1>
                    <p className="text-muted-foreground text-lg">
                        Browse verified discount codes for top European attractions, tours, and hotels.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-muted/50 p-4 rounded-xl">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search coupons..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option>Recommended</option>
                            <option>Most Popular</option>
                            <option>Newest</option>
                            <option>Success Rate</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">Loading coupons...</div>
                )}

                {/* Empty State */}
                {!loading && sortedCoupons.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No coupons found matching your search.
                    </div>
                )}

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedCoupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
