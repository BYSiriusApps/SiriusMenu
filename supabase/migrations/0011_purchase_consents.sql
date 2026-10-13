-- SiriusMenu: satın alma anındaki elektronik sözleşme onaylarının (ön bilgilendirme formu +
-- mesafeli satış sözleşmesi + cayma hakkı istisnası) kanıt olarak saklanması.
-- Mesafeli Sözleşmeler Yönetmeliği m.5-6 ve m.15/1-ğ. Bkz. docs/yasal-uyumluluk.md.
-- Kayıtlar yalnızca sunucu (service role) tarafından yazılır; kullanıcı kendi kayıtlarını okuyabilir.

create table if not exists public.purchase_consents (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null,
  product text not null,            -- subscription | lifetime | image_pack | bulk50 | bulk100
  tier text,
  plan_interval text,
  doc_version text not null,        -- onaylanan sözleşme metinlerinin sürümü
  accepted_prelim boolean not null, -- ön bilgilendirme formu okundu
  accepted_contract boolean not null, -- mesafeli satış sözleşmesi kabul
  accepted_waiver boolean not null, -- ifaya başlanmasına onay / cayma hakkı istisnası
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists purchase_consents_restaurant_idx on public.purchase_consents (restaurant_id, created_at desc);

alter table public.purchase_consents enable row level security;

drop policy if exists "purchase_consents: owner read" on public.purchase_consents;

create policy "purchase_consents: owner read"
  on public.purchase_consents for select
  using (user_id = auth.uid());
