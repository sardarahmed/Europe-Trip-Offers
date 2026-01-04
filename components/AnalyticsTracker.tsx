'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [visitorId, setVisitorId] = useState<string>('');

    useEffect(() => {
        // 1. Initialize Visitor ID
        let vid = localStorage.getItem('eto_visitor_id');
        if (!vid) {
            vid = crypto.randomUUID();
            localStorage.setItem('eto_visitor_id', vid);
        }
        setVisitorId(vid);
    }, []);

    useEffect(() => {
        if (!visitorId) return;

        // 2. Prepare Data
        const trackPage = async () => {
            // Check Admin Cookie (Simple check)
            const isAdmin = document.cookie.includes('admin_session=true');

            // Construct full URL (for potential UTM parsing later, though API handles basic source)
            const fullUrl = window.location.href;
            const title = document.title;
            const referrer = document.referrer;

            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        visitorId,
                        path: pathname,
                        title,
                        referrer,
                        isAdmin
                    }),
                });
            } catch (err) {
                console.error('Tracking failed silently', err);
            }
        };

        // Small delay to ensure title is updated
        const timeout = setTimeout(trackPage, 500);
        return () => clearTimeout(timeout);

    }, [pathname, searchParams, visitorId]);

    return null; // Invisible component
}
