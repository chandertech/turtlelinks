import { createOrRetrieveCustomer } from '$lib/stripe/stripe-billing-helpers';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) throw error(400);

	// TODO: Potentially move somewhere else? Maybe inside the webhook? Also email is potentially null...
	await createOrRetrieveCustomer({ profileId: session.user.id, email: session.user.email || '' });

	return { session: session };
};
