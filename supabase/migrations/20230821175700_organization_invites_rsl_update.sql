create policy "Users can update invite status if they are the invitee"
on "public"."organization_invites"
as permissive
for update
to authenticated
using ((auth.email() = invitee_email));



