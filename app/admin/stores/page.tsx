'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminStoresPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    async function fetchStores() {
        const { data } = await supabase
            .from('stores')
            .select('*')
            .order('name');

        if (data) {
            setStores(data);
        }
        setLoading(false);
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <Container className="py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">All Stores</h1>
                    <Button asChild>
                        <Link href="/admin/add-store">
                            <Plus className="mr-2 h-4 w-4" /> Add New Store
                        </Link>
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Slug</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Website URL</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Rating</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Featured</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Loading stores...
                                        </td>
                                    </tr>
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No stores found.
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((store) => (
                                        <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {store.logo_url && (
                                                        <img src={store.logo_url} alt="" className="h-8 w-8 object-contain rounded bg-white border" />
                                                    )}
                                                    <span className="font-medium text-slate-900">{store.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                                                {store.slug}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
                                                {store.website_url || <span className="text-orange-500 italic">Missing</span>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {store.rating}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {store.is_featured ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Featured
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/stores/edit/${store.id}`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/stores/${store.slug}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>
        </div>
    );
}
