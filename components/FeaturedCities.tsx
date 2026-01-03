import { City } from '@/types';
import { CityCard } from './CityCard';
import { Container } from './Container';

const MOCK_CITIES: City[] = [
    {
        id: '1',
        name: 'Paris',
        slug: 'paris',
        country: 'France',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
        activityCount: 156,
        featured: true,
    },
    {
        id: '2',
        name: 'Rome',
        slug: 'rome',
        country: 'Italy',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
        activityCount: 124,
        featured: true,
    },
    {
        id: '3',
        name: 'Barcelona',
        slug: 'barcelona',
        country: 'Spain',
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop',
        activityCount: 98,
        featured: true,
    },
    {
        id: '4',
        name: 'Amsterdam',
        slug: 'amsterdam',
        country: 'Netherlands',
        imageUrl: 'https://images.unsplash.com/photo-1512470876302-6a084e9c6422?q=80&w=2074&auto=format&fit=crop',
        activityCount: 85,
        featured: true,
    },
];

export function FeaturedCities() {
    return (
        <section>
            <Container>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Popular Destinations</h2>
                        <p className="text-muted-foreground mt-2">Explore the best cities in Europe.</p>
                    </div>
                    <a href="/cities" className="text-primary font-medium hover:underline">
                        View all cities &rarr;
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {MOCK_CITIES.map((city) => (
                        <CityCard key={city.id} city={city} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
