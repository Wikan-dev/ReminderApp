import { createClient } from '@supabase/supabase-js';

// Masukkan URL dan ANON KEY asli kamu dari file .env
const SUPABASE_URL = "https://uyyfcktolqrutgbqvnnt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U52j3Z1SElTBD337dt4cyg_3Re7GDui";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);