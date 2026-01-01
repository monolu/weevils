import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      console.log('Session exchanged successfully. Redirecting to:', next)
      throw redirect(303, next)
    }
    
    console.error('Auth Exchange Error:', error)
  } else {
    console.log('No code found in URL parameters.')
  }

  throw redirect(303, '/auth/auth-code-error')
}