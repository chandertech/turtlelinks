import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';

export const POST: RequestHandler = async ({ url }) => {
	const session = await stripeAdminClient.checkout.sessions.create({
		mode: 'subscription',
		success_url: `${url.origin}/payment`,
		cancel_url: `${url.origin}/fail`,
		line_items: [
			{
				quantity: 1,
				price: 'price_1NlFXaDYh43AXwRboHsILqAp'
			}
		]
	});

	return json({ url: session.url });
};
