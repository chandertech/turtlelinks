create table "public"."dynamic_links" (
    "link" text not null,
    "suffix" text not null,
    "deep_link" text not null,
    "friendly_name" text not null,
    "url" text not null,
    "is_archived" boolean not null default false
);


alter table "public"."dynamic_links" enable row level security;

create table "public"."urls" (
    "url" text not null,
    "id" uuid not null,
    "subdomain" text not null,
    "domain" text not null
);


alter table "public"."urls" enable row level security;

CREATE UNIQUE INDEX dynamic_links_pkey ON public.dynamic_links USING btree (link);

CREATE UNIQUE INDEX urls_pkey ON public.urls USING btree (url);

alter table "public"."dynamic_links" add constraint "dynamic_links_pkey" PRIMARY KEY using index "dynamic_links_pkey";

alter table "public"."urls" add constraint "urls_pkey" PRIMARY KEY using index "urls_pkey";

alter table "public"."dynamic_links" add constraint "dynamic_links_url_fkey" FOREIGN KEY (url) REFERENCES urls(url) ON DELETE CASCADE not valid;

alter table "public"."dynamic_links" validate constraint "dynamic_links_url_fkey";

alter table "public"."urls" add constraint "urls_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."urls" validate constraint "urls_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."dynamic_links"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can only read dynamic links they own"
on "public"."dynamic_links"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN profiles p ON ((u.id = p.id)))
  WHERE ((u.url = dynamic_links.url) AND (p.id = auth.uid())))));


create policy "Users can only update dynamic links they own"
on "public"."dynamic_links"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN profiles p ON ((u.id = p.id)))
  WHERE ((u.url = dynamic_links.url) AND (p.id = auth.uid())))));


create policy "Enable insert for authenticated users only"
on "public"."urls"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can only delete URLs they own"
on "public"."urls"
as permissive
for delete
to authenticated
using ((id = ( SELECT profiles.id
   FROM profiles
  WHERE (auth.uid() = profiles.id))));


create policy "Users can only read URLs they own"
on "public"."urls"
as permissive
for select
to authenticated
using ((id = ( SELECT profiles.id
   FROM profiles
  WHERE (auth.uid() = profiles.id))));



