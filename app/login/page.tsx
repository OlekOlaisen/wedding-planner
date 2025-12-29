'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // #region agent log
    const logData1 = {location:'app/login/page.tsx:16',message:'Login attempt started',data:{email,hostname:window.location.hostname,protocol:window.location.protocol},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
    console.error('[DEBUG LOGIN]', JSON.stringify(logData1));
    fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
    // #endregion

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // #region agent log
      const logData2 = {location:'app/login/page.tsx:25',message:'signInWithPassword response',data:{hasError:!!error,hasUser:!!data?.user,errorMessage:error?.message,userId:data?.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
      console.error('[DEBUG LOGIN]', JSON.stringify(logData2));
      fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
      // #endregion

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Verify session is established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // #region agent log
        const cookiesBeforeRedirect = document.cookie.split('; ').map(c => {
          const [name, ...rest] = c.split('=');
          return {name, hasValue:rest.length > 0, valueLength:rest.join('=').length};
        });
        const logData3 = {location:'app/login/page.tsx:35',message:'Session check before redirect',data:{hasSession:!!session,hasSessionError:!!sessionError,sessionError:sessionError?.message,accessToken:session?.access_token?.substring(0,20)+'...',cookieCount:cookiesBeforeRedirect.length,cookies:cookiesBeforeRedirect},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C,D'};
        console.error('[DEBUG LOGIN]', JSON.stringify(logData3));
        fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch(()=>{});
        // #endregion
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Failed to establish session. Please try again.')
          setLoading(false)
          return
        }
        
        if (session) {
          // #region agent log
          const logData4 = {location:'app/login/page.tsx:47',message:'Starting redirect timer',data:{delay:200,currentPath:window.location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,E'};
          console.error('[DEBUG LOGIN]', JSON.stringify(logData4));
          fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData4)}).catch(()=>{});
          // #endregion
          // Wait for cookies to be set by the browser client
          // Then do a full page reload to ensure middleware sees the cookies
          setTimeout(() => {
            // #region agent log
            const cookiesAtRedirect = document.cookie.split('; ').map(c => {
              const [name, ...rest] = c.split('=');
              return {name, hasValue:rest.length > 0, valueLength:rest.join('=').length};
            });
            const logData5 = {location:'app/login/page.tsx:49',message:'Executing redirect',data:{target:'/',cookieCount:cookiesAtRedirect.length,cookies:cookiesAtRedirect,supabaseCookies:cookiesAtRedirect.filter(c=>c.name.includes('supabase')||c.name.includes('sb-'))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'};
            console.error('[DEBUG LOGIN]', JSON.stringify(logData5));
            fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData5)}).catch(()=>{});
            // #endregion
            window.location.href = '/'
          }, 200)
        } else {
          setError('Session not established. Please try again.')
          setLoading(false)
        }
      }
    } catch (err) {
      // #region agent log
      const logData6 = {location:'app/login/page.tsx:56',message:'Login exception',data:{errorMessage:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
      console.error('[DEBUG LOGIN]', JSON.stringify(logData6));
      fetch('http://127.0.0.1:7242/ingest/d9aea05c-d274-46a3-8b91-b94b9b6e2e67',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData6)}).catch(()=>{});
      // #endregion
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your wedding planner account</p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link href="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

