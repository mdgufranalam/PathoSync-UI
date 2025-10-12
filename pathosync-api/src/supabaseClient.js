const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing. Make sure to set SUPABASE_URL and SUPABASE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
