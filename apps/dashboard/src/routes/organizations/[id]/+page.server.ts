import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { InviteStatusToDb } from '$lib/types/app';

// Using inviteUserByEmail requires the admin client so we must do this action on the server
export const actions: Actions = {
	default: async (event) => {
		const supabaseClient = event.locals.supabase;
		const session = await event.locals.getSession();
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		// todo add per user rate limiting to avoid adminClient abuse

		// Get email from FormData and validate
		const data = await event.request.formData();
		const email = (data.get('email') ?? '').toString();

		if (!email) {
			return fail(400, { email, missing: true });
		} else if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
			return fail(400, { email, invalid: true });
		}

		// Get organization_id from URL and validate
		let organization_id: null | number = null;
		try {
			organization_id = parseInt(event.params.id);
		} catch (error) {
			return fail(400, { organization_id, error });
		}

		if (isNaN(organization_id)) {
			return fail(400, { organization_id, error: 'Error getting organization id' });
		}

		// Create invite and insert into database
		const inviteCode = crypto.randomUUID();
		const { error: orgInviteError } = await supabaseClient.from('organization_invites').upsert({
			inviter_id: session.user.id,
			invitee_email: email,
			organization_id: organization_id,
			invite_code: inviteCode,
			status: InviteStatusToDb('pending')
		});

		if (orgInviteError) {
			return fail(400, { email, error: orgInviteError });
		}

		// Check if user exists
		const { count: userLookupResonseData, error: userLookupError } = await supabaseAdminClient
			.from('profiles')
			.select('id', { count: 'exact', head: true })
			.eq('email', email);

		if (userLookupError || userLookupResonseData === null) {
			return fail(400, { email, error: userLookupError });
		}

		const userExists = userLookupResonseData > 0;

		// Send invite email
		const params = new URLSearchParams({
			inviteCode: inviteCode
		});
		const url = new URL('/accept-invite', event.url.origin);
		url.search = params.toString();

		if (userExists) {
			const { error: inviteError } = await supabaseAdminClient.auth.signInWithOtp({
				email: email,
				options: {
					emailRedirectTo: url.toString()
				}
			});

			if (inviteError) {
				const error = inviteError.toString();
				return fail(400, { email, error });
			}
		} else {
			const { error: inviteError } = await supabaseAdminClient.auth.admin.inviteUserByEmail(email, {
				redirectTo: url.toString()
			});

			if (inviteError) {
				const error = inviteError.toString();
				return fail(400, { email, error });
			}
		}

		return {
			success: true
		};
	}
};
