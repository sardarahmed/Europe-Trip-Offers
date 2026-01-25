require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('--- Verifying Famous Cities ---');
    const { data: cities } = await supabase.from('cities').select('name, featured').eq('featured', true);
    console.log('Featured Cities:', cities.map(c => c.name).join(', '));

    console.log('\n--- Verifying Viator Activities ---');
    const { data: activities } = await supabase.from('activities').select('title, affiliate_link, price').ilike('affiliate_link', '%viator%').limit(5);

    if (activities.length === 0) {
        console.log('No Viator activities found yet.');
    } else {
        activities.forEach(a => {
            console.log(`[${a.title}] - €${a.price}`);
            console.log(`Link: ${a.affiliate_link}`);
        });
    }
}

verify();
