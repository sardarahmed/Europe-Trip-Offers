require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStore() {
    const { data, error } = await supabase
        .from('stores')
        .update({ website_url: 'https://expedia.com/affiliate/ePXMSdi' })
        .eq('slug', 'Expedia')
        .select();

    if (error) {
        console.error('Error updating store:', error);
        return;
    }

    console.log('Updated Store:', data);
}

updateStore();
