import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { session, supabase } = await parent();

	if (!session) {
		throw redirect(303, '/login');
	}

	const orgId = params.id;
	return { supabase, session, orgId };
};
