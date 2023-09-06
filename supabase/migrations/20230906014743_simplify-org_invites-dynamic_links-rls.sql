drop policy "Users can delete dynamic links in their organizations." on "public"."dynamic_links";

drop policy "Users can insert into their organization only." on "public"."dynamic_links";

drop policy "Users can read dynamic links in their organizations." on "public"."dynamic_links";

drop policy "Users can update dynamic links in their organizations." on "public"."dynamic_links";

drop policy "Users can insert invites for organizations they are members of." on "public"."organization_invites";

create policy "Users can do all actions if the dynamic link is in their org."
on "public"."dynamic_links"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can insert invites for organizations they are members of."
on "public"."organization_invites"
as permissive
for insert
to authenticated
with check (((auth.uid() = inviter_id) AND (organization_id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid())))));



