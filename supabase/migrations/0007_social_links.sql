-- SiriusMenu: işletmenin kendi logosu (`logo_url`, bkz. 0001_init) panelde hiç kullanılmıyordu;
-- şimdi panelde yüklenip genel menüde gösteriliyor. Sosyal medya / web sitesi linkleri
-- (Instagram, Facebook, TikTok, web sitesi) için yeni, tamamen opsiyonel bir jsonb sütun.

alter table public.restaurants
  add column if not exists social jsonb not null default '{}'::jsonb;

-- Genel menü RPC'sine logo_url ve social eklendi (bkz. migration 0006). Dönüş tipi değiştiği
-- için CREATE OR REPLACE yetmiyor, önce eski fonksiyon kaldırılır.
drop function if exists public.get_public_menu(text, text);

create function public.get_public_menu(p_slug text, p_qr_token text default null)
returns table (
  name text,
  subtitle text,
  theme text,
  currency text,
  menu jsonb,
  logo_url text,
  social jsonb,
  published boolean,
  qr_valid boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.name,
    r.subtitle,
    r.theme,
    r.currency,
    r.menu,
    r.logo_url,
    r.social,
    r.published,
    (p_qr_token is null or r.qr_token is null or p_qr_token = r.qr_token) as qr_valid
  from public.restaurants r
  where r.slug = p_slug
    and r.published = true;
$$;

revoke all on function public.get_public_menu(text, text) from public;
grant execute on function public.get_public_menu(text, text) to anon, authenticated;
