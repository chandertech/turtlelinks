import { PROJECT_ID_VERCEL, TEAM_ID_VERCEL, AUTH_BEARER_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { url } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	const { data: urlData, error: urlError } = await supabase
		.from('urls')
		.select('url')
		.eq('url', url)
		.single();

	if (urlError || !urlData) {
		throw error(401);
	}

	const response = await fetch(
		`https://api.vercel.com/v9/projects/${PROJECT_ID_VERCEL}/domains/${url}?teamId=${TEAM_ID_VERCEL}`,
		{
			headers: {
				Authorization: `Bearer ${AUTH_BEARER_TOKEN}`
			},
			method: 'DELETE'
		}
	);

	return json(await response.json());
};
