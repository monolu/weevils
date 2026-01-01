<script lang="ts">
    import '../app.css';
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import favicon from '$lib/assets/favicon.svg';
    import { supabase } from '$lib/supabaseClient';

    let { children, data } = $props();
    let { session } = $derived(data); // Don't rely on 'supabase' from data

    onMount(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        });

        return () => authListener.subscription.unsubscribe();
    });

    const signIn = async () => {
        console.log("Navbar sign in clicked...");
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        });
        if (error) console.error(error);
    };
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="p-4 border-b flex justify-between items-center bg-gray-900/50 backdrop-blur sticky top-0 z-50">
	<a href="/" class="font-bold text-purple-400 text-xl tracking-tight">Weevil Catalog</a>
	
{#if session}
		<div class="flex items-center gap-4">
			<a href="/profile" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">
				<span class="font-mono text-sm text-gray-300 hidden md:inline group-hover:text-white transition-colors">
					howdy, <span class="text-white font-bold underline decoration-transparent group-hover:decoration-purple-500 transition-all">{session.user.user_metadata.full_name ?? session.user.email}</span>
				</span>
				
				{#if session.user.user_metadata.avatar_url}
					<img 
						src={session.user.user_metadata.avatar_url} 
						alt="avatar" 
						class="w-8 h-8 rounded-full border border-purple-500 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all"
					/>
				{/if}
			</a>

			<button 
				onclick={() => supabase.auth.signOut()} 
				class="bg-gray-800 hover:bg-red-900/80 text-gray-200 hover:text-white border border-gray-700 hover:border-red-500 px-4 py-2 rounded font-bold text-sm transition-all ml-2 shadow-lg hover:shadow-red-500/20 cursor-pointer"
			>
				Sign Out
			</button>
		</div>
	{:else}
		<button 
        type="button"
        onclick={signIn}
        class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded font-bold text-sm transition-all shadow-lg hover:shadow-purple-500/20 cursor-pointer"
    >
        Sign In
    </button>
	{/if}
</nav>

{@render children()}