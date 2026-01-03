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

    useEffect(() => {
        async function fetchCoupons() {
            try {
                const { data, error } = await supabase
                    .from('coupons')
                    .select('*')
                    .order('is_featured', { ascending: false });

                if (data && !error) {
                    const mapped: Coupon[] = data.map((c: any) => ({
                        id: c.id,
                        code: c.code,
                        title: c.title,
                        description: c.description || '',
                        discountAmount: c.discount_amount,
                        expiryDate: c.expiry_date,
                        imageUrl: c.image_url,
                        isFeatured: c.is_featured,
                        categoryId: c.category_id,
                        activityId: c.activity_id
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
                    <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                    </Button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">Loading coupons...</div>
                )}

                {/* Empty State */}
                {!loading && filteredCoupons.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No coupons found matching your search.
                    </div>
                )}

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCoupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
