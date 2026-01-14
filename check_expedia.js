require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStore() {
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', 'expedia'); // Assuming slug is expedia, or we can search by name

    if (error) {
        console.error('Error fetching store:', error);
        return;
    }

    console.log('Stores found for "expedia":', data);

    const { data: allStores } = await supabase.from('stores').select('name, slug, website_url');
    console.log('All stores count:', allStores.length);
    console.log('All stores slugs:', allStores.map(s => s.slug).join(', '));
}

checkStore();
