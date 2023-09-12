import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import { createOrRetrieveCustomer } from '$lib/stripe/stripe-billing-helpers';

export const POST: RequestHandler = async ({ url, request, locals: { getSession } }) => {
	const { organizationId, subscriptionId } = await request.json();
	const session = await getSession();

	if (!session || !session.user.email) {
		throw error(401);
	}

	const customerId = await createOrRetrieveCustomer({
		profileId: session.user.id,
		email: session.user.email
	});

	if (!customerId) {
		throw error(500);
	}

	const stripeSession = await stripeAdminClient.billingPortal.sessions.create({
		customer: customerId,
		flow_data: {
			type: 'subscription_cancel',
			subscription_cancel: {
				subscription: subscriptionId
			}
		},
		return_url: `${url.origin}/organizations/${organizationId}`
	});

	return json({ url: stripeSession.url });
};
