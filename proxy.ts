// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Updated cookies adapter: only get() is needed
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        // delete() removed
        // set() can be implemented if needed
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const publicRoutes = ['/login', '/signup', '/about']
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session && ['/login', '/signup'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/|api/|auth/|rest/|storage/|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|ts|js|map)).*)',
  ],
}
