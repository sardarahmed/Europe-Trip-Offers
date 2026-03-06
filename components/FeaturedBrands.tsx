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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {stores.map((store, index) => (
                        <div
                            key={store.id}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col p-5"
                        >
                            {/* Top Right Orange Pill */}
                            {store.customDiscountText && (
                                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-20">
                                    {store.customDiscountText}
                                </div>
                            )}

                            {/* Header: Logo + Name + Used Badge */}
                            <div className="flex items-start justify-between mb-4 z-10 w-full gap-2">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
                                        <img
                                            src={store.logoUrl}
                                            alt={store.name}
                                            className="object-contain w-full h-full"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <span className="hidden text-[10px] font-bold text-slate-700 capitalize">Img</span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-slate-900 line-clamp-1">
                                            {store.name}
                                        </span>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md leading-none">
                                                Deal
                                            </span>
                                            {store.offerExpiry && (
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    Expires: {store.offerExpiry}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Used Count Badge */}
                                {store.usedDealsCount ? (
                                    <div className="shrink-0">
                                        <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-md whitespace-nowrap">
                                            🔥 {store.usedDealsCount.toLocaleString()} Used
                                        </span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Offer Details */}
                            <div className="flex-grow z-10 w-full">
                                <h3 className="font-bold text-slate-900 text-base leading-tight">
                                    {store.offerTitle || `Best Deals at ${store.name}`}
                                </h3>
                                <div className="mt-2">
                                    <Link
                                        href={`/stores/${store.slug}`}
                                        className="text-blue-600 text-xs font-semibold hover:underline flex items-center"
                                    >
                                        <span className="mr-1 text-[10px]">▶</span> See Details
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Full Width Get Deal Button */}
                            <div className="mt-4 pt-3 w-full z-10">
                                <Link
                                    href={`/stores/${store.slug}?showPopup=true`}
                                    className="block w-full text-center text-sm font-bold text-white bg-[#FF6347] hover:bg-red-500 py-3 rounded-lg transition-colors shadow-sm tracking-wide"
                                >
                                    GET DEAL
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
