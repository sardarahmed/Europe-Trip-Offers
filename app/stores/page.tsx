'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { stores, categories } from '@/data/mockData';
import { Search, ExternalLink, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function StoresPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? store.categoryIds.includes(selectedCategory) : true;
        return matchesSearch && matchesCategory;
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

                    {/* Search & Filter Bar */}
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

                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <Button
                                variant={selectedCategory === null ? "default" : "outline"}
                                onClick={() => setSelectedCategory(null)}
                                className="rounded-full"
                            >
                                All
                            </Button>
                            {categories.map(cat => (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.id ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className="rounded-full whitespace-nowrap"
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Store Grid */}
            <Container className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    {filteredStores.length} Stores Found
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStores.map(store => (
                        <Link
                            href={`/stores/${store.slug}`}
                            key={store.id}
                            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="h-24 w-24 relative mb-4 p-2 bg-white rounded-full border shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
                                {/* Fallback if external images don't load, use text */}
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
                                <span>{store.offerCount} Active Offers</span>
                                <span className="text-blue-600 flex items-center gap-0.5 group-hover:underline">
                                    Visit Store <ExternalLink className="h-3 w-3" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredStores.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-lg">No stores found matching your criteria.</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
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
