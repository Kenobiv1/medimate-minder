// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rnnlyczmofqvvqajmcxo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJubmx5Y3ptb2ZxdnZxYWptY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTIwMTAsImV4cCI6MjA1OTQyODAxMH0.ceJ1Iq_1X8GpgDIS-bPk_K4gg-Gg9layw_wPKlkbkOk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);