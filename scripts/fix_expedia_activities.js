require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixActivities() {
    // Get Viator's ID
    const { data: viatorStore } = await supabase.from('stores').select('id').eq('name', 'Viator').single();
    if (!viatorStore) {
        console.error('Viator store not found');
        return;
    }
    
    // Get Expedia's ID
    const { data: expediaStore } = await supabase.from('stores').select('id').eq('slug', 'Expedia').single();
    
    console.log(`Expedia ID: ${expediaStore.id}`);
    console.log(`Viator ID: ${viatorStore.id}`);
    
    // Update all activities that are currently Expedia to Viator
    const { data, error } = await supabase
        .from('activities')
        .update({ store_id: viatorStore.id })
        .eq('store_id', expediaStore.id)
        .select();

    if (error) {
        console.error('Error fixing activities:', error);
    } else {
        console.log(`Fixed ${data.length} activities. They are now assigned to Viator.`);
    }
}

fixActivities();
