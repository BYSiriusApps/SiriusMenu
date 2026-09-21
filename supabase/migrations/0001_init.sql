-- SiriusMenu: restoranlar (tenant), menü verisi ve abonelik durumu.

create extension if not exists "pgcrypto";

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  slug text not null unique,
  name text not null default 'Menüm',
  subtitle text not null default '',
  theme text not null default 'kafe',
  currency text not null default '₺',
  menu jsonb not null default '[]'::jsonb,
  logo_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'trialing',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions (stripe_subscription_id);

-- updated_at otomasyonu
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_restaurants_updated_at on public.restaurants;
create trigger trg_restaurants_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Yeni kullanıcı kayıt olunca otomatik restoran + deneme aboneliği oluştur.
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
begin
  new_slug := coalesce(nullif(regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9]+', '-', 'g'), ''), 'menu');
  candidate := new_slug;
  while exists (select 1 from public.restaurants where slug = candidate) loop
    suffix := suffix + 1;
    candidate := new_slug || '-' || suffix::text;
  end loop;

  insert into public.restaurants (user_id, slug, name)
  values (new.id, candidate, 'Menüm')
  returning id into new_restaurant_id;

  insert into public.subscriptions (restaurant_id, status)
  values (new_restaurant_id, 'trialing');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.restaurants enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "restaurants: owner full access" on public.restaurants;
create policy "restaurants: owner full access"
  on public.restaurants for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "restaurants: public read published" on public.restaurants;
create policy "restaurants: public read published"
  on public.restaurants for select
  using (published = true);

drop policy if exists "subscriptions: owner read" on public.subscriptions;
create policy "subscriptions: owner read"
  on public.subscriptions for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

-- subscriptions tablosuna yazma sadece service_role (Stripe webhook) ile yapılır; RLS altında başka insert/update policy yok.
