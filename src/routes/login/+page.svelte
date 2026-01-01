<script lang="ts">
  import { supabase } from '$lib/supabaseClient' 
  
  const signIn = async () => {
    // make sure this URL matches exactly what you put in discord dev portal
    // AND supabase auth settings > URL Configuration > Redirect URLs
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }
</script>

<div class="flex flex-col items-center justify-center h-screen">
  <button on:click={signIn} class="bg-indigo-600 text-white p-4 rounded-xl font-bold">
    Login with Discord
  </button>
</div>