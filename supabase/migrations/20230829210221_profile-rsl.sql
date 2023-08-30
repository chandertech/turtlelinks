drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

create policy "User can read profiles if they are in the same organization"
on "public"."profiles"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((profiles.id = uo.profile_id) AND (uo.organization_id IN ( SELECT users_organizations.organization_id
           FROM users_organizations
          WHERE (users_organizations.profile_id = auth.uid())))))));


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
using ((auth.uid() = id));



