alter table "public"."organizations" add constraint "organizations_name_check" CHECK ((length(name) < 20)) not valid;

alter table "public"."organizations" validate constraint "organizations_name_check";


