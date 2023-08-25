drop policy "Users can only delete their own dynamic links" on "public"."dynamic_links";

drop policy "Users can only read dynamic links they own" on "public"."dynamic_links";

drop policy "Users can only update dynamic links they own" on "public"."dynamic_links";

drop policy "Users can only delete matching profile URLs" on "public"."urls";

drop policy "Users can only read URLs they own" on "public"."urls";

alter table "public"."urls" drop constraint "urls_id_fkey";

alter table "public"."users_organizations" drop constraint "users_organizations_organization_id_fkey";

alter table "public"."urls" drop column "id";

alter table "public"."urls" add column "organization_id" bigint not null;

alter table "public"."urls" add constraint "urls_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."urls" validate constraint "urls_organization_id_fkey";

alter table "public"."users_organizations" add constraint "users_organizations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."users_organizations" validate constraint "users_organizations_organization_id_fkey";

create policy "Users can delete dynamic links in their organizations"
on "public"."dynamic_links"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can read dynamic links in their organizations"
on "public"."dynamic_links"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can update dynamic links in their organizations"
on "public"."dynamic_links"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can delete their organizations"
on "public"."organizations"
as permissive
for delete
to public
using ((id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid()))));


create policy "Users can delete URLs in their organizations"
on "public"."urls"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.profile_id = auth.uid()) AND (uo.organization_id = urls.organization_id)))));


create policy "Users can read URLs in their organizations"
on "public"."urls"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.profile_id = auth.uid()) AND (uo.organization_id = urls.organization_id)))));



