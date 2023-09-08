import type Stripe from 'stripe';
import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { stripeAdminClient } from './stripe-admin-client';
import fromUnixTime from 'date-fns/fromUnixTime';
import type { BillingSubscriptionStatus } from '$lib/supabase/supabase-types';

enum BILLING_PROVIDERS {
	stripe = 'stripe'
}

/**
 * Products are defined in stripe, this handler takes a stripe product and
 * makes sure we have a local copy for pricing pages
 * @param product Stripe product object
 */
export const upsertProductRecord = async (product: Stripe.Product) => {
	const productData = {
		id: product.id,
		active: product.active,
		name: product.name,
		description: product.description ?? undefined,
		image: product.images?.[0] ?? null,
		metadata: product.metadata,
		provider: BILLING_PROVIDERS.stripe
	};

	const { error } = await supabaseAdminClient.from('billing_products').upsert([productData]);
	if (error) throw error;
	console.log(`Product inserted/updated: ${product.id}`);
};

/**
 * Prices are defined in stripe and connected to a product
 * Products typically have 1-2 prices assigned to them, but can have unlimited
 * @param price
 */
export const upsertPriceRecord = async (price: Stripe.Price) => {
	const priceData = {
		id: price.id,
		billing_product_id: typeof price.product === 'string' ? price.product : '',
		active: price.active,
		currency: price.currency,
		description: price.nickname ?? undefined,
		type: price.type,
		unit_amount: price.unit_amount ?? undefined,
		interval: price.recurring?.interval,
		interval_count: price.recurring?.interval_count,
		trial_period_days: price.recurring?.trial_period_days,
		metadata: price.metadata,
		provider: BILLING_PROVIDERS.stripe
	};

	const { error } = await supabaseAdminClient.from('billing_prices').upsert([priceData]);
	if (error) throw error;
	console.log(`Price inserted/updated: ${price.id}`);
};

/**
 * Convenience function that checks if a stripe customer with a given email address already exists
 * in our database. If it doesn't, it creates a new one
 * @param profileId
 */
export const createOrRetrieveCustomer = async ({
	profileId,
	email
}: {
	profileId: string;
	email: string;
}) => {
	const { data, error } = await supabaseAdminClient
		.from('billing_customers')
		.select('customer_id')
		.eq('profile_id', profileId)
		.single();
	if (error) {
		// No customer record found, let's create one.
		const customerData: { metadata: { profile_id: string }; email?: string } = {
			metadata: {
				profile_id: profileId
			}
		};

		if (email) {
			customerData.email = email;
		}
		const customer = await stripeAdminClient.customers.create(customerData);
		// now we upsert the customer record. Upsert b/c the stripe webhook also hits this and so there could be
		// a race condition
		await upsertCustomerRecord(customer, profileId);
		console.log(`New customer created and inserted for ${profileId}.`);
		return customer.id;
	}
	if (data) return data.customer_id;
};

/**
 * This is the customer object inside of stripe. It should map 1:1 with accounts in most cases
 * It does NOT map back to users
 * @param customer
 * @param profileId
 */
export const upsertCustomerRecord = async (customer: Stripe.Customer, profileId?: string) => {
	const customerData = {
		profile_id: profileId || customer.metadata.profile_id,
		customer_id: customer.id,
		email: customer.email,
		provider: BILLING_PROVIDERS.stripe
	};

	const { error } = await supabaseAdminClient.from('billing_customers').upsert([customerData]);
	if (error) throw error;
};

/**
 * Subscriptions are the primary tracking for an accounts status within the app.
 * This takes a stripe subscription event and upserts it into our database so that
 * we have a local version of an accounts current status
 * @param subscriptionId
 * @param customerId
 * @param accountCreated Is this an account created event?
 */
export const manageSubscriptionStatusChange = async (
	subscriptionId: string,
	customerId: string
) => {
	// Get customer's UUID from mapping table.
	const { data: customerData, error: noCustomerError } = await supabaseAdminClient
		.from('billing_customers')
		.select('profile_id')
		.eq('customer_id', customerId)
		.single();
	if (noCustomerError) throw noCustomerError;

	const subscription = await stripeAdminClient.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method']
	});
	// Upsert the latest status of the subscription object.
	await upsertSubscriptionRecord(subscription, customerData.profile_id);
};

/**
 * Takes a stripe subscription object and upserts it into our database
 * @param subscription Stripe.Subscription
 * @param profileId string
 */
const upsertSubscriptionRecord = async (subscription: Stripe.Subscription, profileId: string) => {
	const subscriptionData = {
		id: subscription.id,
		profile_id: profileId,
		metadata: subscription.metadata,
		status: subscription.status as BillingSubscriptionStatus,
		price_id: subscription.items.data[0].price.id,
		quantity: subscription.items.data[0].quantity,
		cancel_at_period_end: subscription.cancel_at_period_end,
		cancel_at: subscription.cancel_at ? fromUnixTime(subscription.cancel_at).toISOString() : null,
		canceled_at: subscription.canceled_at
			? fromUnixTime(subscription.canceled_at).toISOString()
			: null,
		current_period_start: fromUnixTime(subscription.current_period_start).toISOString(),
		current_period_end: fromUnixTime(subscription.current_period_end).toISOString(),
		created: fromUnixTime(subscription.created).toISOString(),
		ended_at: subscription.ended_at ? fromUnixTime(subscription.ended_at).toISOString() : null,
		trial_start: subscription.trial_start
			? fromUnixTime(subscription.trial_start).toISOString()
			: null,
		trial_end: subscription.trial_end ? fromUnixTime(subscription.trial_end).toISOString() : null,
		provider: BILLING_PROVIDERS.stripe
	};

	const { error } = await supabaseAdminClient
		.from('billing_subscriptions')
		.upsert(subscriptionData);
	if (error) throw error;
	console.log(`Inserted/updated subscription [${subscription.id}] for account [${profileId}]`);
};
