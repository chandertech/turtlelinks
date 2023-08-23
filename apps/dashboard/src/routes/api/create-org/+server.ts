import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
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
		throw error(400);
	}

	const { error: inviteError } = await supabaseAdminClient
		.from('users_organizations')
		.insert({ profile_id: session.user.id, organization_id: newOrg.id });

	if (inviteError) {
		throw error(400);
	}

	return json({ success: true });
};
