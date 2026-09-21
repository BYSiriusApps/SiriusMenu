-- SiriusMenu: kayıt anındaki yasal onayların (KVKK aydınlatma, kullanım şartları,
-- ticari elektronik ileti izni) kanıt olarak saklanması. Bkz. docs/yasal-uyumluluk.md.

alter table public.restaurants
  add column if not exists kvkk_onay_at timestamptz,
  add column if not exists kullanim_sartlari_onay_at timestamptz,
  add column if not exists pazarlama_izni boolean not null default false,
  add column if not exists pazarlama_izni_at timestamptz;

-- Kayıt formundaki zorunlu iki onay (KVKK + kullanım şartları) her hesap için geçerlidir;
-- opsiyonel pazarlama izni signUp() çağrısındaki user_metadata.pazarlama_izni alanından okunur.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_slug text;
  suffix int := 0;
  candidate text;
  new_restaurant_id uuid;
  wants_marketing boolean;
begin
  new_slug := coalesce(nullif(regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9]+', '-', 'g'), ''), 'menu');
  candidate := new_slug;
  while exists (select 1 from public.restaurants where slug = candidate) loop
    suffix := suffix + 1;
    candidate := new_slug || '-' || suffix::text;
  end loop;

  wants_marketing := coalesce((new.raw_user_meta_data ->> 'pazarlama_izni')::boolean, false);

  insert into public.restaurants (
    user_id, slug, name,
    kvkk_onay_at, kullanim_sartlari_onay_at,
    pazarlama_izni, pazarlama_izni_at
  )
  values (
    new.id, candidate, 'Menüm',
    now(), now(),
    wants_marketing, case when wants_marketing then now() else null end
  )
  returning id into new_restaurant_id;

  insert into public.subscriptions (restaurant_id, status)
  values (new_restaurant_id, 'trialing');

  return new;
end;
$$;
