import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url, locals: { supabase, getSession } }) => {
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

	try {
		await Promise.all(
			urls.map((u) =>
				fetch(`${url.origin}/api/delete-domain`, {
					method: 'DELETE',
					body: JSON.stringify({ url: u.url }),
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${session.access_token}`
					}
				})
			)
		);
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
