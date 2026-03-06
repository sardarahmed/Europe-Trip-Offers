require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanupStores() {
    // 1. Fetch all Viator stores
    const { data: stores, error } = await supabase
        .from('stores')
        .select('*')
        .ilike('name', '%viator%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stores:', error);
        return;
    }

    console.log("Found Viator stores:");
    console.table(stores.map(s => ({ id: s.id, name: s.name, slug: s.slug, created_at: s.created_at })));

    if (stores.length > 1) {
        // Keep the oldest one (the original), delete the newest ones
        const toDelete = stores.slice(0, stores.length - 1);
        const idsToDelete = toDelete.map(s => s.id);
        
        console.log(`Deleting ${idsToDelete.length} duplicate store(s)...`);
        
        const { error: deleteError } = await supabase
            .from('stores')
            .delete()
            .in('id', idsToDelete);
            
        if (deleteError) {
            console.error('Error deleting duplicate stores:', deleteError);
        } else {
            console.log('Successfully deleted duplicate Viator store(s).');
        }
    } else {
        console.log("Only 1 Viator store found. Not deleting anything.");
    }
}

cleanupStores();
