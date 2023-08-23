import { redirect, error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { session, supabase } = await parent();

	if (!session) {
		throw redirect(303, '/login');
	}

	const { data: org, error: err } = await supabase
		.from('organizations')
		.select('*')
		.eq('id', params.id)
		.single();

	if (err) {
		throw error(500, '/');
	}

	return { supabase, session, org };
};
