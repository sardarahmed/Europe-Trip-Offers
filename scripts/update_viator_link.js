require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateViatorUrl() {
    const affiliateUrl = "https://www.viator.com/?pid=P00275081&mcid=42383&medium=link&medium_version=selector&campaign=new-1";

    // Update Stores table for Viator
    const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .update({ website_url: affiliateUrl })
        .ilike('name', '%viator%')
        .select();

    if (storeError) {
        console.error('Error updating store:', storeError);
    } else {
        console.log(`Updated website_url for store(s):`, storeData.map(s => s.name));
    }
}

updateViatorUrl();
