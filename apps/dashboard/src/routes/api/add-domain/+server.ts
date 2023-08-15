import { PROJECT_ID_VERCEL, TEAM_ID_VERCEL, AUTH_BEARER_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { url } = await request.json();

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
