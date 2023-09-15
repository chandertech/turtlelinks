import {
	DASHBOARD_PROJECT_ID_VERCEL,
	TEAM_ID_VERCEL,
	AUTH_BEARER_TOKEN
} from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export const DELETE: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { url } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	return await _DeleteDomain(supabase, url);
};

export async function _DeleteDomain(supabase: SupabaseClient, url: string) {
	const { data: deletedURL, error: urlError } = await supabase
		.from('urls')
		.delete()
		.eq('url', url)
		.select('*')
		.single();

	if (urlError) {
		throw error(401);
	}

	const res = env.NODE_ENV === 'development' ? await MockAPI(url) : await VercelAPI(url);
	if (!res.ok) {
		// If we fail to post to the Vercel domain, let's revert the supabase call
		// so both of them remain in sync.
		await supabaseAdminClient.from('urls').insert(deletedURL);

		throw error(500);
	}

	return json({ success: true });
}

const VercelAPI = async (url: string) => {
	const response = await fetch(
		`https://api.vercel.com/v9/projects/${DASHBOARD_PROJECT_ID_VERCEL}/domains/${url}?teamId=${TEAM_ID_VERCEL}`,
		{
			headers: {
				Authorization: `Bearer ${AUTH_BEARER_TOKEN}`
			},
			method: 'DELETE'
		}
	);

	return json(await response.json());
};

async function MockAPI(url: string) {
	const { error: err } = await supabaseAdminClient
		.from('fake_dns_provider')
		.delete()
		.eq('url', url);
	if (err) throw error(500);
	return json({ success: true });
}
