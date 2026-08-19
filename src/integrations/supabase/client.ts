import { createClient, processLock } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    // The default `navigatorLock` uses the cross-tab Web Locks API with no
    // acquire timeout - if that lock ever gets orphaned (a stale/reloaded
    // tab that didn't release it), every single Supabase call in the app
    // hangs forever with no error, since every .from()/.auth call internally
    // waits on this same lock to get the session. processLock is a simple
    // in-memory, per-tab lock that can't get orphaned the same way.
    lock: processLock,
  }
});