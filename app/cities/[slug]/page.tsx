import { Container } from '@/components/Container';
import { DealCard } from '@/components/DealCard';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';

// Mock data (in a real app, fetch from Supabase based on slug)
const CITY_DATA = {
    name: 'Paris',
    country: 'France',
    description: 'Experience the magic of the City of Lights. From the Eiffel Tower to the Louvre, Paris offers an unforgettable journey through history, art, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    bestTime: 'April to June, October to early November',
    weather: 'Mild springs, warm summers, cool autumns.',
};

const CITY_ACTIVITIES: Activity[] = [
    {
        id: '1',
        title: 'Louvre Museum Skip-the-Line Hosted Tour',
        slug: 'louvre-museum-ticket',
        cityId: '1',
        cityName: 'Paris',
        price: 65,
        discountPrice: 55,
        rating: 4.8,
        reviewsCount: 1250,
        imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93930dfa874?q=80&w=2070&auto=format&fit=crop',
        duration: '2.5 hours',
        isFeatured: true,
    },
    {
        id: '101',
        title: 'Eiffel Tower Summit Priority Access',
        slug: 'eiffel-tower-summit',
        cityId: '1',
        cityName: 'Paris',
        price: 80,
        rating: 4.9,
        reviewsCount: 5200,
        imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=2001&auto=format&fit=crop',
        duration: '3 hours',
        isFeatured: true,
    },
];

export default function CityPage({ params }: { params: { slug: string } }) {
    // In production: const filteredActivities = await fetchActivitiesByCity(params.slug);

    return (
        <div className="pb-20">
            {/* City Hero */}
            <div
                className="relative h-[500px] flex items-end"
                style={{
                    backgroundImage: `url(${CITY_DATA.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <Container className="relative z-10 pb-12 text-white">
                    <div className="flex items-center gap-2 text-sm md:text-base font-medium text-white/80 mb-2">
                        <MapPin className="h-4 w-4" /> {CITY_DATA.country}
                    </div>
                    <h1 className="text-5xl font-bold mb-4">{CITY_DATA.name}</h1>
                    <p className="max-w-xl text-lg text-white/90">{CITY_DATA.description}</p>
                </Container>
            </div>

            <Container className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Top Activities */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Top Things to Do in {CITY_DATA.name}</h2>
                        <div className="space-y-4">
                            {CITY_ACTIVITIES.map((activity) => (
                                <DealCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Button variant="outline" size="lg" className="w-full">
                                View All {CITY_DATA.name} Activities
                            </Button>
                        </div>
                    </section>

                    {/* Travel Guide / Info */}
                    <section className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">Travel Guide</h2>
                        <p className="text-muted-foreground">
                            Discover the best neighborhoods, local cuisine, and hidden gems.
                            Whether you're visiting for art, fashion, or food, {CITY_DATA.name} has something for everyone.
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
                                <p className="text-muted-foreground">{CITY_DATA.bestTime}</p>
                            </div>
                            <div>
                                <span className="font-semibold block mb-1">Weather</span>
                                <p className="text-muted-foreground">{CITY_DATA.weather}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                        <h3 className="font-bold text-lg mb-2 text-primary">Need a Hotel?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get the best rates on hotels in {CITY_DATA.name} with our partner Booking.com.
                        </p>
                        <Button className="w-full gap-2">
                            Find Hotels <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </aside>
            </Container>
        </div>
    );
}
