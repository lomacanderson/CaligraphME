import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here';

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not configured. Please set up your .env file with:');
  console.warn('   VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.warn('   VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  console.warn('   Authentication features will not work until configured.');
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

