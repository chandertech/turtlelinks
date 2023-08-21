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

	// User's organizations
	const { data: userOrgs, error: userOrgsError } = session
		? await supabase
				.from('users_organizations')
				.select('profile_id, organization_id')
				.eq('profile_id', session.user.id)
		: { data: null, error: null };

	// Organizations
	const { data: organizations, error: orgsError } = session
		? await supabase
				.from('organizations')
				.select('id, name')
				.in(
					'id',
					(userOrgs ?? []).map((org) => org.organization_id)
				)
		: { data: null, error: null };

	return { session, profile, organizations, orgsError, userOrgsError };
};
