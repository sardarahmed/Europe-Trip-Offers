require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listStores() {
    const { data: stores, error } = await supabase.from('stores').select('id, name, website_url');
    console.table(stores);

    const affiliateUrl = "https://www.viator.com/?pid=P00275081&mcid=42383&medium=link&medium_version=selector&campaign=new-1";
    const viatorIds = stores.filter(s => s.name.toLowerCase().includes('viator')).map(s => s.id);
    
    if (viatorIds.length > 0) {
        const { data, error: updateError } = await supabase
            .from('stores')
            .update({ website_url: affiliateUrl })
            .in('id', viatorIds)
            .select('name');
        console.log("Updated:", data);
    } else {
        console.log("No store with 'viator' found.");
    }
}

listStores();
