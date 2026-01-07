const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZMUne72FC_KU4SdMikuPUQ_fxFNRzUz';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixStoreUrls() {
    console.log('Fixing store URLs...');

    // Fix Viator
    // Original malformed: "viator\nvi.me/fF2jN"
    // Target: "https://vi.me/fF2jN"

    // We'll also just set Expedia to generic valid URL for testing, or leave it. 
    // Let's just fix Viator since that's likely the one they clicked (store details page).

    const { data, error } = await supabase
        .from('stores')
        .update({ website_url: 'https://vi.me/fF2jN' }) // Added https:// and removed junk
        .eq('slug', 'viator') // Assuming slug is 'viator' based on previous output
        .select();

    if (error) {
        console.error('Error updating Viator:', error.message);
    } else {
        console.log('Updated Viator URL:', data);
    }
}

fixStoreUrls();
