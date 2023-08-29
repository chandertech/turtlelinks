drop policy "Users can delete their organizations" on "public"."organizations";

drop policy "User can read profiles if they are in the same organization" on "public"."profiles";

drop policy "Users can view organizations they joined." on "public"."organizations";

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
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((profiles.id = uo.profile_id) AND (uo.organization_id IN ( SELECT users_organizations.organization_id
           FROM users_organizations
          WHERE (users_organizations.profile_id = auth.uid())))))));


create policy "Users can view organizations they joined."
on "public"."organizations"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.organization_id = organizations.id) AND (uo.profile_id = auth.uid())))));



