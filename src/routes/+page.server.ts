import { fail } from '@sveltejs/kit';

// helper to find the most recent wednesday (00:00 UTC)
const getCurrentWednesday = () => {
  const now = new Date();
  const day = now.getUTCDay(); // 0=sun, 3=wed
  const diff = now.getUTCDate() - day + (day >= 3 ? 3 : -4);
  const wednesday = new Date(now.setDate(diff));
  wednesday.setUTCHours(0, 0, 0, 0);
  return wednesday;
};

export const load = async ({ locals: { safeGetSession, supabase } }) => {
  const { session } = await safeGetSession();
  const currentWed = getCurrentWednesday();

  // 1. get the active landscape
  // for now, we just pick the first one. later we can rotate based on date.
  const { data: landscape } = await supabase
    .from('landscapes')
    .select('*')
    .limit(1)
    .single();

  if (!session) {
    return { status: 'guest', landscape, collection: [] };
  }

  // 2. check if user pulled THIS WEEK
  const { data: recentPull } = await supabase
    .from('user_weevils')
    .select('*, weevils(*)')
    .eq('user_id', session.user.id)
    .gte('acquired_at', currentWed.toISOString()) // must be after wednesday 00:00
    .limit(1)
    .maybeSingle();

  // 3. fetch full collection for the bin view
  const { data: collection } = await supabase
    .from('user_weevils')
    .select('acquired_at, weevils(*)')
    .eq('user_id', session.user.id)
    .order('acquired_at', { ascending: false });

  return {
    status: recentPull ? 'pulled' : 'pending',
    landscape,
    myWeevil: recentPull?.weevils, // the one on the screen
    collection: collection ?? [],
    user: session.user
  };
};

export const actions = {
  pull: async ({ request, locals: { safeGetSession, supabase } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: 'login required' });

    // 1. double check they haven't pulled this week (security)
    const currentWed = getCurrentWednesday();
    const { data: existing } = await supabase
      .from('user_weevils')
      .select('id')
      .eq('user_id', session.user.id)
      .gte('acquired_at', currentWed.toISOString())
      .maybeSingle();

    if (existing) return fail(400, { message: 'greedy! wait until next wednesday' });

    // 2. pick a random weevil
    // (in the real app, you might filter this by landscape theme)
    const { data: allWeevils } = await supabase.from('weevils').select('id');
    if (!allWeevils?.length) return fail(500, { message: 'no bugs found' });
    
    const winner = allWeevils[Math.floor(Math.random() * allWeevils.length)];

    // 3. save it
    const { error } = await supabase
      .from('user_weevils')
      .insert({ weevil_id: winner.id, user_id: session.user.id });

    if (error) return fail(500, { message: 'db error' });

    return { success: true, weevilId: winner.id };
  },
  
  reset: async ({ locals: { safeGetSession, supabase } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: 'who are you?' });

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