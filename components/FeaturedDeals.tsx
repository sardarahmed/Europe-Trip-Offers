'use client';

import { Activity } from '@/types';
import { ActivityCard } from './ActivityCard';
import { Container } from './Container';
import { Button } from './ui/button';

interface FeaturedDealsProps {
    activities: Activity[];
}

export function FeaturedDeals({ activities }: FeaturedDealsProps) {
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
