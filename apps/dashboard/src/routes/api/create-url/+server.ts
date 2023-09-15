import {
	DASHBOARD_PROJECT_ID_VERCEL,
	TEAM_ID_VERCEL,
	AUTH_BEARER_TOKEN
} from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import type { URLInfo } from '$lib/supabase/supabase-types';
import { env } from '$env/dynamic/private';
import { _DeleteDomain } from '../delete-url/+server';

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { subdomain, domain, orgId } = await request.json();
	const url = subdomain + domain;
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	// Remove once we have custom domain support.
	if (typeof url !== 'string' || !/^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.turt\.link$/.test(url)) {
		throw error(400, { message: 'Prefix URL provided is invalid.' });
	}

	const newURL: URLInfo = {
		url: url,
		organization_id: orgId,
		subdomain: subdomain,
		domain: domain
	};

	const { error: urlError } = await supabase.from('urls').insert(newURL);
	if (urlError) {
		throw error(400, { message: 'Failed to insert Prefix URL.' });
	}

	const res = env.NODE_ENV === 'development' ? await MockAPI(url) : await VercelAPI(url);
	if (!res.ok) {
		// If we fail to post to the Vercel domain, let's revert the supabase call
		// so both of them remain in sync.
		await supabaseAdminClient.from('urls').delete().eq('url', url);

		throw error(400, { message: 'Failed to post Prefix URL.' });
	}

	return json({ success: true });
};

const VercelAPI = async (url: string) => {
	const response = await fetch(
		`https://api.vercel.com/v9/projects/${DASHBOARD_PROJECT_ID_VERCEL}/domains?teamId=${TEAM_ID_VERCEL}`,
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

async function MockAPI(url: string) {
	const { error: err } = await supabaseAdminClient.from('fake_dns_provider').insert({ url: url });
	if (err) throw error(500);
	return json({ success: true });
}
