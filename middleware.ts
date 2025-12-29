import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { writeFileSync } from 'fs'
import { join } from 'path'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  // #region agent log
  const allCookies = request.cookies.getAll();
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));
  const logData = {location:'middleware.ts:4',message:'Middleware entry',data:{pathname,isAuthPage,hostname:request.nextUrl.hostname,protocol:request.nextUrl.protocol,totalCookies:allCookies.length,supabaseCookieCount:supabaseCookies.length,supabaseCookieNames:supabaseCookies.map(c=>c.name)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C,D'};
  const logEntry = JSON.stringify(logData) + '\n';
  try { writeFileSync(join(process.cwd(), '.cursor', 'debug.log'), logEntry, { flag: 'a' }); } catch {}
  console.error('[DEBUG]', JSON.stringify(logData));
  supabaseResponse.headers.set('X-Debug-Middleware-Entry', JSON.stringify({pathname,supabaseCookieCount:supabaseCookies.length}));
  // #endregion

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          // #region agent log
          const logData2 = {location:'middleware.ts:17',message:'setAll called',data:{cookieCount:cookiesToSet.length,cookieNames:cookiesToSet.map(c=>c.name),options:cookiesToSet.map(c=>({name:c.name,domain:c.options?.domain,path:c.options?.path,sameSite:c.options?.sameSite,secure:c.options?.secure}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'};
          const logEntry = JSON.stringify(logData2) + '\n';
          try { writeFileSync(join(process.cwd(), '.cursor', 'debug.log'), logEntry, { flag: 'a' }); } catch {}
          console.error('[DEBUG]', JSON.stringify(logData2));
          // #endregion
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for proper authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // #region agent log
  const logData3 = {location:'middleware.ts:33',message:'getUser result',data:{hasUser:!!user,userId:user?.id,userEmail:user?.email,pathname,isAuthPage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
  const logEntry2 = JSON.stringify(logData3) + '\n';
  try { writeFileSync(join(process.cwd(), '.cursor', 'debug.log'), logEntry2, { flag: 'a' }); } catch {}
  console.error('[DEBUG]', JSON.stringify(logData3));
  supabaseResponse.headers.set('X-Debug-User', JSON.stringify({hasUser:!!user,pathname}));
  // #endregion

  // Redirect unauthenticated users to login (except for login/signup pages)
  if (!user && !isAuthPage) {
    // #region agent log
    const logData4 = {location:'middleware.ts:39',message:'Redirecting to login - no user',data:{pathname,reason:'no_user'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
    const logEntry3 = JSON.stringify(logData4) + '\n';
    try { writeFileSync(join(process.cwd(), '.cursor', 'debug.log'), logEntry3, { flag: 'a' }); } catch {}
    console.error('[DEBUG]', JSON.stringify(logData4));
    // #endregion
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.headers.set('X-Debug-Redirect', 'to-login-no-user')
    return redirectResponse
  }

  // Redirect authenticated users away from login/signup pages
  if (user && isAuthPage) {
    // #region agent log
    const logData5 = {location:'middleware.ts:46',message:'Redirecting to home - user authenticated',data:{pathname,userId:user.id,reason:'authenticated_on_auth_page'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'};
    const logEntry4 = JSON.stringify(logData5) + '\n';
    try { writeFileSync(join(process.cwd(), '.cursor', 'debug.log'), logEntry4, { flag: 'a' }); } catch {}
    console.error('[DEBUG]', JSON.stringify(logData5));
    // #endregion
    const url = request.nextUrl.clone()
    url.pathname = '/'
    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.headers.set('X-Debug-Redirect', 'to-home-authenticated')
    return redirectResponse
  }

  // #region agent log
  const logData6 = {location:'middleware.ts:52',message:'Middleware allowing request',data:{pathname,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'};
  const logEntry5 = JSON.stringify(logData6) + '\n';
  try { writeFileSync(join(process.cwd(), '.cursor', 'debug.log'), logEntry5, { flag: 'a' }); } catch {}
  console.error('[DEBUG]', JSON.stringify(logData6));
  supabaseResponse.headers.set('X-Debug-Allow', JSON.stringify({pathname,hasUser:!!user}));
  // #endregion

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

