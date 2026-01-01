<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient';
  import WeevilModal from '$lib/WeevilModal.svelte';

  export let data;
  export let form;

  $: isGuest = data.status === 'guest';
  $: hasPulled = data.status === 'pulled';
  $: activeWeevil = data.myWeevil;

  // Modal State
  let selectedEntry: any = null;

  // Logic: If we successfully pulled a new bug, show the modal immediately!
  $: if (form?.success && activeWeevil) {
     // We construct a fake entry object because the form result doesn't have the DB timestamp yet
     selectedEntry = { weevils: activeWeevil, acquired_at: new Date() };
     form = null; // Clear form so it doesn't reopen on reload
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${location.origin}/auth/callback` }
    });
    if (error) alert(error.message);
  };
</script>

<div class="max-w-4xl mx-auto p-4 font-mono text-center">
  <h1 class="text-3xl font-bold mb-4 text-purple-300">
    {#if isGuest}
      YOU ARE NOT LOGGED IN
    {:else if hasPulled}
      YOU HAVE PULLED YOUR WEEVIL FOR THE WEEK
    {:else}
      CHOOSE A LOCATION
    {/if}
  </h1>

  <div class="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden border-4 border-purple-900 shadow-2xl group">
    
    {#if data.landscape}
      <img 
        src={data.landscape.image_url} 
        alt="landscape" 
        class="w-full h-full object-cover transition-all duration-1000 {hasPulled ? 'blur-sm brightness-50' : ''}"
      />
    {/if}

    {#if isGuest}
      <div class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <button 
          type="button"
          onclick={signIn}
          class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all text-xl border-2 border-purple-400 cursor-pointer"
        >
          Sign In with Discord
        </button>
      </div>

    {:else if !hasPulled && data.landscape?.locations}
      {#each data.landscape.locations as loc}
        <form method="POST" action="?/pull" use:enhance>
           <button 
             class="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white px-4 py-2 rounded-full transition-all hover:scale-110 animate-pulse cursor-pointer shadow-lg"
             style="left: {loc.x}%; top: {loc.y}%;"
           >
            {loc.name}
           </button>
        </form>
      {/each}
    {/if}

    {#if hasPulled && activeWeevil}
      <button 
        onclick={() => selectedEntry = { weevils: activeWeevil, acquired_at: null }}
        class="absolute inset-0 flex flex-col items-center justify-center z-20 cursor-pointer hover:scale-105 transition-transform"
      >
        <div class="bg-gray-900/80 p-8 rounded-2xl border border-purple-500 backdrop-blur-xl animate-bounce-in">
          <img src={activeWeevil.image_url} alt={activeWeevil.name} class="w-48 h-48 object-contain mb-4 drop-shadow-glow"/>
          <h2 class="text-2xl font-bold text-purple-300">{activeWeevil.name}</h2>
          <p class="text-xs text-gray-400 mt-2">(click to inspect)</p>
        </div>
      </button>
    {/if}
  </div>

  <div class="mt-12 text-left">
    <div class="flex justify-between items-end border-b border-gray-700 pb-2 mb-4">
      <h2 class="text-xl font-bold">Recent Pulls</h2>
      {#if !isGuest}
        <a href="/profile" class="text-sm text-purple-400 hover:underline">view full collection -></a>
      {/if}
    </div>
    
    <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
      {#each data.collection.slice(0, 6) as entry}
         <button 
            onclick={() => selectedEntry = entry}
            class="bg-gray-800 p-2 rounded text-center opacity-75 hover:opacity-100 hover:bg-gray-700 transition-all cursor-pointer"
         >
            <img src={entry.weevils.image_url} class="w-full h-16 object-contain" alt="bug"/>
         </button>
      {/each}
      {#if data.collection.length === 0}
        <div class="col-span-full text-gray-500 text-sm italic py-4">
          {isGuest ? 'Sign in to see your collection.' : 'No weevils yet...'}
        </div>
      {/if}
    </div>
  </div>
</div>

{#if selectedEntry}
  <WeevilModal entry={selectedEntry} onClose={() => selectedEntry = null} />
{/if}

{#if !isGuest}
  <div class="mt-16 pt-8 border-t border-gray-800">
    <h3 class="text-gray-500 text-sm mb-4">debug</h3>
    <form method="POST" action="?/reset" use:enhance>
      <button 
        type="submit"
        onclick={(e) => { if (!confirm('are you sure you want to kill them all?')) e.preventDefault() }}
        class="bg-red-900/50 hover:bg-red-600 text-red-200 text-sm py-2 px-4 rounded border border-red-800 transition-colors cursor-pointer"
      >
        kill your weevils
      </button>
    </form>
  </div>
{/if}

<style>
  .drop-shadow-glow { filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5)); }
</style>