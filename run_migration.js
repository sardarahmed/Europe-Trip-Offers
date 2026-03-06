const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Pull env vars (Assuming they are set in environment or I can read them)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    const migrationPath = path.join(__dirname, 'migrations', '20_add_redirect_slug.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error('Error running migration:', error);
        console.log('NOTE: If "exec_sql" is not found, you may need to run this SQL manually in the Supabase SQL Editor.');
        process.exit(1);
    }

    console.log('Migration completed successfully!');
}

runMigration();
