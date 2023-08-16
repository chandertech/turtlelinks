import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	// Profile information
	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, website`)
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

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const fullName = formData.get('fullName') as string | null;
		const username = formData.get('username') as string | null;
		const website = formData.get('website') as string | null;

		const session = await getSession();

		if (!session) {
			// log and display error message
			return;
		}

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			full_name: fullName ? fullName : null,
			username: username ? username : null,
			website: website ? website : null,
			updated_at: new Date().toISOString()
		});

		if (error) {
			console.error(error);
			return fail(500, {
				fullName,
				username,
				website
			});
		}

		return {
			fullName,
			username,
			website
		};
	},
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/login');
		}
	}
};
