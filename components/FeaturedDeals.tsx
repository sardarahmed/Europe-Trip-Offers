'use client';

import { Activity } from '@/types';
import { ActivityCard } from './ActivityCard';
import { Container } from './Container';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface FeaturedDealsProps {
    activities: Activity[];
}

export function FeaturedDeals({ activities: initialActivities }: FeaturedDealsProps) {
    const [activities, setActivities] = useState<Activity[]>(initialActivities);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                // Simple sort: if we have user location, prioritize nearest
                // (Note: To use calculateDistance, we need to import it or define it. 
                // Since this is a small component, I'll assume we can just do a quick sort or better yet, keep it simple:
                // prioritizing based on simple proximity if activity has lat/long)

                const sorted = [...initialActivities].sort((a, b) => {
                    // Try to sort by distance if both have coordinates
                    if (a.latitude && a.longitude && b.latitude && b.longitude) {
                        const distA = Math.pow(a.latitude - latitude, 2) + Math.pow(a.longitude - longitude, 2);
                        const distB = Math.pow(b.latitude - latitude, 2) + Math.pow(b.longitude - longitude, 2);
                        return distA - distB;
                    }
                    return 0;
                });
                setActivities(sorted);
            });
        }
    }, [initialActivities]);

    if (activities.length === 0) return null;

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="outline" size="lg" asChild>
                        <a href="/offers">View all offers &rarr;</a>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
