import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import { UAParser } from 'ua-parser-js';

// Init Supabase (Service Role not strictly needed if Policies allow Anon INSERT, but cleaner)
// Using standard client with Anon Key per project setup
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { visitorId, path, title, referrer, isAdmin } = body;

        // 1. Exclude Admins
        if (isAdmin) {
            return NextResponse.json({ skipped: true }, { status: 200 });
        }

        // 2. Parse User Agent
        const uaString = req.headers.get('user-agent') || '';
        const parser = new UAParser(uaString);
        const result = parser.getResult();

        const deviceType = result.device.type || 'Desktop'; // 'mobile', 'tablet'
        const browserName = result.browser.name;
        const osName = result.os.name;

        // 3. Get IP / Country (Vercel Headers)
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
        const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

        // 4. Determine Source (Simple Logic)
        let source = 'Direct';
        let medium = 'none';
        let isPaid = false;

        if (referrer && !referrer.includes(req.nextUrl.host)) {
            if (referrer.includes('google')) source = 'Google';
            else if (referrer.includes('facebook')) source = 'Facebook';
            else if (referrer.includes('t.co')) source = 'Twitter';
            else source = new URL(referrer).hostname;
            medium = 'referral';
        }

        // Check UTM (passed in body or extracted from path query if provided, simplified here)
        // Client sends clean path, so meaningful UTM extraction might need full URL analysis
        // For MVP, we stick to Referrer + Basic logic.

        // 5. Check if Visit exists for this Visitor today
        // We use a simplified logic: 1 Visit = 1 Visitor ID (Session-based)
        // Real-world: Check if 'last_active_at' > 30 mins ago.

        // A. Create/Update Visit
        const { data: visitData, error: visitError } = await supabase
            .from('visits')
            .select('id')
            .eq('visitor_id', visitorId)
            .gt('last_active_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Active in last 30m
            .single();

        let visitId = visitData?.id;

        if (!visitId) {
            // New Session
            const { data: newVisit, error: newVisitError } = await supabase
                .from('visits')
                .insert({
                    visitor_id: visitorId,
                    ip,
                    country,
                    city,
                    device: deviceType,
                    browser: browserName,
                    os: osName,
                    source,
                    medium,
                    is_paid: isPaid, // logic would go here if UTM present
                    user_agent: uaString
                })
                .select('id')
                .single();

            if (newVisitError) {
                console.error('Visit Error:', newVisitError);
                // If error (e.g. race condition), fallback or ignore
            }
            visitId = newVisit?.id;
        } else {
            // Update Last Active
            await supabase.from('visits').update({ last_active_at: new Date().toISOString() }).eq('id', visitId);
        }

        if (!visitId) return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });

        // B. Track Page View
        await supabase.from('page_views').insert({
            visit_id: visitId,
            path,
            title
        });

        return NextResponse.json({ success: true, visitId });

    } catch (error) {
        console.error('Tracking Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
