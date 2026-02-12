// // middleware.ts
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function proxy(req: NextRequest) {
//   const res = NextResponse.next()

//   // Updated cookies adapter: only get() is needed
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return req.cookies.get(name)?.value
//         },
//         // delete() removed
//         // set() can be implemented if needed
//       },
//     }
//   )

//   const { data: { session } } = await supabase.auth.getSession()

//   const publicRoutes = ['/login', '/signup', '/about']
//   const isPublicRoute = publicRoutes.some((route) =>
//     req.nextUrl.pathname.startsWith(route)
//   )

//   if (!session && !isPublicRoute) {
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

//   if (session && ['/login', '/signup'].includes(req.nextUrl.pathname)) {
//     return NextResponse.redirect(new URL('/home', req.url))
//   }

//   return res
// }

// export const config = {
//   matcher: [
//     '/((?!_next/|api/|auth/|rest/|storage/|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|ts|js|map)).*)',
//   ],
// }

// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rename this to 'middleware' so Next.js recognizes it!
export async function proxy(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          // This allows the server components to see the updated session
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // refreshes the session if expired
  const { data: { session } } = await supabase.auth.getSession()

  const publicRoutes = ['/login', '/signup', '/about']
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // If no session and trying to access private route
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If logged in and trying to access auth pages
  if (session && ['/login', '/signup'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones provided below:
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}