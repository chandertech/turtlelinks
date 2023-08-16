create policy "Allow anyone to read deep links"
on "public"."dynamic_links"
as permissive
for select
to public
using (true);



