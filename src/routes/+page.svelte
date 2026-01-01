<script lang="ts">
  import { enhance } from '$app/forms';
  export let data;
  export let form;
  
  $: newWeevil = form?.success 
     ? data.collection.find(w => w.weevils.id === form.weevilId) 
     : null;
</script>

<div class="max-w-2xl mx-auto p-8 text-center font-mono">
  <h1 class="text-4xl font-bold mb-8 text-purple-400">it is wednesday.</h1>

  <form method="POST" action="?/pull" use:enhance>
    <button class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform active:scale-95 transition-all text-xl">
      Acquire Weevil
    </button>
  </form>

  {#if form?.success && newWeevil}
    <div class="my-8 p-6 bg-gray-800 rounded-xl border-2 border-green-400 animate-bounce">
      <h2 class="text-2xl text-green-400 mb-2">🎉 WEEVIL ACQUIRED! 🎉</h2>
      
      <img src={newWeevil.weevils.image_url} alt="new bug" class="w-48 h-48 mx-auto rounded-full object-cover border-4 border-white"/>
      <p class="text-xl mt-4 font-bold capitalize">{newWeevil.weevils.name}</p>
    </div>
  {/if}

  <h2 class="mt-12 text-2xl font-bold text-left border-b border-gray-700 pb-2 mb-4">Your Bin ({data.collection.length})</h2>
  
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    {#each data.collection as entry}
      <div class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
        <img 
          src={entry.weevils.image_url} 
          alt={entry.weevils.name} 
          class="w-full h-32 object-cover rounded bg-black mb-2"
        />
        <p class="capitalize text-sm">{entry.weevils.name}</p>
        <p class="text-xs text-gray-500">{new Date(entry.acquired_at).toLocaleDateString()}</p>
      </div>
    {/each}
  </div>
</div>
<div class="mt-16 pt-8 border-t border-gray-800">
  <h3 class="text-gray-500 text-sm mb-4">Danger Zone (Debug)</h3>
  
  <form method="POST" action="?/reset" use:enhance>
  <button 
      type="submit"
      onclick={(e) => { if (!confirm('are you sure you want to kill them all?')) e.preventDefault() }}
      class="bg-red-900/50 hover:bg-red-600 text-red-200 text-sm py-2 px-4 rounded border border-red-800 transition-colors"
  >
      ⚠️ NUKE COLLECTION
    </button>
  </form>
</div>