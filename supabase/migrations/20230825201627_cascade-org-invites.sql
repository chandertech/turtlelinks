alter table "public"."organization_invites" drop constraint "organization_invites_organization_id_fkey";

alter table "public"."organization_invites" add constraint "organization_invites_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_organization_id_fkey";


