<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  
  // We accept the full entry (weevil data + acquisition date)
  export let entry: any;
  export let onClose: () => void;

  // Handle escape key
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div 
  class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  role="button"
  tabindex="0"
  onclick={onClose}
  transition:fade={{ duration: 150 }}
>
  <div 
    class="bg-gray-900 border-2 border-purple-500 rounded-2xl max-w-md w-full p-8 relative shadow-2xl"
    onclick={(e) => e.stopPropagation()} 
    role="dialog"
    transition:scale={{ duration: 200, start: 0.9 }}
  >
    <button onclick={onClose} class="absolute top-4 right-4 text-gray-500 hover:text-white text-xl cursor-pointer">✕</button>
    
    <div class="text-center">
      <h2 class="text-3xl font-bold text-purple-300 mb-2 capitalize">{entry.weevils.name}</h2>
      
      <p class="text-gray-500 text-sm mb-6">
        Acquired on {entry.acquired_at ? new Date(entry.acquired_at).toLocaleDateString() : new Date().toLocaleDateString()}
      </p>
      
      <div class="bg-black/40 rounded-xl p-6 mb-6 inline-block w-full">
        <img src={entry.weevils.image_url} alt={entry.weevils.name} class="w-48 h-48 object-contain mx-auto drop-shadow-glow" />
      </div>
      
      <h3 class="text-left text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Specimen Stats</h3>
      <div class="grid grid-cols-2 gap-3">
          {#if entry.weevils.stats && Object.keys(entry.weevils.stats).length > 0}
            {#each Object.entries(entry.weevils.stats) as [key, val]}
              <div class="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
                <span class="text-gray-400 text-sm capitalize">{key}</span>
                <span class="text-green-400 font-mono font-bold">+{val}</span>
              </div>
            {/each}
          {:else}
            <p class="col-span-2 text-gray-600 text-sm italic py-2">None... :(</p>
          {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .drop-shadow-glow { filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5)); }
</style>