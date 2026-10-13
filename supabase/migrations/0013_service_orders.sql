-- Anahtar teslim kurulum hizmeti siparişleri (bkz. PRICING.service, /api/stripe/checkout product="service").
-- Ödeme webhook'ta yazılır; teslimat elle yürütülür (status: paid -> in_progress -> delivered).
-- ack_ai = müşteri, üretilmiş görsellerin "Görsel temsilidir" etiketiyle gösterileceğini onayladı.

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  scenario text not null check (scenario in ('migrate', 'enhance', 'generate', 'scratch')),
  item_count integer not null check (item_count > 0),
  amount integer,                      -- kuruş cinsinden Stripe amount_total
  ack_ai boolean not null default false,
  stripe_session_id text unique,
  status text not null default 'paid' check (status in ('paid', 'in_progress', 'delivered')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists service_orders_restaurant_idx on public.service_orders (restaurant_id, created_at desc);

alter table public.service_orders enable row level security;

drop policy if exists "service_orders: owner read" on public.service_orders;

create policy "service_orders: owner read"
  on public.service_orders for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));
