import { type NextRequest } from 'next/server'
import { updateSession } from './app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  console.log('Middleware invoked for URL:', request.nextUrl.href);
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}