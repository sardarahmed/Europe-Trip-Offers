import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { CouponCard } from '@/components/CouponCard';
import { ActivityCard } from '@/components/ActivityCard';
import { supabase } from '@/lib/supabase';
import { Activity, Coupon, Store } from '@/types';
import { StoreLogo } from '@/components/StoreLogo';

export const revalidate = 60;

import { StorePopup } from '@/components/StorePopup';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function StoreDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // 1. Fetch Store Details
    const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!storeData) {
        notFound();
    }

    const store: Store = {
        id: storeData.id,
        name: storeData.name,
        slug: storeData.slug,
        logoUrl: storeData.logo_url,
        description: storeData.description,
        websiteUrl: storeData.website_url || (storeData.slug.toLowerCase() === 'expedia' ? 'https://expedia.com/affiliate/ePXMSdi' : ''),
        isFeatured: storeData.is_featured,
        rating: storeData.rating,
        reviewCount: storeData.review_count,
        customDiscountText: storeData.custom_discount_text,
        usedDealsCount: storeData.used_deals_count,
        popupCode: storeData.popup_code,
        popupLink: storeData.popup_link
    };

    // Auto-fix DB if missing
    if (storeData.slug.toLowerCase() === 'expedia' && !storeData.website_url) {
        await supabase.from('stores')
            .update({ website_url: 'https://expedia.com/affiliate/ePXMSdi' })
            .eq('id', storeData.id);
    }

    // 2. Fetch Linked Coupons
    const { data: couponsData } = await supabase
        .from('coupons')
        .select('*')
        .eq('store_id', store.id)
        .order('is_featured', { ascending: false });

    const coupons: Coupon[] = (couponsData || []).map((c: any) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description || '',
        discountAmount: c.discount_amount,
        expiryDate: c.expiry_date,
        imageUrl: c.image_url || store.logoUrl, // Fallback to store logo
        isFeatured: c.is_featured,
        storeId: c.store_id,
        store: store,
        usedCount: c.used_count,
        successRate: c.success_rate,
        lastVerified: c.last_verified,
        terms: c.terms
    }));

    // 3. Fetch Linked Activities (Deals)
    const { data: activitiesData } = await supabase
        .from('activities')
        .select('*, cities(name)')
        .eq('store_id', store.id)
        .order('is_featured', { ascending: false });

    const activities: Activity[] = (activitiesData || []).map((a: any) => ({
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
        storeId: a.store_id,
        store: store
    }));

    return (
        <div className="bg-slate-50 min-h-screen">
            <StorePopup store={store} />
            {/* Store Header / Hero */}
            <div className="bg-white border-b shadow-sm">
                <Container>
                    <div className="py-8 md:py-12 flex flex-col md:flex-row items-center gap-8">
                        {/* Logo Box */}
                        <div className="h-32 w-32 md:h-40 md:w-40 bg-white rounded-2xl border-2 border-slate-100 shadow-lg flex items-center justify-center p-4 relative shrink-0">
                            <StoreLogo
                                src={store.logoUrl}
                                alt={store.name}
                                className="object-contain max-h-full max-w-full"
                            />
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                                {store.name} Coupons & Deals
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-slate-900">{store.rating}</span>/5 Rating
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Verified Partner
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                                    Buyer Protection
                                </div>
                            </div>
                            <p className="text-slate-600 max-w-2xl text-lg">
                                {store.description || `Find the latest ${store.name} promo codes, coupons, and travel deals. verified daily.`}
                            </p>
                        </div>

                        {/* CTA */}
                        {store.websiteUrl && (
                            <div className="shrink-0">
                                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all" asChild>
                                    <a href={store.websiteUrl} target="_blank" rel="noopener noreferrer">
                                        Visit {store.name} Website <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </div>

            <Container className="py-12 space-y-16">

                {/* Coupons Section */}
                {coupons.length > 0 ? (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-slate-900">Active Coupons & Promo Codes</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {coupons.map(coupon => (
                                <CouponCard key={coupon.id} coupon={coupon} />
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="text-center py-10 bg-white rounded-xl border border-dashed">
                        <p className="text-slate-500">No active coupons found for {store.name} at the moment.</p>
                    </section>
                )}

                {/* Deals Section */}
                {activities.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-orange-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-slate-900">Trending Deals from {store.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activities.map(activity => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </section>
                )}

            </Container>
        </div>
    );
}
