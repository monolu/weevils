import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession, supabase } }) => {
  const { session } = await safeGetSession();
  
  // fetch the user's collection
  const { data: collection } = await supabase
    .from('user_weevils')
    .select('acquired_at, weevils(name, image_url)')
    .eq('user_id', session?.user?.id) // only show MY weevils
    .order('acquired_at', { ascending: false });

  return {
    collection: collection ?? [],
    user: session?.user
  };
};

export const actions = {
  pull: async ({ locals: { safeGetSession, supabase } }) => {
    const { session } = await safeGetSession();
    
    if (!session) {
      return fail(401, { message: 'you must be logged in to collect bugs' });
    }

    const { data: allWeevils } = await supabase.from('weevils').select('id');
    
    if (!allWeevils || allWeevils.length === 0) {
      return fail(500, { message: 'no weevils found in database' });
    }
    
    const winner = allWeevils[Math.floor(Math.random() * allWeevils.length)];

    const { error: insertError } = await supabase
      .from('user_weevils')
      .insert({ 
        weevil_id: winner.id, 
        user_id: session.user.id 
      }); 

    if (insertError) {
      console.error('Weevil Save Error:', insertError);
      return fail(500, { message: 'failed to save weevil' });
    }

    return { success: true, weevilId: winner.id };
  },
  
  reset: async ({ locals: { safeGetSession, supabase } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: 'who are you?' });

    // delete everything where user_id matches the logged in user
    const { error } = await supabase
      .from('user_weevils')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error(error);
      return fail(500, { message: 'failed to nuke' });
    }

    return { reset: true };
  }
};