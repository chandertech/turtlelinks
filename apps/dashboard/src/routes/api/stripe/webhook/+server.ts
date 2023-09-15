import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import {
	manageSubscriptionStatusChange,
	upsertCustomerRecord,
	upsertPriceRecord,
	upsertProductRecord
} from '$lib/stripe/stripe-billing-helpers';
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
				case 'customer.deleted': {
					await upsertCustomerRecord(stripeEvent.data.object as Stripe.Customer);
					break;
				}
				case 'product.created':
				case 'product.updated': {
					await upsertProductRecord(stripeEvent.data.object as Stripe.Product);
					break;
				}
				case 'price.created':
				case 'price.updated': {
					await upsertPriceRecord(stripeEvent.data.object as Stripe.Price);
					break;
				}
				case 'customer.subscription.created':
				case 'customer.subscription.updated':
				case 'customer.subscription.deleted': {
					const subscription = stripeEvent.data.object as Stripe.Subscription;
					await manageSubscriptionStatusChange(subscription.id, subscription.customer as string);
					break;
				}
				case 'checkout.session.completed': {
					const checkoutSession = stripeEvent.data.object as Stripe.Checkout.Session;
					if (checkoutSession.mode === 'subscription') {
						const subscriptionId = checkoutSession.subscription;
						await manageSubscriptionStatusChange(
							subscriptionId as string,
							checkoutSession.customer as string
						);
					}
					break;
				}
			}
		} catch (err) {
			throw error(500);
		}
	}

	return json({ success: true });
};
