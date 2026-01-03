import Link from 'next/link';
import { City } from '@/types';
import { MapPin } from 'lucide-react';

import Image from 'next/image';

interface CityCardProps {
    city: City;
    variant?: 'default' | 'compact';
}

export function CityCard({ city, variant = 'default' }: CityCardProps) {
    const aspectRatioClass = variant === 'compact' ? 'aspect-[3/2]' : 'aspect-[4/5]';

    return (
        <Link href={`/cities/${city.slug}`} className="group relative block overflow-hidden rounded-xl bg-gray-100 shadow-md transition-shadow hover:shadow-xl">
            <div className={`${aspectRatioClass} w-full overflow-hidden relative`}>
                <Image
                    src={city.imageUrl}
                    alt={city.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                <div className="flex items-center gap-1 text-xs text-gray-300 mb-1">
                    <MapPin className="h-3 w-3" />
                    {city.country}
                </div>
                <h3 className="text-xl font-bold">{city.name}</h3>
                <p className="mt-1 text-sm text-gray-300 font-medium">{city.activityCount} Activities</p>
            </div>
        </Link>
    );
}
