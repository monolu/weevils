import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  
  if (!session) {
    console.log('No session, going to login');
    throw redirect(303, '/login');
  }

  console.log('Session found, going to user page:', session.user.id);
  
  throw redirect(303, `/users/${session.user.id}`);
};