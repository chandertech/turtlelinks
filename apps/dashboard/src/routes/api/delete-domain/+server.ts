import { PROJECT_ID_VERCEL, TEAM_ID_VERCEL, AUTH_BEARER_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	const { domain } = await request.json();

	// Comment from demo V
	// not required –> only for this demo to prevent removal of a few restricted domains
	if (restrictedDomains.includes(domain)) {
		throw error(403);
	}

	const response = await fetch(
		`https://api.vercel.com/v9/projects/${PROJECT_ID_VERCEL}/domains/${domain}?teamId=${TEAM_ID_VERCEL}`,
		{
			headers: {
				Authorization: `Bearer ${AUTH_BEARER_TOKEN}`
			},
			method: 'DELETE'
		}
	);

	return json(await response.json());
};

// TODO: Might need to stick in our domains in here?
const restrictedDomains = ['portfolio.steventey.com', 'cat.vercel.pub'];
