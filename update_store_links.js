const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Using Service Role is best for updates if RLS is on, but failing that trying ANON with .env.local logic

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const UPDATES = [
    {
        slug: 'expedia',
        url: 'https://expedia.com/affiliates/expedia-home.AXykGVo',
        name: 'Expedia' // purely for logging, we match on slug
    },
    {
        slug: 'viator',
        url: 'https://www.viator.com/?pid=P00275081&mcid=42383&medium=link',
        name: 'Viator'
    }
];

async function updateStores() {
    console.log('Updating store links...');

    for (const update of UPDATES) {
        console.log(`Updating ${update.name}...`);

        // 1. Get ID (to be safe)
        const { data: stores, error: fetchError } = await supabase
            .from('stores')
            .select('id')
            .eq('slug', update.slug); // Assuming slug is unique and exists. 
        // If strict slug match fails, we might need ILIKE.

        if (fetchError) {
            console.error(`Error fetching ${update.name}:`, fetchError.message);
            continue;
        }

        if (!stores || stores.length === 0) {
            console.error(`Store not found: ${update.slug}`);
            // Try fallback query by name ilike
            const { data: storesByName } = await supabase.from('stores').select('id').ilike('name', `%${update.slug}%`);
            if (storesByName && storesByName.length > 0) {
                console.log(`  Fallback: Found by name! ID: ${storesByName[0].id}`);
                var storeId = storesByName[0].id;
            } else {
                continue;
            }
        } else {
            var storeId = stores[0].id;
        }

        // 2. Update
        const { error: updateError } = await supabase
            .from('stores')
            .update({
                website_url: update.url,
                affiliate_link_deals: update.url,
                affiliate_link_coupons: update.url
            })
            .eq('id', storeId);

        if (updateError) {
            console.error(`  Update Failed: ${updateError.message}`);
        } else {
            console.log(`  Success! Updated ${update.name} links.`);
        }
    }
}

updateStores();
