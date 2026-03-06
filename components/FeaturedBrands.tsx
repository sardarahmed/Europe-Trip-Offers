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
                        <div
                            key={store.id}
                            className="group flex flex-col p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative"
                        >
                            {/* Decorative background accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

                            <div className="w-full h-20 relative flex items-center justify-center mb-3 z-10">
                                <img
                                    src={store.logoUrl}
                                    alt={store.name}
                                    className="object-contain max-w-full max-h-full drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 transform group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <span className="hidden text-xs font-bold text-slate-300 absolute">LOGO</span>
                            </div>

                            <div className="z-10 flex flex-col items-center gap-1 w-full flex-grow">
                                <span className="text-sm font-bold text-slate-900 line-clamp-1 w-full text-center">
                                    {store.name}
                                </span>
                                
                                {store.customDiscountText && (
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                                        {store.customDiscountText}
                                    </span>
                                )}

                                {store.usedDealsCount ? (
                                    <span className="text-[11px] text-slate-500 mt-1">
                                        {store.usedDealsCount.toLocaleString()} deals used
                                    </span>
                                ) : null}
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-slate-100 w-full z-10">
                                <Link
                                    href={`/stores/${store.slug}?showPopup=true`}
                                    className="block w-full text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    Get Deal
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
