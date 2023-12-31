create table "public"."organization_invites" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "inviter_id" uuid not null,
    "invitee_email" text not null,
    "organization_id" bigint not null,
    "invite_code" uuid not null,
    "status" smallint not null
);


alter table "public"."organization_invites" enable row level security;

create table "public"."organizations" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);


alter table "public"."organizations" enable row level security;

create table "public"."users_organizations" (
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null,
    "organization_id" bigint not null
);


alter table "public"."users_organizations" enable row level security;

alter table "public"."profiles" add column "email" character varying not null;

CREATE UNIQUE INDEX organization_invites_pkey ON public.organization_invites USING btree (id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX users_organizations_pkey ON public.users_organizations USING btree (profile_id, organization_id);

alter table "public"."organization_invites" add constraint "organization_invites_pkey" PRIMARY KEY using index "organization_invites_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."users_organizations" add constraint "users_organizations_pkey" PRIMARY KEY using index "users_organizations_pkey";

alter table "public"."organization_invites" add constraint "organization_invites_inviter_id_fkey" FOREIGN KEY (inviter_id) REFERENCES profiles(id) not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_inviter_id_fkey";

alter table "public"."organization_invites" add constraint "organization_invites_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_organization_id_fkey";

alter table "public"."users_organizations" add constraint "users_organizations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) not valid;

alter table "public"."users_organizations" validate constraint "users_organizations_organization_id_fkey";

alter table "public"."users_organizations" add constraint "users_organizations_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."users_organizations" validate constraint "users_organizations_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$function$
;

-- trigger handle_new_user every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Invitees can view their own invites."
on "public"."organization_invites"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.id
   FROM profiles
  WHERE ((profiles.email)::text = organization_invites.invitee_email))));


create policy "Users can insert invites for organizations they are members of."
on "public"."organization_invites"
as permissive
for insert
to public
with check (((auth.uid() = inviter_id) AND (EXISTS ( SELECT 1
   FROM users_organizations
  WHERE ((users_organizations.profile_id = auth.uid()) AND (users_organizations.organization_id = organization_invites.organization_id))))));


create policy "Users can view their own invites."
on "public"."organization_invites"
as permissive
for select
to public
using ((auth.uid() = inviter_id));


create policy "Users can view organizations they joined."
on "public"."organizations"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM users_organizations uo
  WHERE ((uo.organization_id = organizations.id) AND (uo.profile_id = auth.uid())))));


create policy "Users can delete their own organization memberships."
on "public"."users_organizations"
as permissive
for delete
to public
using ((auth.uid() = profile_id));


create policy "Users can insert organization memberships with pending invites"
on "public"."users_organizations"
as permissive
for insert
to public
with check (((auth.uid() = profile_id) AND (EXISTS ( SELECT 1
   FROM organization_invites
  WHERE ((organization_invites.invitee_email = auth.email()) AND (organization_invites.organization_id = users_organizations.organization_id) AND (organization_invites.status = 0))))));


create policy "Users can view organization memberships."
on "public"."users_organizations"
as permissive
for select
to public
using (true);



