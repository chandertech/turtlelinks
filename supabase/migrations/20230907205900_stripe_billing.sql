create type "public"."billing_providers" as enum ('stripe');

alter table "public"."dynamic_links" drop constraint "dynamic_links_url_fkey";

create table "public"."billing_customers" (
    "id" uuid not null,
    "customer_id" text,
    "email" text,
    "active" boolean,
    "provider" billing_providers
);


alter table "public"."billing_customers" enable row level security;

CREATE UNIQUE INDEX billing_customers_pkey ON public.billing_customers USING btree (id);

alter table "public"."billing_customers" add constraint "billing_customers_pkey" PRIMARY KEY using index "billing_customers_pkey";

alter table "public"."billing_customers" add constraint "billing_customers_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."billing_customers" validate constraint "billing_customers_id_fkey";

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


