import Link from 'next/link';
import { Activity } from '@/types';
import { Button } from './ui/button';
import { Star, Clock } from 'lucide-react';

interface DealCardProps {
    activity: Activity;
}

import Image from 'next/image';

export function DealCard({ activity }: DealCardProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 border rounded-xl overflow-hidden bg-white text-slate-900 hover:shadow-md transition-shadow">
            <div className="w-full md:w-48 aspect-video md:aspect-square shrink-0 relative">
                <Image
                    src={activity.imageUrl}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover"
                />
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" /> {activity.duration}
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                        <Link href={`/offers/${activity.slug}`} className="hover:text-primary transition-colors">
                            {activity.title}
                        </Link>
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{activity.rating}</span>
                        <span className="text-sm text-muted-foreground">({activity.reviewsCount})</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary">€{activity.discountPrice || activity.price}</span>
                        {activity.discountPrice && (
                            <span className="text-sm text-muted-foreground line-through">€{activity.price}</span>
                        )}
                    </div>
                    <Button size="sm" asChild>
                        <Link href={`/offers/${activity.slug}`}>View &rarr;</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
