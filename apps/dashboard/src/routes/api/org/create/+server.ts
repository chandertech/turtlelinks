import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// We use the admin client here since all of our RLS policies depend on being inside an org.
// Since nobody is apart of this freshly created org, we need to manually add them.
export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const { name } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	const { data: newOrg, error: orgError } = await supabaseAdminClient
		.from('organizations')
		.insert({ name: name })
		.select()
		.single();

	if (orgError) {
		throw error(500);
	}

	const { error: inviteError } = await supabaseAdminClient
		.from('users_organizations')
		.insert({ profile_id: session.user.id, organization_id: newOrg.id });

	if (inviteError) {
		throw error(500);
	}

	return json({ success: true });
};
