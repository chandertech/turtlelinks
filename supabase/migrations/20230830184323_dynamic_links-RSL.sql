drop policy "Enable insert for authenticated users only" on "public"."dynamic_links";

drop policy "Users can delete dynamic links in their organizations" on "public"."dynamic_links";

drop policy "Users can read dynamic links in their organizations" on "public"."dynamic_links";

drop policy "Users can update dynamic links in their organizations" on "public"."dynamic_links";

drop policy "Users can update if they are the invitee." on "public"."organization_invites";

drop policy "Users can view their own invites." on "public"."organization_invites";

create policy "Users can delete dynamic links in their organizations."
on "public"."dynamic_links"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can insert into their organization only."
on "public"."dynamic_links"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can read dynamic links in their organizations."
on "public"."dynamic_links"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can update dynamic links in their organizations."
on "public"."dynamic_links"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (urls u
     JOIN users_organizations uo ON ((uo.organization_id = u.organization_id)))
  WHERE ((u.url = dynamic_links.url) AND (uo.profile_id = auth.uid())))));


create policy "Users can update if they are the invitee."
on "public"."organization_invites"
as permissive
for update
to authenticated
using ((auth.email() = invitee_email));


create policy "Users can view their own invites."
on "public"."organization_invites"
as permissive
for select
to authenticated
using ((auth.uid() = inviter_id));



