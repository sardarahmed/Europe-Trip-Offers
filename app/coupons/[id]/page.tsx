'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Ticket, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Coupon } from '@/types';
import Link from 'next/link';

export default function CouponDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCoupon() {
            try {
                const { data: c, error } = await supabase
                    .from('coupons')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (c && !error) {
                    const mapped: Coupon = {
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
                    };
                    setCoupon(mapped);
                }
            } catch (err) {
                console.error('Error fetching coupon:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCoupon();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!coupon) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Coupon Not Found</h1>
                <Button asChild><Link href="/coupons">Back to Coupons</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 bg-muted/10">
            <Container className="max-w-4xl">
                <div className="mb-8">
                    <Link href="/coupons" className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Coupons
                    </Link>
                </div>

                <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* Left Side: Visuals */}
                    <div className="bg-primary/5 p-10 flex flex-col items-center justify-center text-center md:w-1/3 border-r border-border/50 relative overflow-hidden">
                        {coupon.imageUrl && (
                            <div className="absolute inset-0 z-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${coupon.imageUrl})` }} />
                        )}
                        <div className="relative z-10 h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-primary">
                            <Ticket className="h-10 w-10" />
                        </div>
                        <div className="relative z-10 text-3xl font-bold text-primary mb-2">{coupon.discountAmount}</div>
                        <p className="relative z-10 text-sm font-medium text-muted-foreground">Limited Time Offer</p>
                    </div>

                    {/* Right Side: Details */}
                    <div className="p-8 md:p-10 flex-1 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{coupon.title}</h1>
                            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                                {coupon.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg w-fit">
                            <Calendar className="h-4 w-4" />
                            <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Terms & Conditions</h3>
                            <ul className="space-y-2">
                                {/* Mock terms for now as DB doesn't have list struct yet, or split string */}
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Valid for new customers only.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Cannot be combined with other offers.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 border-t">
                            <p className="text-center text-sm text-muted-foreground mb-4">
                                Click below to copy the code and visit the store
                            </p>
                            <div className="flex gap-4">
                                <div
                                    className="flex-1 bg-muted border border-dashed border-primary rounded-lg flex items-center justify-center font-mono font-bold text-xl select-all cursor-pointer hover:bg-muted/80 transition-colors"
                                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                                >
                                    {coupon.code}
                                </div>
                                <Button size="lg" className="flex-1" onClick={() => window.open('https://viator.com', '_blank')}>
                                    Copy & Go
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
