import {
	DASHBOARD_PROJECT_ID_VERCEL,
	TEAM_ID_VERCEL,
	AUTH_BEARER_TOKEN
} from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const DELETE: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { url } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	// Remove once we have custom domain support.
	if (typeof url !== 'string' || !url.endsWith('.turt.link')) {
		throw error(400);
	}

	const { data: urlData, error: urlError } = await supabase
		.from('urls')
		.select('url')
		.eq('url', url)
		.single();

	if (urlError || !urlData) {
		throw error(401);
	}

	return process.env.NODE_ENV === 'development'
		? await MockAPI(supabase, url)
		: await VercelAPI(url);
};

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

async function MockAPI(supabase: SupabaseClient, url: string) {
	const { error: err } = await supabase.from('fake_dns_provider').delete().eq('url', url);
	if (err) throw error(500);
	return json({ success: true });
}
