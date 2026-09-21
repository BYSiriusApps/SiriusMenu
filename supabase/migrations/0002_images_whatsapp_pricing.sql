-- SiriusMenu faz-c: ürün fotoğrafı + AI iyileştirme kotası, WhatsApp AI menü editörü, yeni fiyatlama.

-- === restaurants: WhatsApp bağlama + plan + görsel kotası ===
alter table public.restaurants
  add column if not exists whatsapp_number text,
  add column if not exists whatsapp_verified boolean not null default false,
  add column if not exists whatsapp_verify_code text,
  add column if not exists plan text not null default 'trial',
  add column if not exists image_quota int not null default 0,
  add column if not exists image_quota_used int not null default 0,
  add column if not exists image_quota_period_end timestamptz;

create unique index if not exists restaurants_whatsapp_number_key
  on public.restaurants (whatsapp_number)
  where whatsapp_number is not null;

-- === subscriptions: aylık/yıllık + kurulum ücreti ===
alter table public.subscriptions
  add column if not exists plan_interval text,
  add column if not exists setup_fee_paid boolean not null default false;

-- === menu_images: yüklenen/iyileştirilen görseller, kota tüketimi ve toplu kuyruk ===
create table if not exists public.menu_images (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  item_key text not null,                 -- "{categoryId}:{itemId}"
  original_path text not null,
  enhanced_path text,
  status text not null default 'uploaded', -- uploaded | processing | enhanced | failed
  kind text not null default 'single',     -- single | bulk
  gemini_meta jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists menu_images_restaurant_idx on public.menu_images (restaurant_id);
create index if not exists menu_images_status_idx on public.menu_images (status) where status = 'processing';

drop trigger if exists trg_menu_images_updated_at on public.menu_images;
create trigger trg_menu_images_updated_at
  before update on public.menu_images
  for each row execute function public.set_updated_at();

-- === menu_change_log: panel + WhatsApp değişiklik denetimi ve geri alma ===
create table if not exists public.menu_change_log (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  source text not null default 'panel',    -- panel | whatsapp
  diff jsonb not null,                      -- { before: <menu>, after: <menu>, summary: text }
  note text,
  undone boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists menu_change_log_restaurant_idx on public.menu_change_log (restaurant_id, created_at desc);

-- === whatsapp_messages: log + idempotency ===
create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants (id) on delete set null,
  wa_message_id text unique,
  wa_from text not null,
  direction text not null,                  -- in | out
  body text,
  media_path text,
  intent jsonb,
  applied boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists whatsapp_messages_restaurant_idx on public.whatsapp_messages (restaurant_id, created_at desc);

-- === wa_sessions: çok adımlı konuşma durumu ===
create table if not exists public.wa_sessions (
  restaurant_id uuid primary key references public.restaurants (id) on delete cascade,
  phone text not null,
  context jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_wa_sessions_updated_at on public.wa_sessions;
create trigger trg_wa_sessions_updated_at
  before update on public.wa_sessions
  for each row execute function public.set_updated_at();

-- === usage_charges: tek seferlik satın almalar (paket / toplu / kota aşımı) ===
create table if not exists public.usage_charges (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  type text not null,                       -- image_pack | bulk50 | bulk100 | overage
  stripe_session_id text unique,
  credits int not null default 0,
  amount int,
  status text not null default 'pending',   -- pending | paid | canceled
  created_at timestamptz not null default now()
);
create index if not exists usage_charges_restaurant_idx on public.usage_charges (restaurant_id, created_at desc);

-- === RLS ===
alter table public.menu_images enable row level security;
alter table public.menu_change_log enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.wa_sessions enable row level security;
alter table public.usage_charges enable row level security;

-- Sahibi: kendi restoranına ait satırlar
drop policy if exists "menu_images: owner" on public.menu_images;
create policy "menu_images: owner" on public.menu_images for all
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

drop policy if exists "menu_change_log: owner read" on public.menu_change_log;
create policy "menu_change_log: owner read" on public.menu_change_log for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

drop policy if exists "usage_charges: owner read" on public.usage_charges;
create policy "usage_charges: owner read" on public.usage_charges for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

-- whatsapp_messages / wa_sessions / menu_change_log yazma: sadece service_role (webhook + cron). Ek policy yok.

-- === Storage bucket'ları ===
insert into storage.buckets (id, name, public)
  values ('menu-photos', 'menu-photos', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('wa-inbound', 'wa-inbound', false)
  on conflict (id) do nothing;

-- menu-photos: herkes okur, sahibi kendi restoran klasörüne yazar
drop policy if exists "menu-photos public read" on storage.objects;
create policy "menu-photos public read" on storage.objects for select
  using (bucket_id = 'menu-photos');

drop policy if exists "menu-photos owner write" on storage.objects;
create policy "menu-photos owner write" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'menu-photos'
    and (storage.foldername(name))[1] in (
      select r.id::text from public.restaurants r where r.user_id = auth.uid()
    )
  );

drop policy if exists "menu-photos owner update" on storage.objects;
create policy "menu-photos owner update" on storage.objects for update to authenticated
  using (
    bucket_id = 'menu-photos'
    and (storage.foldername(name))[1] in (
      select r.id::text from public.restaurants r where r.user_id = auth.uid()
    )
  );
