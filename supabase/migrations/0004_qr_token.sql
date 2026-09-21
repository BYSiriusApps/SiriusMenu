-- SiriusMenu: rotatable QR güvenlik anahtarı.
-- Masaya basılan QR, /m/{slug}?k={qr_token} şeklinde token taşır. Token yenilenince eski basılı
-- QR'lar artık geçersiz olur ama düz /m/{slug} linki (paylaşım/SEO) token olmadan çalışmaya devam eder.

alter table public.restaurants
  add column if not exists qr_token text;

update public.restaurants set qr_token = encode(gen_random_bytes(12), 'hex') where qr_token is null;

alter table public.restaurants
  alter column qr_token set default encode(gen_random_bytes(12), 'hex'),
  alter column qr_token set not null;

create unique index if not exists restaurants_qr_token_key on public.restaurants (qr_token);
