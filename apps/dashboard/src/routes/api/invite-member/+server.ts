import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { InviteStatusToDb } from '$lib/types/app';

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { id, email } = await request.json();
	const session = await getSession();

	if (!session) {
		throw error(401);
	}

	if (!email) {
		throw error(400);
	} else if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
		throw error(400);
	}

	// Get organization_id from URL and validate
	let organization_id: null | number = null;
	try {
		organization_id = parseInt(id);
	} catch (err) {
		throw error(400);
	}

	if (isNaN(organization_id)) {
		throw error(400);
	}

	// Create invite and insert into database
	const inviteCode = crypto.randomUUID();
	const { error: orgInviteError } = await supabase.from('organization_invites').upsert({
		inviter_id: session.user.id,
		invitee_email: email,
		organization_id: organization_id,
		invite_code: inviteCode,
		status: InviteStatusToDb('pending')
	});

	if (orgInviteError) {
		throw error(400);
	}

	// Check if user exists
	const { count: userLookupResonseData, error: userLookupError } = await supabaseAdminClient
		.from('profiles')
		.select('id', { count: 'exact', head: true })
		.eq('email', email);

	if (userLookupError || userLookupResonseData === null) {
		throw error(400);
	}

	const userExists = userLookupResonseData > 0;

	// Send invite email
	const params = new URLSearchParams({
		inviteCode: inviteCode
	});
	const url = new URL('/accept-invite', request.url);
	url.search = params.toString();

	if (userExists) {
		const { error: inviteError } = await supabaseAdminClient.auth.signInWithOtp({
			email: email,
			options: {
				emailRedirectTo: url.toString()
			}
		});

		if (inviteError) throw error(400);
	} else {
		const { error: inviteError } = await supabaseAdminClient.auth.admin.inviteUserByEmail(email, {
			redirectTo: url.toString()
		});

		if (inviteError) throw error(400);
	}

	return json({ success: true });
};
