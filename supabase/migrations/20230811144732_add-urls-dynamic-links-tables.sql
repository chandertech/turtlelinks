create table "public"."dynamic_links" (
    "link" text not null,
    "suffix" text not null,
    "deep_link" text not null,
    "friendly_name" text not null,
    "url" text not null,
    "is_archived" boolean not null default false
);


create table "public"."urls" (
    "url" text not null,
    "id" uuid not null,
    "subdomain" text not null,
    "domain" text not null
);


CREATE UNIQUE INDEX dynamic_links_pkey ON public.dynamic_links USING btree (link);

CREATE UNIQUE INDEX urls_pkey ON public.urls USING btree (url);

alter table "public"."dynamic_links" add constraint "dynamic_links_pkey" PRIMARY KEY using index "dynamic_links_pkey";

alter table "public"."urls" add constraint "urls_pkey" PRIMARY KEY using index "urls_pkey";

alter table "public"."dynamic_links" add constraint "dynamic_links_url_fkey" FOREIGN KEY (url) REFERENCES urls(url) ON DELETE CASCADE not valid;

alter table "public"."dynamic_links" validate constraint "dynamic_links_url_fkey";

alter table "public"."urls" add constraint "urls_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."urls" validate constraint "urls_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

create policy "Enable insert for authenticated users only"
on "public"."urls"
as permissive
for insert
to authenticated
with check (true);



