'use client';

import { Coupon } from '@/types';
import { CouponCard } from './CouponCard';
import { Container } from './Container';
import { Button } from './ui/button';

interface FeaturedCouponsProps {
    coupons: Coupon[];
}

export function FeaturedCoupons({ coupons }: FeaturedCouponsProps) {
    if (coupons.length === 0) return null;

    return (
        <section className="bg-muted/30 py-12">
            <Container>
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Exclusive Travel Coupons</h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Unlock exclusive savings on your next adventure with our verified promo codes.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {coupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="outline" size="lg" asChild>
                        <a href="/coupons">View all coupons &rarr;</a>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
