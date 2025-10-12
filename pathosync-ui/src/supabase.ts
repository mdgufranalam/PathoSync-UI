import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hhisvgdsthbcqdvxcghr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaXN2Z2RzdGhiY3FkdnhjZ2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDA3MzIsImV4cCI6MjA3NTgxNjczMn0.L3CQWMzRFChdU2bCKIDF0C8WqD19xumNGQEG5u-h0nc'

export const supabase = createClient(supabaseUrl, supabaseKey)