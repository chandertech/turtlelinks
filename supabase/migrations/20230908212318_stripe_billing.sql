create type "public"."billing_providers" as enum ('stripe');

create type "public"."pricing_plan_interval" as enum ('day', 'week', 'month', 'year');

create type "public"."pricing_type" as enum ('one_time', 'recurring');

create type "public"."subscription_status" as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');

alter table "public"."dynamic_links" drop constraint "dynamic_links_url_fkey";

create table "public"."billing_customers" (
    "profile_id" uuid not null,
    "customer_id" text,
    "email" text,
    "active" boolean,
    "provider" billing_providers
);


alter table "public"."billing_customers" enable row level security;

create table "public"."billing_prices" (
    "id" text not null,
    "billing_product_id" text,
    "active" boolean,
    "description" text,
    "unit_amount" bigint,
    "currency" text,
    "type" pricing_type,
    "interval" pricing_plan_interval,
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" jsonb,
    "provider" billing_providers
);


alter table "public"."billing_prices" enable row level security;

create table "public"."billing_products" (
    "id" text not null,
    "active" boolean,
    "name" text,
    "description" text,
    "image" text,
    "metadata" jsonb,
    "provider" billing_providers
);


alter table "public"."billing_products" enable row level security;

create table "public"."billing_subscriptions" (
    "id" text not null,
    "profile_id" uuid not null,
    "status" subscription_status,
    "metadata" jsonb,
    "price_id" text,
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_start" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_end" timestamp with time zone not null default timezone('utc'::text, now()),
    "ended_at" timestamp with time zone default timezone('utc'::text, now()),
    "cancel_at" timestamp with time zone default timezone('utc'::text, now()),
    "canceled_at" timestamp with time zone default timezone('utc'::text, now()),
    "trial_start" timestamp with time zone default timezone('utc'::text, now()),
    "trial_end" timestamp with time zone default timezone('utc'::text, now()),
    "provider" billing_providers
);


alter table "public"."billing_subscriptions" enable row level security;

CREATE UNIQUE INDEX billing_customers_pkey ON public.billing_customers USING btree (profile_id);

CREATE UNIQUE INDEX billing_prices_pkey ON public.billing_prices USING btree (id);

CREATE UNIQUE INDEX billing_products_pkey ON public.billing_products USING btree (id);

CREATE UNIQUE INDEX billing_subscriptions_pkey ON public.billing_subscriptions USING btree (id);

alter table "public"."billing_customers" add constraint "billing_customers_pkey" PRIMARY KEY using index "billing_customers_pkey";

alter table "public"."billing_prices" add constraint "billing_prices_pkey" PRIMARY KEY using index "billing_prices_pkey";

alter table "public"."billing_products" add constraint "billing_products_pkey" PRIMARY KEY using index "billing_products_pkey";

alter table "public"."billing_subscriptions" add constraint "billing_subscriptions_pkey" PRIMARY KEY using index "billing_subscriptions_pkey";

alter table "public"."billing_customers" add constraint "billing_customers_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."billing_customers" validate constraint "billing_customers_profile_id_fkey";

alter table "public"."billing_prices" add constraint "billing_prices_billing_product_id_fkey" FOREIGN KEY (billing_product_id) REFERENCES billing_products(id) not valid;

alter table "public"."billing_prices" validate constraint "billing_prices_billing_product_id_fkey";

alter table "public"."billing_prices" add constraint "billing_prices_currency_check" CHECK ((char_length(currency) = 3)) not valid;

alter table "public"."billing_prices" validate constraint "billing_prices_currency_check";

alter table "public"."billing_subscriptions" add constraint "billing_subscriptions_price_id_fkey" FOREIGN KEY (price_id) REFERENCES billing_prices(id) not valid;

alter table "public"."billing_subscriptions" validate constraint "billing_subscriptions_price_id_fkey";

alter table "public"."billing_subscriptions" add constraint "billing_subscriptions_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."billing_subscriptions" validate constraint "billing_subscriptions_profile_id_fkey";

alter table "public"."dynamic_links" add constraint "dynamic_links_suffix_check" CHECK ((suffix ~* '^[-\w]+$'::text)) not valid;

alter table "public"."dynamic_links" validate constraint "dynamic_links_suffix_check";

alter table "public"."organization_invites" add constraint "organization_invites_invitee_email_check" CHECK ((invitee_email ~* '^(.+)@(.+){2,}[.](.+){2,}$'::text)) not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_invitee_email_check";

alter table "public"."urls" add constraint "urls_url_check" CHECK ((url ~* '^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.turt\.link$'::text)) not valid;

alter table "public"."urls" validate constraint "urls_url_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_orgs_for_authenticated_user()
 RETURNS SETOF bigint
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select organization_id
  from users_organizations
  where profile_id = auth.uid()
$function$
;

create policy "User can view their own billing data."
on "public"."billing_customers"
as permissive
for select
to authenticated
using ((profile_id = auth.uid()));


create policy "Allow public read-only access."
on "public"."billing_prices"
as permissive
for select
to public
using (true);


create policy "Allow public read-only access."
on "public"."billing_products"
as permissive
for select
to public
using (true);


create policy "User can view their own  subscriptions."
on "public"."billing_subscriptions"
as permissive
for select
to authenticated
using ((profile_id = auth.uid()));



