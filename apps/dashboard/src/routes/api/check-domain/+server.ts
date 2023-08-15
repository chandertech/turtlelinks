import { PROJECT_ID_VERCEL, TEAM_ID_VERCEL, AUTH_BEARER_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, request }) => {
	const domain = url.searchParams.get('domain');

	const [configResponse, domainResponse] = await Promise.all([
		fetch(`https://api.vercel.com/v6/domains/${domain}/config?teamId=${TEAM_ID_VERCEL}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${AUTH_BEARER_TOKEN}`,
				'Content-Type': 'application/json'
			}
		}),
		fetch(
			`https://api.vercel.com/v9/projects/${PROJECT_ID_VERCEL}/domains/${domain}?teamId=${TEAM_ID_VERCEL}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${AUTH_BEARER_TOKEN}`,
					'Content-Type': 'application/json'
				}
			}
		)
	]);

	const configJson = await configResponse.json();
	const domainJson = await domainResponse.json();
	if (domainResponse.status !== 200) {
		throw error(domainResponse.status);
	}

	/**
	 * If domain is not verified, we try to verify now
	 */
	let verificationResponse = null;
	if (!domainJson.verified) {
		const verificationRes = await fetch(
			`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
					'Content-Type': 'application/json'
				}
			}
		);
		verificationResponse = await verificationRes.json();
	}

	if (verificationResponse && verificationResponse.verified) {
		/**
		 * Domain was just verified
		 */
		return json({
			configured: !configJson.misconfigured,
			...verificationResponse
		});
	}

	return json({
		configured: !configJson.misconfigured,
		...domainJson,
		...(verificationResponse ? { verificationResponse } : {})
	});
};
