'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Store } from '@/types';

// Extended type for display
interface DisplayStore extends Store {
    active_offers_count?: number;
}

export default function StoresPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allStores, setAllStores] = useState<DisplayStore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStores() {
            // Fetch stores with counts of coupons and activities
            const { data, error } = await supabase
                .from('stores')
                .select(`
                    *,
                    coupons:coupons(count),
                    activities:activities(count)
                `)
                .order('name');

            if (data) {
                const mapped: DisplayStore[] = data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    slug: s.slug,
                    logoUrl: s.logo_url,
                    description: s.description,
                    websiteUrl: s.website_url,
                    isFeatured: s.is_featured,
                    rating: s.rating,
                    reviewCount: s.review_count,
                    redirectSlug: s.redirect_slug,
                    active_offers_count: (s.coupons?.[0]?.count || 0) + (s.activities?.[0]?.count || 0)
                }));
                setAllStores(mapped);
            }
            setLoading(false);
        }

        fetchStores();
    }, []);

    const filteredStores = allStores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b py-12">
                <Container>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Browse by Store
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Find the best deals and coupons from your favorite travel brands.
                        From Booking.com to Expedia, we've gathered them all in one place.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search stores..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Store Grid */}
            <Container className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Filter className="h-5 w-5 text-blue-600" />
                        {filteredStores.length} Stores Found
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStores.map(store => (
                            <Link
                                href={`/stores/${store.redirectSlug || store.slug}`}
                                key={store.id}
                                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                            >
                                <div className="h-24 w-24 relative mb-4 p-2 bg-white rounded-full border shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
                                    <img
                                        src={store.logoUrl}
                                        alt={store.name}
                                        className="object-contain max-h-full max-w-full p-2"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <span className="hidden text-xs font-bold text-slate-400 absolute">LOGO</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {store.name}
                                </h3>

                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                                    {store.description}
                                </p>

                                <div className="w-full mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                                    <span>{store.active_offers_count} Active Offers</span>
                                    <span className="text-blue-600 flex items-center gap-0.5 group-hover:underline">
                                        Visit Store <ExternalLink className="h-3 w-3" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredStores.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-lg">No stores found matching your criteria.</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchTerm(''); }}
                            className="mt-2 text-blue-600"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
}
