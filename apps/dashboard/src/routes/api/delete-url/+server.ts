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
	const { error: urlError } = await supabase.from('urls').delete().eq('url', url);

	if (urlError) {
		throw error(401);
	}

	return env.NODE_ENV === 'development' ? await MockAPI(url) : await VercelAPI(url);
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
