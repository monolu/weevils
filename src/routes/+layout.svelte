<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
	let { session, supabase: supabaseInstance } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="p-4 border-b flex justify-between">
	<a href="/" class="font-bold">Weevil Wednesday</a>
	{#if session}
		<div class="flex gap-4">
			<span>Sup, {session.user.email}</span>
			<button onclick={() => supabase.auth.signOut()}>Logout</button>
		</div>
	{:else}
		<a href="/login">Login</a>
	{/if}
</nav>

{@render children()}