import Link from 'next/link';
import { City } from '@/types';
import { MapPin } from 'lucide-react';

interface CityCardProps {
    city: City;
}

export function CityCard({ city }: CityCardProps) {
    return (
        <Link href={`/cities/${city.slug}`} className="group relative block overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900 shadow-md transition-shadow hover:shadow-xl">
            <div className="aspect-[4/5] w-full overflow-hidden">
                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${city.imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
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
