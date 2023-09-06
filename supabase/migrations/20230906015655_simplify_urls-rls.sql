drop policy "Users can delete URLs in their organizations." on "public"."urls";

drop policy "Users can insert urls into their organizations." on "public"."urls";

drop policy "Users can read URLs in their organizations." on "public"."urls";

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



