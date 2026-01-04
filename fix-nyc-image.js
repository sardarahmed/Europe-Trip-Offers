require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixImage() {
    console.log("Fixing New York Image...");

    // 1. Valid Direct Image URL for New York (Empire State Building)
    const validUrl = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop";

    // 2. Update the row
    const { data, error } = await supabase
        .from('cities')
        .update({ image_url: validUrl })
        .ilike('name', '%New York%') // Matches "New York", "New York City", etc.
        .select();

    if (error) {
        console.error("Error updating:", error);
    } else {
        console.log("Success! Updated cities:", data.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

fixImage();
