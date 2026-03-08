import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, Check, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Activity } from '@/types';

export const revalidate = 60; // ISR

// Helper to format text with newlines and links
const formatDescription = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) return <br key={index} />;

        // Split by URL regex
        const parts = paragraph.split(/(https?:\/\/[^\s]+)/g);

        return (
            <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                {parts.map((part, i) => {
                    if (part.match(/^https?:\/\//)) {
                        return (
                            <a
                                key={i}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold hover:underline break-all"
                            >
                                {part}
                            </a>
                        );
                    }
                    return part;
                })}
            </p>
        );
    });
};

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: activity } = await supabase
        .from('activities')
        .select('title, description')
        .eq('slug', slug)
        .single();

    if (!activity) return { title: 'Offer Not Found' };

    return {
        title: activity.title,
        description: activity.description?.substring(0, 160) || `Check out this amazing travel deal: ${activity.title}. Book now and save!`,
        openGraph: {
            title: activity.title,
            description: activity.description?.substring(0, 160),
        }
    };
}

import { JsonLd } from '@/components/JsonLd';

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data: activityData, error } = await supabase
        .from('activities')
        .select('*, cities(name)')
        .eq('slug', slug)
        .single();

    if (error || !activityData) {
        notFound();
    }

    // Map to Activity type
    const activity: Activity = {
        id: activityData.id,
        title: activityData.title,
        slug: activityData.slug,
        cityId: activityData.city_id,
        cityName: activityData.cities?.name || 'Unknown',
        price: activityData.price,
        discountPrice: activityData.discount_price,
        rating: activityData.rating,
        reviewsCount: activityData.reviews_count,
        imageUrl: activityData.image_url,
        duration: activityData.duration,
        isFeatured: activityData.is_featured,
        categoryId: activityData.category_id,
        highlights: activityData.highlights || [],
        affiliateLink: activityData.affiliate_link,
        description: activityData.description
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": activity.title,
        "description": activity.description,
        "image": activity.imageUrl,
        "offers": {
            "@type": "Offer",
            "price": activity.discountPrice || activity.price,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": `https://europetripoffers.com/offers/${activity.slug}`
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": activity.rating,
            "reviewCount": activity.reviewsCount
        }
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://europetripoffers.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Offers",
                "item": "https://europetripoffers.com/offers"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": activity.title,
                "item": `https://europetripoffers.com/offers/${activity.slug}`
            }
        ]
    };

    return (
        <div className="pb-20">
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <Container className="pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">{activity.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                <Star className="h-4 w-4 fill-current" /> {activity.rating}
                            </span>
                            <span>({activity.reviewsCount} reviews)</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {activity.cityName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {activity.duration}
                            </span>
                        </div>

                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted shadow-sm">
                            <div
                                className="h-full w-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
                                style={{ backgroundImage: `url('${activity.imageUrl}')` }}
                            />
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Overview</h3>

                            {/* Formatted Description */}
                            <div className="text-base">
                                {formatDescription(activity.description || '')}
                            </div>

                            {activity.highlights && activity.highlights.length > 0 && (
                                <>
                                    <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900">Highlights</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
                                        {activity.highlights.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 p-6 rounded-xl border bg-white shadow-xl ring-1 ring-slate-900/5">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">From</p>
                                    <p className="text-3xl font-bold text-blue-600">€{activity.discountPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground line-through">€{activity.price}</p>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        Save €{(activity.price - (activity.discountPrice || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                    <span>Free Cancellation up to 24h before</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check className="h-4 w-4 text-blue-600" />
                                    <span>Mobile Voucher Accepted</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all bg-blue-600 hover:bg-blue-700" asChild>
                                <a
                                    href={activity.affiliateLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    Book Activity Now
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </a>
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Powered by Viator. You will be redirected to securely complete your booking.
                            </p>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
}
