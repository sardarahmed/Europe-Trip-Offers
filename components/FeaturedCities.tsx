'use client';

import { City } from '@/types';
import { CityCard } from './CityCard';
import { Container } from './Container';

interface FeaturedCitiesProps {
    cities: City[];
}

export function FeaturedCities({ cities }: FeaturedCitiesProps) {
    if (cities.length === 0) return null;

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
                    {cities.map((city) => (
                        <CityCard key={city.id} city={city} variant="compact" />
                    ))}
                </div>
            </Container>
        </section>
    );
}
