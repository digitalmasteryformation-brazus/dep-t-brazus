import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Client Supabase pour le serveur (Server Components, Route Handlers, Actions).
 * Lit/écrit les cookies de session via le store Next.js.
 */
export function createClient() {
    const cookieStore = cookies();

  return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
            cookies: {
                      get(name: string) {
                                  return cookieStore.get(name)?.value;
                      },
                      set(name: string, value: string, options: CookieOptions) {
                                  try {
                                                cookieStore.set({ name, value, ...options });
                                  } catch {
                                                // Appelé depuis un Server Component — ignorée si un middleware
                                    // rafraîchit déjà les sessions utilisateur.
                                  }
                      },
                      remove(name: string, options: CookieOptions) {
                                  try {
                                                cookieStore.set({ name, value: '', ...options });
                                  } catch {
                                                // idem
                                  }
                      },
            },
    }
      );
}
