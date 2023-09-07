drop policy "Enable insert for authenticated users only" on "public"."dynamic_links";

drop policy "Users can delete dynamic links in their organizations" on "public"."dynamic_links";

drop policy "Users can read dynamic links in their organizations" on "public"."dynamic_links";

drop policy "Users can update dynamic links in their organizations" on "public"."dynamic_links";

drop policy "Enable delete for authenticated users only" on "public"."fake_dns_provider";

drop policy "Enable insert for authenticated users only" on "public"."fake_dns_provider";

drop policy "Enable read access for authenticated" on "public"."fake_dns_provider";

drop policy "Invitees can view their own invites." on "public"."organization_invites";

drop policy "Users can update invite status if they are the invitee" on "public"."organization_invites";

drop policy "Users can delete their organizations" on "public"."organizations";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Enable insert for authenticated users only" on "public"."urls";

drop policy "Users can delete URLs in their organizations" on "public"."urls";

drop policy "Users can read URLs in their organizations" on "public"."urls";

drop policy "Users can delete matching organization memberships" on "public"."users_organizations";

drop policy "Users can insert organization memberships with pending invites" on "public"."users_organizations";

drop policy "Users can view organization memberships." on "public"."users_organizations";

drop policy "Users can insert invites for organizations they are members of." on "public"."organization_invites";

drop policy "Users can view their own invites." on "public"."organization_invites";

drop policy "Users can view organizations they joined." on "public"."organizations";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

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


create policy "User can view the invite if they are the invitee."
on "public"."organization_invites"
as permissive
for select
to authenticated
using ((auth.email() = invitee_email));


create policy "Users can update if they are the invitee."
on "public"."organization_invites"
as permissive
for update
to authenticated
using ((auth.email() = invitee_email));


create policy "Users can delete organizations they are a member of."
on "public"."organizations"
as permissive
for delete
to authenticated
using ((id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid()))));


create policy "User can read profiles if they are in the same organization."
on "public"."profiles"
as permissive
for select
to authenticated
using ((id IN ( SELECT uo.profile_id
   FROM users_organizations uo
  WHERE (uo.organization_id IN ( SELECT users_organizations.organization_id
           FROM users_organizations
          WHERE (users_organizations.profile_id = auth.uid()))))));


create policy "User can read their own profile."
on "public"."profiles"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "Users can delete URLs in their organizations."
on "public"."urls"
as permissive
for delete
to authenticated
using ((organization_id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid()))));


create policy "Users can insert urls into their organizations."
on "public"."urls"
as permissive
for insert
to authenticated
with check ((organization_id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid()))));


create policy "Users can read URLs in their organizations."
on "public"."urls"
as permissive
for select
to authenticated
using ((organization_id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid()))));


create policy "User can delete org memberships if they are member of said org."
on "public"."users_organizations"
as permissive
for delete
to authenticated
using ((organization_id IN ( SELECT get_orgs_for_authenticated_user() AS get_orgs_for_authenticated_user)));


create policy "User can insert their membership if an org invite exists."
on "public"."users_organizations"
as permissive
for insert
to authenticated
with check (((auth.uid() = profile_id) AND (organization_id IN ( SELECT oi.organization_id
   FROM organization_invites oi
  WHERE ((oi.invitee_email = auth.email()) AND (oi.organization_id = oi.organization_id) AND (oi.status = 0))))));


create policy "User can select if they are a member of the organization."
on "public"."users_organizations"
as permissive
for select
to authenticated
using ((organization_id IN ( SELECT get_orgs_for_authenticated_user() AS get_orgs_for_authenticated_user)));


create policy "Users can insert invites for organizations they are members of."
on "public"."organization_invites"
as permissive
for insert
to authenticated
with check (((auth.uid() = inviter_id) AND (organization_id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid())))));


create policy "Users can view their own invites."
on "public"."organization_invites"
as permissive
for select
to authenticated
using ((auth.uid() = inviter_id));


create policy "Users can view organizations they joined."
on "public"."organizations"
as permissive
for select
to authenticated
using ((id IN ( SELECT uo.organization_id
   FROM users_organizations uo
  WHERE (uo.profile_id = auth.uid()))));


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



