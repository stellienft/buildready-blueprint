import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Server-side Supabase client for Server Components, Route Handlers,
 * and Server Actions.
 *
 * Uses `@supabase/ssr`'s `createServerClient` with Next.js' `cookies()` async
 * helper to read and refresh the auth session across requests.
 *
 * NOTE: In Next.js 15 `cookies()` is async — we read it once and pass the
 * same getters/setters to the SSR client. Each request should construct a
 * fresh client (do not cache across requests).
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Return mock instead of throwing — allows build without env vars
    return new Proxy({} as Awaited<ReturnType<typeof createServerClient>>, {
      get: () => () => Promise.resolve({ data: null, error: null }),
    }) as Awaited<ReturnType<typeof createServerClient>>
  }

  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as never),
          )
        } catch {
          /**
           * The `set` method was called from a Server Component, where it
           * cannot mutate cookies. This is safe to ignore if middleware
           * refreshes the session — see `lib/supabase/middleware.ts`.
           */
        }
      },
    },
  })
}

export default createSupabaseServerClient
