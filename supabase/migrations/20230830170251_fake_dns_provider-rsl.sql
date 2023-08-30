drop policy "Enable delete for authenticated users only" on "public"."fake_dns_provider";

drop policy "Enable insert for authenticated users only" on "public"."fake_dns_provider";

drop policy "Enable read access for authenticated" on "public"."fake_dns_provider";

drop policy "Users can update if they are the invitee." on "public"."organization_invites";

drop policy "Users can view their own invites." on "public"."organization_invites";

create policy "Users can update if they are the invitee."
on "public"."organization_invites"
as permissive
for update
to public
using ((auth.email() = invitee_email));


create policy "Users can view their own invites."
on "public"."organization_invites"
as permissive
for select
to public
using ((auth.uid() = inviter_id));



