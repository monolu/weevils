<script lang="ts">
  import WeevilModal from '$lib/WeevilModal.svelte'; // <--- Import it

  export let data;
  const { profile, collection } = data;
  
  const totalWeevils = collection.length;
  const uniqueWeevils = new Set(collection.map(c => c.weevils.id)).size;

  let selectedEntry: any = null;
</script>

<div class="max-w-4xl mx-auto p-8 font-mono relative">
  <div class="flex items-center gap-6 mb-12 border-b border-gray-700 pb-8">
    {#if profile.avatar_url}
      <img src={profile.avatar_url} alt="avatar" class="w-24 h-24 rounded-full border-4 border-purple-500 shadow-glow" />
    {:else}
      <div class="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
        <span class="text-3xl">?</span>
      </div>
    {/if}
    
    <div>
      <h1 class="text-4xl font-bold text-white mb-2">{profile.username ?? 'Unknown Collector'}</h1>
      <div class="text-xl text-gray-400">
        <span class="text-purple-300 font-bold">{totalWeevils}</span> Weevils, 
        <span class="text-green-300 font-bold">{uniqueWeevils}</span> Unique
      </div>
    </div>
  </div>

  <h2 class="text-xl mb-4 font-bold text-gray-400">Weevil Catalog</h2>
  
  {#if collection.length === 0}
    <div class="p-12 text-center text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
      <p class="mb-2 text-xl">🕸️</p>
      <p>This user has no weevils.</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {#each collection as entry}
        <button 
          onclick={() => selectedEntry = entry}
          class="group relative bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-all hover:-translate-y-1 hover:shadow-xl text-left w-full cursor-pointer"
        >
          <div class="aspect-square bg-black/40 rounded mb-2 flex items-center justify-center p-2">
            <img 
              src={entry.weevils.image_url} 
              alt="weevil: {entry.weevils.name}" 
              class="w-full h-full object-contain filter group-hover:drop-shadow-glow transition-all" 
            />
          </div>
          <p class="font-bold text-sm truncate text-gray-200">{entry.weevils.name}</p>
          <p class="text-[10px] text-gray-500">{new Date(entry.acquired_at).toLocaleDateString()}</p>
        </button>
      {/each}
    </div>
  {/if}
  
  <div class="mt-12">
    <a href="/" class="text-gray-500 hover:text-white transition-colors">← Back</a>
  </div>

  {#if selectedEntry}
    <WeevilModal entry={selectedEntry} onClose={() => selectedEntry = null} />
  {/if}
</div>

<style>
  .shadow-glow { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
  :global(.group:hover .drop-shadow-glow) { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)); }
</style>