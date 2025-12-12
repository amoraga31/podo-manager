
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
    console.log('✅ [Supabase] Initializing client...')
    console.log('   -> URL:', supabaseUrl) // Safe to log URL
    console.log('   -> Key Length:', supabaseAnonKey.length) // Check if key is truncated
    supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
    console.error('❌ [Supabase] Missing Environment Variables!')
    console.log('   -> URL:', supabaseUrl)
    console.log('   -> Key:', supabaseAnonKey)
}

export { supabase }
