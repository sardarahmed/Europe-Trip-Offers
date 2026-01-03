const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZMUne72FC_KU4SdMikuPUQ_fxFNRzUz';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixImages() {
    console.log('Fixing activity images...');

    // 1. Fix Louvre
    const { error: err1 } = await supabase
        .from('activities')
        .update({
            image_url: 'https://images.unsplash.com/photo-1565099824688-e93930dfa874?q=80&w=2070'
        })
        .ilike('title', '%Louvre%');

    if (err1) console.error('Error fixing Louvre:', err1);
    else console.log('Fixed Louvre image URL.');

    // 2. Fix Colosseum (Just in case)
    const { error: err2 } = await supabase
        .from('activities')
        .update({
            image_url: 'https://images.unsplash.com/photo-1552483775-55f909110ddf?q=80&w=2000'
        })
        .ilike('title', '%Colosseum%');

    if (err2) console.error('Error fixing Colosseum:', err2);
    else console.log('Fixed Colosseum image URL.');
}

fixImages();
