-- SiriusMenu: menü düzeni seçeneği ("list" = düz liste, "coverflow" = 3D kaydırmalı vitrin).
-- Bkz. app/lib/menu.tsx MENU_LAYOUTS, app/lib/Coverflow.tsx.

alter table public.restaurants
  add column if not exists layout text not null default 'list';

-- Genel menü RPC'sine layout eklendi (bkz. migration 0008). Dönüş tipi değiştiği için önce kaldırılır.
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
  layout text,
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
    r.layout,
    r.published,
    (p_qr_token is null or r.qr_token is null or p_qr_token = r.qr_token) as qr_valid
  from public.restaurants r
  where r.slug = p_slug
    and r.published = true;
$$;

revoke all on function public.get_public_menu(text, text) from public;
grant execute on function public.get_public_menu(text, text) to anon, authenticated;
