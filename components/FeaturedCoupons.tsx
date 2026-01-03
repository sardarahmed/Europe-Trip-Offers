'use client';

import { Coupon } from '@/types';
import { CouponCard } from './CouponCard';
import { Container } from './Container';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function FeaturedCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    useEffect(() => {
        async function fetchCoupons() {
            try {
                // Fetch only featured coupons, allow mapping to Type
                const { data, error } = await supabase
                    .from('coupons')
                    .select('*')
                    .eq('is_featured', true)
                    .limit(4);

                if (data && !error) {
                    // Map DB keys to Frontend CamelCase if necessary? 
                    // Supabase JS client usually returns matching column names via types generation or we map manually.
                    // Our DB uses snake_case keys (discount_amount), our Types use camelCase (discountAmount).
                    // WE MUST MAP THEM.

                    const mappedCoupons: Coupon[] = data.map((c: any) => ({
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

                    setCoupons(mappedCoupons);
                }
            } catch (err) {
                console.error('Error fetching featured coupons:', err);
            }
        }
        fetchCoupons();
    }, []);

    if (coupons.length === 0) return null; // Don't show if empty loading state needed really

    return (
        <section className="bg-muted/30 py-16">
            <Container>
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Exclusive Travel Coupons</h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Unlock exclusive savings on your next adventure with our verified promo codes.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href="/coupons">View all coupons &rarr;</a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                    {/* If we have fewer than 4, maybe we don't pad anymore, or we assume DB has enough */}
                </div>
            </Container>
        </section>
    );
}
