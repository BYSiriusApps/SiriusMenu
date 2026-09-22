-- SiriusMenu: güvenlik düzeltmesi — genel (anonim) menü erişimini sütun bazında kısıtla.
--
-- Sorun: "restaurants: public read published" politikası SATIR bazlıydı (published = true),
-- Postgres RLS ise sütun bazlı değildir. Bu yüzden anon anahtarla (herkese açık, tarayıcıya
-- gömülü NEXT_PUBLIC_SUPABASE_ANON_KEY) Supabase REST API'sine doğrudan istek atan biri
-- (Next.js uygulamasını hiç kullanmadan) `select=*` ile yayındaki HER restoranın TÜM sütunlarını
-- okuyabiliyordu: qr_token (QR yenileme güvenlik özelliğini tamamen etkisiz kılar), user_id,
-- whatsapp_number, custom_domain, image_quota*, kvkk_onay_at, pazarlama_izni, brand_hidden vb.
-- Next.js tarafındaki `/m/[slug]` sayfası sadece belirli sütunları seçse de, bu satır politikası
-- tabloyu doğrudan REST üzerinden herkese açık bırakıyordu.
--
-- Çözüm: public SELECT politikasını kaldır (tablo artık sadece sahibine açık), yerine SECURITY
-- DEFINER bir fonksiyon ekle; bu fonksiyon SADECE genel menü için gereken sütunları döndürür ve
-- qr_token'ı hiç dışarı çıkarmadan, doğrudan bir "eşleşme" booleanı olarak karşılaştırır.

drop policy if exists "restaurants: public read published" on public.restaurants;

create or replace function public.get_public_menu(p_slug text, p_qr_token text default null)
returns table (
  name text,
  subtitle text,
  theme text,
  currency text,
  menu jsonb,
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
    r.published,
    (p_qr_token is null or r.qr_token is null or p_qr_token = r.qr_token) as qr_valid
  from public.restaurants r
  where r.slug = p_slug
    and r.published = true;
$$;

revoke all on function public.get_public_menu(text, text) from public;
grant execute on function public.get_public_menu(text, text) to anon, authenticated;

-- Defense in depth: menu-photos bucket'ına yüklenebilecek dosya türü/boyutunu sunucu tarafında sınırla
-- (istemci sadece <input accept="image/*"> ile öneriyor, zorunlu kılmıyordu; contentType istemci
-- tarafından belirleniyordu).
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    file_size_limit = 10485760 -- 10MB
where id = 'menu-photos';
