import type { LayoutServerLoad } from './$types';
import { building } from '$app/environment';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import { upsertPriceRecord, upsertProductRecord } from '$lib/stripe/stripe-billing-helpers';

if (!building) {
	stripeAdminClient.products
		.list()
		.then(async (products) => {
			for (const product of products.data) {
				await upsertProductRecord(product);
			}
		})
		.catch((e) => {
			console.log(e);
		});

	stripeAdminClient.prices
		.list()
		.then(async (prices) => {
			for (const price of prices.data) {
				await upsertPriceRecord(price);
			}
		})
		.catch((e) => {
			console.log(e);
		});
}

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	return { session: await getSession() };
};
