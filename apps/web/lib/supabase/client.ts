import { createBrowserClient } from '@supabase/ssr';

/**
 * Client Supabase pour le navigateur (Client Components).
 * Utilise la clé publishable — jamais la service role key côté client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
