# Turtle Links
## Getting Started
### Prerequisites
* Install [Node.js](https://nodejs.org/en/) and a Node version manager like [fnm](https://github.com/Schniz/fnm)
* Install [Turborepo](https://turbo.build/repo/docs/installing)
* Install [Docker](https://www.docker.com/products/docker-desktop/)
* Install the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

#### Payments
* Install [Stripe CLI](https://stripe.com/docs/stripe-cli)

### Setup
* Clone the repo
* Copy `.env.example` to `.env`
* Run `npm i` in the root directory to install dependencies
* Run `supabase start` to start and run Supabase locally
* Run `npm run dev` and open the [dashboard](http://localhost:5173/)

#### Payments
* Login into the [Stripe CLI](https://stripe.com/docs/webhooks/quickstart?lang=node)
* Run `stripe listen --forward-to localhost:5173/api/stripe-webhook`

You can also visit the [Supabase dashboard](http://localhost:54323/project/default) and the [local mail server](http://localhost:54324/monitor).

## Projects
* apps/dashboard - Primary Web App
* apps/link_provider - Link Redirection App
* apps/docs - Documentation Site