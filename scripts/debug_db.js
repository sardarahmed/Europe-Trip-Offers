require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function test() {
    console.log('Testing connection to:', supabaseUrl);
    console.log('Key length:', supabaseKey.length);
    console.log('Is Service Role:', supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Try Simple Select
    console.log('\n1. Testing Select...');
    const { data: selectData, error: selectError } = await supabase.from('stores').select('*').limit(1);

    if (selectError) {
        console.error('Select Failed:', selectError);
    } else {
        console.log('Select Success. Count:', selectData.length);
        if (selectData.length > 0) console.log('Sample:', selectData[0]);
    }

    // 2. Try Insert (Store)
    console.log('\n2. Testing Insert (Store)...');
    const slug = `debug-store-${Date.now()}`;
    const payload = {
        name: 'Debug Store',
        slug: slug,
        website_url: 'https://example.com',
        is_featured: false
    };

    const { data: insertData, error: insertError } = await supabase.from('stores').insert(payload).select().single();

    if (insertError) {
        console.error('Insert Failed:', insertError);
        console.error('Raw Error Object:', JSON.stringify(insertError, Object.getOwnPropertyNames(insertError)));
    } else {
        console.log('Insert Success:', insertData);
        // Cleanup
        await supabase.from('stores').delete().eq('id', insertData.id);
    }
}

test();
