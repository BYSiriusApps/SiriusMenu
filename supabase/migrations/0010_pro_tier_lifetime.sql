-- Profesyonel abonelik seviyesi ("tier": starter | pro) + Tek Seferlik (Ömür Boyu Menü) desteği.
-- Not: migration 0009'daki edit_unlock_until artık uygulama kodu tarafından kullanılmıyor
-- (pay-per-edit modeli terk edildi, yerine kalıcı "is_lifetime" bayrağı geldi); kolonu
-- kaldırmıyoruz, zararsız/boş kalıyor, ileride ayrı bir temizlik migration'ıyla düşürülebilir.

alter table public.restaurants
  add column if not exists tier text not null default 'starter',
  add column if not exists is_lifetime boolean not null default false;
