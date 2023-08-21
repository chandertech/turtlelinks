drop policy "Users can only delete URLs they own" on "public"."urls";

create table "public"."fake_dns_provider" (
    "url" text not null default ''::text
);


alter table "public"."fake_dns_provider" enable row level security;

alter table "public"."dynamic_links" drop column "is_archived";

CREATE UNIQUE INDEX fake_dns_provider_pkey ON public.fake_dns_provider USING btree (url);

alter table "public"."fake_dns_provider" add constraint "fake_dns_provider_pkey" PRIMARY KEY using index "fake_dns_provider_pkey";

create policy "Users can only delete their own dynamic links"
on "public"."dynamic_links"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN profiles p ON ((u.id = p.id)))
  WHERE ((u.url = dynamic_links.url) AND (p.id = auth.uid())))));


create policy "Enable delete for authenticated users only"
on "public"."fake_dns_provider"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."fake_dns_provider"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated"
on "public"."fake_dns_provider"
as permissive
for select
to authenticated
using (true);


create policy "Users can only delete matching profile URLs"
on "public"."urls"
as permissive
for delete
to public
using ((id = ( SELECT profiles.id
   FROM profiles
  WHERE (auth.uid() = profiles.id))));



