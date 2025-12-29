import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  // #region agent log
  const allCookies = request.cookies.getAll();
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));
  fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:4',message:'Middleware entry',data:{pathname,isAuthPage,hostname:request.nextUrl.hostname,protocol:request.nextUrl.protocol,totalCookies:allCookies.length,supabaseCookieCount:supabaseCookies.length,supabaseCookieNames:supabaseCookies.map(c=>c.name)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C,D'})}).catch(()=>{});
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
          fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:17',message:'setAll called',data:{cookieCount:cookiesToSet.length,cookieNames:cookiesToSet.map(c=>c.name),options:cookiesToSet.map(c=>({name:c.name,domain:c.options?.domain,path:c.options?.path,sameSite:c.options?.sameSite,secure:c.options?.secure}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
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
  fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:33',message:'getUser result',data:{hasUser:!!user,userId:user?.id,userEmail:user?.email,pathname,isAuthPage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
  // #endregion

  // Redirect unauthenticated users to login (except for login/signup pages)
  if (!user && !isAuthPage) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:39',message:'Redirecting to login - no user',data:{pathname,reason:'no_user'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login/signup pages
  if (user && isAuthPage) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:46',message:'Redirecting to home - user authenticated',data:{pathname,userId:user.id,reason:'authenticated_on_auth_page'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
    // #endregion
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:52',message:'Middleware allowing request',data:{pathname,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

