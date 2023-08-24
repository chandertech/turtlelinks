import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { _DeleteDomain } from '../delete-domain/+server';

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { orgId } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	// Check if the user has permission to delete the org.
	const { data: orgData, error: orgError } = await supabase
		.from('users_organizations')
		.select('organization_id')
		.eq('profile_id', session.user.id)
		.eq('organization_id', orgId)
		.single();

	if (!orgData || orgError) {
		throw error(403);
	}

	const { data: urls, error: urlError } = await supabaseAdminClient
		.from('urls')
		.select('url')
		.eq('organization_id', orgId);

	if (!urls || urlError) {
		throw error(403);
	}

	// All urls associated with the org need to go.
	try {
		await Promise.all(urls.map((url) => _DeleteDomain(supabaseAdminClient, url.url)));
	} catch (err) {
		throw error(403);
	}

	const { error: deleteError } = await supabaseAdminClient
		.from('organizations')
		.delete()
		.eq('id', orgId);

	if (deleteError) {
		throw error(403);
	}

	return json({ success: true });
};
