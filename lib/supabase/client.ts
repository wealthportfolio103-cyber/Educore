/**
 * Browser-side Supabase Client
 * Utilizes @supabase/ssr createBrowserClient for singleton browser auth session sharing.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

// Memoized browser client instance to prevent multiple client instances during client re-renders
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;
let currentClientUrl = '';
let currentClientKey = '';

/**
 * Retrieves the current Supabase configuration and checks validity
 */
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = '';
  let anonKey = '';

  // 1. Check process.env (Next.js & Vite build replacements)
  if (typeof process !== 'undefined' && process.env) {
    url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }

  // 2. Check browser localStorage for user-provided credentials
  if (typeof window !== 'undefined') {
    try {
      const storedUrl = localStorage.getItem('NEXT_PUBLIC_SUPABASE_URL');
      const storedKey = localStorage.getItem('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      if (storedUrl) url = storedUrl;
      if (storedKey) anonKey = storedKey;
    } catch {
      // LocalStorage access may fail in restricted iframes
    }
  }

  // Validate configuration against placeholder values
  const isPlaceholder =
    !url ||
    !anonKey ||
    url.includes('your-project-ref') ||
    url.includes('mock-school-demo') ||
    url.includes('placeholder.supabase') ||
    anonKey.includes('your-anon-public-key') ||
    anonKey.includes('mock-anon-key') ||
    anonKey.includes('placeholder-anon-key');

  const isValidUrl = url.startsWith('https://') || url.startsWith('http://');

  return {
    url: url || 'https://placeholder.supabase.co',
    anonKey: anonKey || 'placeholder-anon-key',
    isConfigured: !isPlaceholder && isValidUrl,
  };
}

/**
 * Returns true if real Supabase credentials are configured
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

/**
 * Allows updating credentials at runtime (saved to localStorage for instant testing)
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('NEXT_PUBLIC_SUPABASE_URL', url.trim());
      localStorage.setItem('NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey.trim());
      // Invalidate memoized instance so the next createClient call uses the new credentials
      clientInstance = null;
    } catch (e) {
      console.error('Failed to store Supabase credentials:', e);
    }
  }
}

/**
 * Clears stored credentials from localStorage
 */
export function clearSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('NEXT_PUBLIC_SUPABASE_URL');
      localStorage.removeItem('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      clientInstance = null;
    } catch (e) {
      console.error('Failed to clear Supabase credentials:', e);
    }
  }
}

/**
 * Singleton factory for Supabase browser client
 */
export function createClient() {
  const { url, anonKey } = getSupabaseConfig();

  // If already instantiated with the same credentials, return cached instance
  if (clientInstance && currentClientUrl === url && currentClientKey === anonKey) {
    return clientInstance;
  }

  currentClientUrl = url;
  currentClientKey = anonKey;
  clientInstance = createBrowserClient<Database>(url, anonKey);
  return clientInstance;
}
