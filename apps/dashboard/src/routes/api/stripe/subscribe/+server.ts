import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import { createOrRetrieveCustomer } from '$lib/stripe/stripe-billing-helpers';

export const POST: RequestHandler = async ({ url, request, locals: { getSession } }) => {
	const { priceId } = await request.json();
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

	const stripeSession = await stripeAdminClient.checkout.sessions.create({
		payment_method_types: ['card'],
		customer: customerId,
		line_items: [{ price: priceId, quantity: 1 }],
		mode: 'subscription',
		success_url: `${url.origin}/payment`,
		cancel_url: `${url.origin}/fail`,
		subscription_data: {
			metadata: {
				organizationId: 1
			}
		}
	});

	return json({ url: stripeSession.url });
};
