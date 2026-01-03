import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, Check, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Activity } from '@/types';

export const revalidate = 60; // ISR

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

    // Map to Activity type (handling snake_case -> camelCase)
    // Note: highlights is already an array in DB
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


    return (
        <div className="pb-20">
            <Container className="pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{activity.title}</h1>

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

                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                            <div
                                className="h-full w-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${activity.imageUrl}')` }}
                            />
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-3">Overview</h3>
                            <p>{activity.description}</p>

                            {activity.highlights && activity.highlights.length > 0 && (
                                <>
                                    <h3 className="text-xl font-bold mt-8 mb-4">Highlights</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
                                        {activity.highlights.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-500 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 p-6 rounded-xl border bg-card shadow-lg">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">From</p>
                                    <p className="text-3xl font-bold text-primary">€{activity.discountPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground line-through">€{activity.price}</p>
                                    <span className="text-xs font-bold text-green-600">Save €{(activity.price - (activity.discountPrice || 0)).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span>Free Cancellation up to 24h before</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Mobile Voucher Accepted</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg font-bold" asChild>
                                <a
                                    href={activity.affiliateLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Check Availability
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
