const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkColumn() {
    console.log('Checking if affiliate_link exists in coupons table...');
    const { data, error } = await supabase.from('coupons').select('affiliate_link').limit(1);

    if (error) {
        console.error('Error:', error.message);
        if (error.message.includes('column "affiliate_link" does not exist')) {
            console.log('\nCONFIRMED: The column "affiliate_link" is missing from the "coupons" table.');
        }
    } else {
        console.log('SUCCESS: Column "affiliate_link" exists!');
    }
}

checkColumn();
