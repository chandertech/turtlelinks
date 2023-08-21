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

CREATE TRIGGER create_organization_and_users_organizations_trigger AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION create_organization_and_users_organizations();


