'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCcw, Smartphone, Monitor, Globe, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Visit {
    id: string;
    ip: string;
    country: string;
    city: string;
    device: string;
    browser: string;
    source: string;
    started_at: string;
    last_active_at: string;
    visitor_id: string;
    page_views: { path: string; title: string }[];
}

export default function AnalyticsPage() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    // Remove local createClient usage since we import supabase directly

    // Stats
    const [stats, setStats] = useState({
        totalVisits: 0,
        uniqueVisitors: 0,
        topCountry: '-',
        mobilePct: 0
    });

    const fetchData = async () => {
        setLoading(true);

        // Fetch user visits (excluding admins/bots if flagged)
        const { data: visitsData, error } = await supabase
            .from('visits')
            .select(`
        *,
        page_views (path, title)
      `)
            .order('started_at', { ascending: false })
            .limit(100);

        if (visitsData) {
            // Cast the response to Visit[] to handle potential type mismatch with JSONB or similar
            const typedVisits = visitsData as unknown as Visit[];
            setVisits(typedVisits);

            // Calculate Stats
            const total = typedVisits.length;
            const countries = typedVisits.map((v) => v.country || 'Unknown');

            // Fix sort with explicit stats
            const topCountry = countries.sort((a: string, b: string) =>
                countries.filter((v: string) => v === a).length - countries.filter((v: string) => v === b).length
            ).pop() || '-';

            const mobileCount = typedVisits.filter((v) => v.device === 'mobile').length;

            setStats({
                totalVisits: total,
                uniqueVisitors: new Set(typedVisits.map((v) => v.visitor_id)).size || 0, // visitor_id not in interface? Wait, it is in table.
                topCountry,
                mobilePct: Math.round((mobileCount / total) * 100) || 0
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/add-activity" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Visitor Analytics</h1>
                            <p className="text-muted-foreground">Real-time traffic and visitor insights.</p>
                        </div>
                    </div>
                    <button onClick={fetchData} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Visits</h3>
                        <div className="text-3xl font-bold">{stats.totalVisits}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Unique Visitors</h3>
                        <div className="text-3xl font-bold">{stats.uniqueVisitors}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Top Location</h3>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                            <span className="text-3xl font-bold">{stats.topCountry}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Device Type</h3>
                        <div className="flex items-center gap-2">
                            {stats.mobilePct > 50 ? <Smartphone className="text-primary" /> : <Monitor className="text-primary" />}
                            <span className="text-3xl font-bold">{stats.mobilePct}% Mobile</span>
                        </div>
                    </div>
                </div>

                {/* Recent Visits Table */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold">Recent Visitors</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Device / Browser</th>
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4">Active Time</th>
                                    <th className="px-6 py-4">Pages Viewed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {visits.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-red-500" />
                                                <div>
                                                    <div className="font-semibold">{visit.country}</div>
                                                    <div className="text-xs text-muted-foreground">{visit.city}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {visit.device === 'mobile' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                                                <span className="capitalize">{visit.device || 'Desktop'}</span>
                                                <span className="text-muted-foreground">({visit.browser})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {visit.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(visit.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            {visit.page_views.length} pages
                                            <div className="text-xs text-muted-foreground mt-1 truncate">
                                                {visit.page_views.map(p => p.path).slice(0, 3).join(', ')}
                                                {visit.page_views.length > 3 && '...'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
