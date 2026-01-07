const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZMUne72FC_KU4SdMikuPUQ_fxFNRzUz';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkStoreUrls() {
    console.log('Fetching store URLs...');

    const { data: stores, error } = await supabase
        .from('stores')
        .select('name, slug, website_url')
        .limit(20);

    if (error) {
        console.error('Error fetching stores:', error.message);
        return;
    }

    console.log('Found', stores.length, 'stores.');
    stores.forEach(store => {
        console.log(`Store: ${store.name}`);
        console.log(`  Slug: ${store.slug}`);
        console.log(`  Website URL: '${store.website_url}'`); // Quotes to see empty strings/spaces

        let status = 'OK';
        if (!store.website_url) status = 'MISSING';
        else if (!store.website_url.startsWith('http')) status = 'INVALID (No http/https)';
        else if (store.website_url.includes('localhost')) status = 'WARNING (Localhost)';

        console.log(`  Status: ${status}`);
        console.log('---');
    });
}

checkStoreUrls();
