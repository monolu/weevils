import { error } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
  const { id } = params;

  // 1. fetch profile info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  // 2. fetch their entire weevil stash
  const { data: collection } = await supabase
    .from('user_weevils')
    .select('*, weevils(*)')
    .eq('user_id', id)
    .order('acquired_at', { ascending: false });

  if (!profile) {
    throw error(404, 'User not found (or they are a ghost)');
  }

  return {
    profile,
    collection: collection ?? []
  };
};