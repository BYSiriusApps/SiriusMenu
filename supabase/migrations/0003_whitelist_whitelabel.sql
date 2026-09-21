-- SiriusMenu faz-d: çoklu yetkili WhatsApp numarası (whitelist) + white-label (custom domain).
-- Not: restaurants.whatsapp_number/whatsapp_verified/whatsapp_verify_code (0002) artık KULLANILMIYOR;
-- yetkilendirme bundan sonra whatsapp_authorized_numbers tablosundan yapılır. Geriye dönük uyumluluk
-- için kolonlar silinmedi.

-- === restaurants: white-label ===
alter table public.restaurants
  add column if not exists custom_domain text,
  add column if not exists brand_hidden boolean not null default false;

create unique index if not exists restaurants_custom_domain_key
  on public.restaurants (custom_domain)
  where custom_domain is not null;

-- === whatsapp_authorized_numbers: yetkili numara whitelist'i (Patron/Müdür vb.) ===
create table if not exists public.whatsapp_authorized_numbers (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  phone text not null,
  role text not null default 'yetkili',   -- patron | mudur | yetkili (serbest metin, sadece etiket)
  verified boolean not null default false,
  verify_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, phone)
);

-- Doğrulanmış bir numara aynı anda sadece bir restorana bağlı olabilir (webhook lookup'ı bununla yapılır).
create unique index if not exists whatsapp_authorized_numbers_phone_verified_key
  on public.whatsapp_authorized_numbers (phone)
  where verified = true;

create index if not exists whatsapp_authorized_numbers_restaurant_idx
  on public.whatsapp_authorized_numbers (restaurant_id);

drop trigger if exists trg_wa_numbers_updated_at on public.whatsapp_authorized_numbers;
create trigger trg_wa_numbers_updated_at
  before update on public.whatsapp_authorized_numbers
  for each row execute function public.set_updated_at();

alter table public.whatsapp_authorized_numbers enable row level security;

drop policy if exists "wa_numbers: owner full access" on public.whatsapp_authorized_numbers;
create policy "wa_numbers: owner full access"
  on public.whatsapp_authorized_numbers for all
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

-- whatsapp_authorized_numbers'a public/service_role dışı yazma yok; webhook + panel service_role/owner ile yazar.
