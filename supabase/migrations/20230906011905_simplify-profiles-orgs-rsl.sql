drop policy "Users can view organizations they joined." on "public"."organizations";

drop policy "User can read profiles if they are in the same organization." on "public"."profiles";

create policy "Users can view organizations they joined."
on "public"."organizations"
as permissive
for select
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



