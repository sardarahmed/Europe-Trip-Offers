'use client';

import { Store } from '@/types';
import { Container } from './Container';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedBrandsProps {
    stores: Store[];
}

export function FeaturedBrands({ stores }: FeaturedBrandsProps) {
    if (stores.length === 0) return null;

    return (
        <section className="py-8 border-b border-slate-100">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Trusted Partners & Top Brands</h2>
                    <Link href="/stores" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                        View all brands <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stores.map((store, index) => (
                        <Link
                            key={store.id}
                            href={`/stores/${store.slug}`}
                            className="group flex flex-col items-center justify-between p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                        >
                            {/* Decorative background accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="w-full h-24 relative flex items-center justify-center mb-4 z-10 p-2">
                                <img
                                    src={store.logoUrl}
                                    alt={store.name}
                                    className="object-contain max-w-full max-h-full drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 transform group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <span className="hidden text-xs font-bold text-slate-300 absolute">LOGO</span>
                            </div>

                            <div className="z-10 flex flex-col items-center gap-2 w-full">
                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-center line-clamp-1 w-full">
                                    {store.name}
                                </span>
                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    View Offers
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
