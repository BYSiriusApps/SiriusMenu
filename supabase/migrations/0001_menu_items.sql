-- Bu dosya otomatik uygulanmaz. Supabase Dashboard > SQL Editor içine yapıştırıp
-- elle çalıştırın (publishable/anon key ile şema değişikliği yapılamaz, bu işlem
-- proje sahibinin Supabase hesabı üzerinden bir kerelik yapılmalıdır).

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  price numeric(10, 2) not null,
  meat_type text check (meat_type in ('dana', 'kuzu', 'kanatli', 'yok')),
  calories integer,
  ingredients text[] not null default '{}',
  allergens text[] not null default '{}',
  contains_alcohol boolean not null default false,
  contains_pork boolean not null default false,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

-- Yasal-uyum-rehberi.md §5 şemasındaki zorunlu alanlar (meat_type, calories,
-- allergens, contains_alcohol, contains_pork) bu tabloda karşılık bulur.

-- Anon/publishable key sadece yayınlanmış (is_published = true) ürünleri okuyabilir.
-- Yazma/güncelleme policy'si burada tanımlanmadı: ürün ekleme/düzenleme şimdilik
-- Supabase Studio üzerinden veya service_role key ile sunucu tarafında yapılmalıdır
-- (bkz. restoran-siparis-sistemi/guvenlik-ve-mimari-rehberi.md §2).
create policy "public can read published menu items"
  on public.menu_items
  for select
  to anon, authenticated
  using (is_published = true);
