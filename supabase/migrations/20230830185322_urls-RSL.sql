drop policy "Enable insert for authenticated users only" on "public"."urls";

drop policy "Users can delete URLs in their organizations" on "public"."urls";

drop policy "Users can read URLs in their organizations" on "public"."urls";

create policy "Users can delete URLs in their organizations."
on "public"."urls"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.profile_id = auth.uid()) AND (uo.organization_id = urls.organization_id)))));


create policy "Users can insert urls into their organizations."
on "public"."urls"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.profile_id = auth.uid()) AND (uo.organization_id = urls.organization_id)))));


create policy "Users can read URLs in their organizations."
on "public"."urls"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.profile_id = auth.uid()) AND (uo.organization_id = urls.organization_id)))));



