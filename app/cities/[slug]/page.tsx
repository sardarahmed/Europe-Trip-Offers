import { Container } from '@/components/Container';
import { DealCard } from '@/components/DealCard';
import { Button } from '@/components/ui/button';
import { Activity, City } from '@/types';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 60;

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: city } = await supabase
        .from('cities')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (!city) return { title: 'City Not Found' };

    return {
        title: `Best Things to Do in ${city.name}`,
        description: city.description || `Explore the best attractions, tours, and travel deals in ${city.name}. Plan your perfect European trip today.`,
        openGraph: {
            title: `Best Things to Do in ${city.name}`,
            description: city.description,
        }
    };
}

import { JsonLd } from '@/components/JsonLd';

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Parallel fetch: City Details & Activities for this City
    // 1. Get City ID first (needed for activities fetch or we can join, but 2 steps is clearer)
    const { data: cityData, error: cityError } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', slug)
        .single();

    if (cityError || !cityData) {
        notFound();
    }

    // Map DB City to TS Type
    const city: City = {
        id: cityData.id,
        name: cityData.name,
        slug: cityData.slug,
        country: cityData.country,
        description: cityData.description || '',
        imageUrl: cityData.image_url,
        activityCount: cityData.activity_count,
        featured: cityData.featured,
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
                "name": "Cities",
                "item": "https://europetripoffers.com/cities"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": city.name,
                "item": `https://europetripoffers.com/cities/${city.slug}`
            }
        ]
    };

    // 2. Fetch Activities for this city
    const { data: activitiesData } = await supabase
        .from('activities')
        .select('*, cities(name)')
        .eq('city_id', city.id)
        .order('is_featured', { ascending: false }); // Show featured first

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
        categoryId: a.category_id,
        highlights: a.highlights,
        affiliateLink: a.affiliate_link,
        description: a.description
    }));

    return (
        <div className="pb-20">
            <JsonLd data={breadcrumbLd} />
            {/* City Hero */}
            <div
                className="relative h-[500px] flex items-end"
                style={{
                    backgroundImage: `url('${city.imageUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <Container className="relative z-10 pb-12 text-white">
                    <div className="flex items-center gap-2 text-sm md:text-base font-medium text-white/80 mb-2">
                        <MapPin className="h-4 w-4" /> {city.country}
                    </div>
                    <h1 className="text-5xl font-bold mb-4">{city.name}</h1>
                    <p className="max-w-xl text-lg text-white/90">{city.description}</p>
                </Container>
            </div>

            <Container className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Top Activities */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Top Things to Do in {city.name}</h2>

                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <DealCard key={activity.id} activity={activity} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border rounded-xl text-center text-muted-foreground bg-muted/20">
                                <p>No activities found for this city yet.</p>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Button variant="outline" size="lg" className="w-full" asChild>
                                <a href="/offers">View All Activities</a>
                            </Button>
                        </div>
                    </section>

                    {/* Travel Guide / Info - Static or could be dynamic in future */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">Travel Guide</h2>
                        <p className="text-muted-foreground">
                            Discover the best neighborhoods, local cuisine, and hidden gems.
                            Whether you're visiting for art, fashion, or food, {city.name} has something for everyone.
                        </p>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <div className="p-6 rounded-xl border bg-card shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="font-semibold block mb-1 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Best Time to Visit
                                </span>
                                <p className="text-muted-foreground">Spring (April-June) or Fall (Sept-Nov)</p>
                            </div>
                            <div>
                                <span className="font-semibold block mb-1">Currency</span>
                                <p className="text-muted-foreground">Euro (€)</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                        <h3 className="font-bold text-lg mb-2 text-primary">Need a Hotel?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get the best rates on hotels in {city.name} with our partner Booking.com.
                        </p>
                        <Button className="w-full gap-2" variant="default" asChild>
                            <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">
                                Find Hotels <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </aside>
            </Container>
        </div>
    );
}
