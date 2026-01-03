import { Container } from '@/components/Container';
import { CityCard } from '@/components/CityCard';
import { City } from '@/types';

const CITIES: City[] = [
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
    {
        id: '5',
        name: 'London',
        slug: 'london',
        country: 'United Kingdom',
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
        activityCount: 210,
        featured: false,
    },
    {
        id: '6',
        name: 'Prague',
        slug: 'prague',
        country: 'Czech Republic',
        imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=2070&auto=format&fit=crop',
        activityCount: 65,
        featured: false,
    },
    {
        id: '7',
        name: 'Venice',
        slug: 'venice',
        country: 'Italy',
        imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=2070&auto=format&fit=crop',
        activityCount: 55,
        featured: false,
    },
    {
        id: '8',
        name: 'Santorini',
        slug: 'santorini',
        country: 'Greece',
        imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4c79e641e?q=80&w=2070&auto=format&fit=crop',
        activityCount: 42,
        featured: false,
    },
];

export default function CitiesPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Top European Destinations</h1>
                    <p className="text-muted-foreground text-lg">
                        Find the best things to do in the most popular cities across Europe.
                        From iconic landmarks to hidden gems.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {CITIES.map((city) => (
                        <CityCard key={city.id} city={city} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
