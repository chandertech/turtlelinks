create table "public"."dynamic_links" (
    "prefix_url" text not null,
    "friendly_name" text not null,
    "suffix_url" text not null
);


create table "public"."prefix_urls" (
    "created_by" uuid not null,
    "prefix_url" text not null
);


alter table "public"."prefix_urls" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX dynamic_links_pkey ON public.dynamic_links USING btree (prefix_url);

CREATE UNIQUE INDEX prefix_urls_pkey ON public.prefix_urls USING btree (prefix_url);

CREATE UNIQUE INDEX prefix_urls_prefix_url_key ON public.prefix_urls USING btree (prefix_url);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."dynamic_links" add constraint "dynamic_links_pkey" PRIMARY KEY using index "dynamic_links_pkey";

alter table "public"."prefix_urls" add constraint "prefix_urls_pkey" PRIMARY KEY using index "prefix_urls_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."prefix_urls" add constraint "prefix_urls_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."prefix_urls" validate constraint "prefix_urls_created_by_fkey";

alter table "public"."prefix_urls" add constraint "prefix_urls_prefix_url_key" UNIQUE using index "prefix_urls_prefix_url_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

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
on "public"."prefix_urls"
as permissive
for insert
to authenticated
with check (true);


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));



