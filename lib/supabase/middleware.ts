import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Supabase session-refresh middleware for Next.js.
 *
 * Refreshes the auth session on every request by reading the request cookies,
 * passing them to a server Supabase client, calling `getUser()` (which
 * refreshes the access token if it's about to expire), and writing any updated
 * cookies back to the response.
 *
 * Run this in `middleware.ts` at the root of the project (see the file
 * `middleware.ts` which re-exports this).
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, skip session refresh (e.g. local dev
  // before env vars are set) so the app still renders.
  if (!url || !anonKey) {
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }

  // Build a response that we can mutate cookies on.
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        // Set on the outgoing response…
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as never),
        )
        // …and also on the request so downstream handlers see the new value.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
      },
    },
  })

  /**
   * `getUser()` both refreshes the session (if needed) and securely
   * validates the user on the server. Avoid `getSession()` here, which does
   * not refresh and reads from a potentially-tampered cookie.
   */
  await supabase.auth.getUser()

  return response
}

export default updateSession
