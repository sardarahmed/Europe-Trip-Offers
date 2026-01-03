import { Activity } from '@/types';
import { ActivityCard } from './ActivityCard';
import { Container } from './Container';
import { Button } from './ui/button';

const MOCK_ACTIVITIES: Activity[] = [
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
        id: '2',
        title: 'Colosseum, Roman Forum & Palatine Hill Tour',
        slug: 'colosseum-tour',
        cityId: '2',
        cityName: 'Rome',
        price: 55,
        discountPrice: 49,
        rating: 4.9,
        reviewsCount: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1552483775-55f909110ddf?q=80&w=2000&auto=format&fit=crop',
        duration: '3 hours',
        isFeatured: true,
    },
    {
        id: '3',
        title: 'Sagrada Familia Fast-Track Access',
        slug: 'sagrada-familia',
        cityId: '3',
        cityName: 'Barcelona',
        price: 35,
        rating: 4.7,
        reviewsCount: 950,
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop',
        duration: '1.5 hours',
        isFeatured: true,
    },
    {
        id: '4',
        title: 'Amsterdam Canal Cruise with Dinner',
        slug: 'amsterdam-cruise',
        cityId: '4',
        cityName: 'Amsterdam',
        price: 45,
        discountPrice: 35,
        rating: 4.6,
        reviewsCount: 680,
        imageUrl: 'https://images.unsplash.com/photo-1624606048123-dc95ece40738?q=80&w=2066&auto=format&fit=crop',
        duration: '2 hours',
        isFeatured: true,
    },
];

export function FeaturedDeals() {
    return (
        <section>
            <Container>
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Top Trending Activities</h2>
                        <p className="text-muted-foreground mt-2">
                            Unforgettable experiences curated just for you.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href="/offers">View all offers &rarr;</a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_ACTIVITIES.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
