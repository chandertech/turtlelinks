drop policy "Users can delete matching organization memberships" on "public"."users_organizations";

drop policy "Users can insert organization memberships with pending invites" on "public"."users_organizations";

drop policy "Users can view organization memberships." on "public"."users_organizations";

alter table "public"."users_organizations" disable row level security;

create policy "User can view the invite if they are the invitee."
on "public"."organization_invites"
as permissive
for select
to authenticated
using ((auth.email() = invitee_email));



