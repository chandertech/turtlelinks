import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	// Profile information
	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, website, email`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};
