'use client';

import { Container } from '@/components/Container';
import { CityCard } from '@/components/CityCard';
import { City } from '@/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CitiesPage() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCities() {
            try {
                const { data, error } = await supabase
                    .from('cities')
                    .select('*, activities(count)')
                    .order('name');

                if (data && !error) {
                    const mapped: City[] = data.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        slug: c.slug,
                        country: c.country,
                        imageUrl: c.image_url,
                        activityCount: c.activities?.[0]?.count || 0,
                        featured: c.featured,
                    }));
                    setCities(mapped);
                }
            } catch (err) {
                console.error('Error fetching cities:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCities();
    }, []);

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

                {loading ? (
                    <div className="text-center py-20">Loading cities...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cities.map((city) => (
                            <CityCard key={city.id} city={city} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
