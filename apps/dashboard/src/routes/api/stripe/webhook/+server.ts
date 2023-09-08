import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import { upsertCustomerRecord } from '$lib/stripe/stripe-billing-helpers';
import type Stripe from 'stripe';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

const relevantEvents = new Set([
	'product.created',
	'product.updated',
	'price.created',
	'price.updated',
	'checkout.session.completed',
	'customer.subscription.created',
	'customer.subscription.updated',
	'customer.subscription.deleted',
	'customer.created',
	'customer.updated',
	'customer.deleted'
]);

export const POST: RequestHandler = async ({ request }) => {
	let stripeEvent;

	if (STRIPE_WEBHOOK_SECRET) {
		const _rawBody = await request.arrayBuffer();
		const payload = toBuffer(_rawBody);

		const signature = request.headers.get('stripe-signature');
		if (!signature) throw error(400);

		try {
			stripeEvent = stripeAdminClient.webhooks.constructEvent(
				payload,
				signature,
				STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			throw error(500);
		}
	}

	if (!stripeEvent) throw error(500);

	if (relevantEvents.has(stripeEvent.type)) {
		try {
			switch (stripeEvent.type) {
				case 'customer.created':
				case 'customer.updated':
				case 'customer.deleted':
					await upsertCustomerRecord(stripeEvent.data.object as Stripe.Customer);
					break;
			}
		} catch (err) {
			throw error(500);
		}
	}

	return json({ success: true });
};
