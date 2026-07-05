import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js middleware — refreshes the Supabase auth session on every
 * request. Delegates to `lib/supabase/middleware.ts` so the logic stays
 * reusable and testable.
 *
 * Runs on all routes except Next internals and static assets.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Match all paths except Next internals and static asset files.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|css|js|map)$).*)',
  ],
}
