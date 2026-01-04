require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase
        .from('cities')
        .select('name, image_url')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

check();
