import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

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

	return json({ success: true });
};
