import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// Only use this on server to prevent client abuse.
export const stripeAdminClient = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2023-08-16'
});
