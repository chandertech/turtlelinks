alter table "public"."dynamic_links" drop constraint "dynamic_links_url_fkey";

alter table "public"."dynamic_links" add constraint "dynamic_links_suffix_check" CHECK ((suffix ~* '^[-\w]+$'::text)) not valid;

alter table "public"."dynamic_links" validate constraint "dynamic_links_suffix_check";

alter table "public"."organization_invites" add constraint "organization_invites_invitee_email_check" CHECK ((invitee_email ~* '^(.+)@(.+){2,}[.](.+){2,}$'::text)) not valid;

alter table "public"."organization_invites" validate constraint "organization_invites_invitee_email_check";

alter table "public"."urls" add constraint "urls_url_check" CHECK ((url ~* '^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.turt\.link$'::text)) not valid;

alter table "public"."urls" validate constraint "urls_url_check";


