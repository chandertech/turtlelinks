import type { LayoutServerLoad } from './$types';
import { building } from '$app/environment';
import { stripeAdminClient } from '$lib/stripe/stripe-admin-client';
import { upsertPriceRecord, upsertProductRecord } from '$lib/stripe/stripe-billing-helpers';

// TODO: Might need to move this somewhere else before merge...
if (!building) {
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

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	return { session: await getSession() };
};
