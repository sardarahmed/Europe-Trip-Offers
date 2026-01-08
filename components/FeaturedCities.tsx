'use client';

import { City } from '@/types';
import { CityCard } from './CityCard';
import { Container } from './Container';
import { useState, useEffect } from 'react';

interface FeaturedCitiesProps {
    cities: City[];
}

export function FeaturedCities({ cities: initialCities }: FeaturedCitiesProps) {
    const [cities, setCities] = useState<City[]>(initialCities);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                const sorted = [...initialCities].sort((a, b) => {
                    if (a.latitude && a.longitude && b.latitude && b.longitude) {
                        const distA = Math.pow(a.latitude - latitude, 2) + Math.pow(a.longitude - longitude, 2);
                        const distB = Math.pow(b.latitude - latitude, 2) + Math.pow(b.longitude - longitude, 2);
                        return distA - distB;
                    }
                    return 0;
                });
                setCities(sorted);
            });
        }
    }, [initialCities]);

    if (cities.length === 0) return null;

    return (
        <section className="py-8">
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
