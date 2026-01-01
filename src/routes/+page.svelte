<script lang="ts">
  import { enhance } from '$app/forms';
  export let data;
  
  // derived state for ui
  $: hasPulled = data.status === 'pulled';
  $: activeWeevil = data.myWeevil;
</script>

<div class="max-w-4xl mx-auto p-4 font-mono text-center">
  <h1 class="text-3xl font-bold mb-4 text-purple-300">
    {#if hasPulled}
      see you next wednesday.
    {:else}
      choose a location.
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

  {#if !hasPulled && data.landscape?.locations}
      {#each data.landscape.locations as loc}
        <form method="POST" action="?/pull" use:enhance>
           <button 
             class="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white px-4 py-2 rounded-full transition-all hover:scale-110 animate-pulse cursor-pointer"
             style="left: {loc.x}%; top: {loc.y}%;"
           >
             {loc.name}
           </button>
        </form>
      {/each}
    {/if}

    {#if hasPulled && activeWeevil}
      <div class="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div class="bg-gray-900/80 p-8 rounded-2xl border border-purple-500 backdrop-blur-xl animate-bounce-in">
          <img src={activeWeevil.image_url} alt={activeWeevil.name} class="w-48 h-48 object-contain mb-4 drop-shadow-glow"/>
          <h2 class="text-2xl font-bold text-purple-300">{activeWeevil.name}</h2>
          
          {#if activeWeevil.stats}
            <div class="mt-4 grid grid-cols-2 gap-2 text-xs text-left">
              {#each Object.entries(activeWeevil.stats) as [stat, val]}
                <div class="bg-black/50 p-1 px-2 rounded flex justify-between">
                  <span class="text-gray-400">{stat}:</span>
                  <span class="text-green-400">+{val}</span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <div class="mt-12 text-left">
    <div class="flex justify-between items-end border-b border-gray-700 pb-2 mb-4">
      <h2 class="text-xl font-bold">Recent Acquisitions</h2>
      <a href="/profile" class="text-sm text-purple-400 hover:underline">view full collection -></a>
    </div>
    
    <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
      {#each data.collection.slice(0, 6) as entry}
         <div class="bg-gray-800 p-2 rounded text-center opacity-75 hover:opacity-100">
            <img src={entry.weevils.image_url} class="w-full h-16 object-contain" alt="bug"/>
         </div>
      {/each}
    </div>
  </div>
</div>

<div class="mt-16 pt-8 border-t border-gray-800">
  <h3 class="text-gray-500 text-sm mb-4">danger zone</h3>
  
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

<style>
  /* simple drop shadow for the bug */
  .drop-shadow-glow { filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5)); }
</style>