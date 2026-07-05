import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client.
 * Returns a lazy singleton — doesn't throw at import time if env vars are missing.
 */

let client: ReturnType<typeof createBrowserClient> | null = null

export function createSupabaseBrowserClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Return a mock client that no-ops instead of throwing
    // This allows the build to succeed without env vars
    return new Proxy({} as ReturnType<typeof createBrowserClient>, {
      get: () => () => Promise.resolve({ data: null, error: null }),
    })
  }

  client = createBrowserClient(url, anonKey)
  return client
}

/** Alias for convenience. */
export const createClient = createSupabaseBrowserClient

/** Default singleton — lazy, safe to import at module level. */
export const supabaseBrowser = createSupabaseBrowserClient()

export default supabaseBrowser
