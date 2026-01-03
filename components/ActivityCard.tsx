import Link from 'next/link';
import { Activity } from '@/types';
import { Button } from './ui/button';
import { MapPin, Star, Clock } from 'lucide-react';

interface ActivityCardProps {
    activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-xl bg-white text-slate-900 border shadow-sm transition-all hover:shadow-lg">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Link href={`/offers/${activity.slug}`}>
                    <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${activity.imageUrl}')` }}
                    />
                </Link>

                {/* Discount Badge */}
                {activity.discountPrice && (
                    <div className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                        SAVE {Math.round(((activity.price - activity.discountPrice) / activity.price) * 100)}%
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-4">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.cityName}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.duration}
                    </div>
                </div>

                {/* Title */}
                <Link href={`/offers/${activity.slug}`} className="mb-2">
                    <h3 className="line-clamp-2 text-lg font-bold leading-tight decoration-primary group-hover:underline">
                        {activity.title}
                    </h3>
                </Link>

                {/* Ratings */}
                <div className="mb-4 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{activity.rating}</span>
                    <span className="text-sm text-muted-foreground">({activity.reviewsCount})</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">From</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-primary">
                                €{activity.discountPrice || activity.price}
                            </span>
                            {activity.discountPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    €{activity.price}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button size="sm" asChild>
                        <Link href={`/offers/${activity.slug}`}>View Deal</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
