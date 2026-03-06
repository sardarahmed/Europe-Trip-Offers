require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
    const { data: stores, error: sErr } = await supabase.from('stores').select('id, name, slug');
    console.log('STORES:');
    console.table(stores);

    const { data: activities, error: aErr } = await supabase.from('activities').select('id, title, store_id');
    console.log('\nACTIVITIES:');
    console.table(activities);
}
main();
