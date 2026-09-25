/**
 * Browser-side Supabase Client
 * Utilizes @supabase/ssr createBrowserClient for singleton browser auth session sharing.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

// Memoized browser client instance to prevent multiple client instances during client re-renders
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-school-demo.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-school-mgmt-system-2025';

  clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return clientInstance;
}
