-- SiriusMenu: kullanıcı artık sosyal medya ikonlarının menüdeki konumunu (üst/alt/köşe)
-- ve başlık/kategori/fiyat yazı tipini seçebiliyor (bkz. app/lib/menu.tsx SOCIAL_POSITIONS, FONTS).

alter table public.restaurants
  add column if not exists social_position text not null default 'top',
  add column if not exists font text;

-- Genel menü RPC'sine social_position ve font eklendi (bkz. migration 0007). Dönüş tipi
-- değiştiği için CREATE OR REPLACE yetmiyor, önce eski fonksiyon kaldırılır.
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
  social_position text,
  font text,
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
    r.social_position,
    r.font,
    r.published,
    (p_qr_token is null or r.qr_token is null or p_qr_token = r.qr_token) as qr_valid
  from public.restaurants r
  where r.slug = p_slug
    and r.published = true;
$$;

revoke all on function public.get_public_menu(text, text) from public;
grant execute on function public.get_public_menu(text, text) to anon, authenticated;
