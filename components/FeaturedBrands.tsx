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
        <section className="py-12 border-b border-slate-100">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Trusted Partners & Top Brands</h2>
                    <Link href="/stores" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                        View all brands <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stores.map((store) => (
                        <Link
                            key={store.id}
                            href={`/stores/${store.slug}`}
                            className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                        >
                            <div className="w-20 h-20 relative flex items-center justify-center mb-3 grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100">
                                <img
                                    src={store.logoUrl}
                                    alt={store.name}
                                    className="object-contain max-w-full max-h-full"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <span className="hidden text-xs font-bold text-slate-300 absolute">LOGO</span>
                            </div>
                            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                                {store.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
