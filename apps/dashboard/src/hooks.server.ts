// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import { upsertPriceRecord, upsertProductRecord } from '$lib/stripe/stripe-billing-helpers';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	await syncStripe();

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

async function syncStripe() {
	stripeAdminClient.products
		.list()
		.then(async (products) => {
			const promises = products.data.map(async (product) => {
				await upsertProductRecord(product);
			});
			await Promise.all(promises);
		})
		.catch((e) => {
			console.log(e);
		});

	stripeAdminClient.prices
		.list()
		.then(async (prices) => {
			const promises = prices.data.map(async (price) => {
				await upsertPriceRecord(price);
			});
			await Promise.all(promises);
		})
		.catch((e) => {
			console.log(e);
		});
}
