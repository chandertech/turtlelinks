drop policy "Users can delete their own organization memberships." on "public"."users_organizations";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_organization_and_users_organizations()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    org_name TEXT;
    org_id BIGINT;
BEGIN
    -- Create a new entry in the "organizations" table
    org_name := substring(NEW.email FROM '^([^@]+)');
    INSERT INTO public.organizations (name, created_at)
    VALUES (org_name, NOW())
    RETURNING id INTO org_id;

    -- Create a new entry in the "users_organizations" table
    INSERT INTO public.users_organizations (profile_id, organization_id, created_at)
    VALUES (NEW.id, org_id, NOW());

    RETURN NEW;
END;
$function$
;

create policy "Users can delete matching organization memberships"
on "public"."users_organizations"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.profile_id = auth.uid()) AND (uo.organization_id = users_organizations.organization_id)))));



