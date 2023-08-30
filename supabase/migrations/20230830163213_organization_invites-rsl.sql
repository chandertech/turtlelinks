drop policy "Invitees can view their own invites." on "public"."organization_invites";

drop policy "Users can update invite status if they are the invitee" on "public"."organization_invites";

drop policy "Users can insert invites for organizations they are members of." on "public"."organization_invites";

drop policy "Users can view their own invites." on "public"."organization_invites";

create policy "Users can update if they are the invitee."
on "public"."organization_invites"
as permissive
for update
to authenticated
using ((auth.email() = invitee_email));


create policy "Users can insert invites for organizations they are members of."
on "public"."organization_invites"
as permissive
for insert
to authenticated
with check (((auth.uid() = inviter_id) AND (EXISTS ( SELECT 1
   FROM users_organizations
  WHERE ((users_organizations.profile_id = auth.uid()) AND (users_organizations.organization_id = organization_invites.organization_id))))));


create policy "Users can view their own invites."
on "public"."organization_invites"
as permissive
for select
to authenticated
using ((auth.uid() = inviter_id));



