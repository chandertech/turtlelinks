import { PROJECT_ID_VERCEL, TEAM_ID_VERCEL, AUTH_BEARER_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { url } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	// Remove once we have custom domain support.
	if (typeof url !== 'string' || !url.endsWith('.turt.link')) {
		throw error(400);
	}

	return process.env.NODE_ENV === 'development'
		? await MockAPI(supabase, url)
		: await VercelAPI(url);
};

const VercelAPI = async (url: string) => {
	const response = await fetch(
		`https://api.vercel.com/v9/projects/${PROJECT_ID_VERCEL}/domains?teamId=${TEAM_ID_VERCEL}`,
		{
			body: `{\n  "name": "${url}"\n}`,
			headers: {
				Authorization: `Bearer ${AUTH_BEARER_TOKEN}`,
				'Content-Type': 'application/json'
			},
			method: 'POST'
		}
	);

	const data = await response.json();

	if (data.error?.code == 'forbidden') {
		throw error(403);
	} else if (data.error?.code == 'domain_already_in_use') {
		throw error(409);
	}

	return json({ success: true });
};

async function MockAPI(supabase: SupabaseClient, url: string) {
	const { error: err } = await supabase.from('fake_dns_provider').insert({ url: url });
	if (err) throw error(500);
	return json({ success: true });
}
