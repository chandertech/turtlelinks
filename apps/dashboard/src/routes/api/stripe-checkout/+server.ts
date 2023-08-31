import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripeAdminClient } from '$lib/stripe/stripe';

export const POST: RequestHandler = async ({ request }) => {
	const session = await stripeAdminClient.checkout.sessions.create({
		mode: 'subscription',
		success_url: `https://buy.stripe.com/test_4gw17IaTv73f1l67ss`,
		cancel_url: `/error`,
		line_items: [
			{
				quantity: 1,
				price: 'price_1NlFXaDYh43AXwRboHsILqAp'
			}
		]
	});

	return json({ url: session.url });
};
