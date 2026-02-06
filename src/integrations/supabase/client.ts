import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wzometbsdbafwpeopieq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b21ldGJzZGJhZndwZW9waWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODk4NzEsImV4cCI6MjA4NTk2NTg3MX0.nwoUwfpgvJSghFw3sEWcu6EBYmtz7_Nhd7EkaNwYofQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);