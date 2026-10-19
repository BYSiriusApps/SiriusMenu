-- SiriusMenu: güvenlik denetimi düzeltmesi (2026-10-19).
--
-- Sorun 1: "restaurants: owner full access" politikası `for all` idi ve yalnızca user_id'ye bakıyordu.
-- NEXT_PUBLIC_SUPABASE_ANON_KEY tarayıcıya gömülü olduğundan, oturum açmış herhangi bir kullanıcı
-- uygulamayı atlayıp Supabase REST'e doğrudan PATCH atarak kendi satırındaki tier / plan /
-- is_lifetime / image_quota* / brand_hidden / custom_domain / qr_token alanlarını değiştirebiliyor,
-- yani ödeme yapmadan Profesyonel plan, sınırsız görsel kotası, ömür boyu düzenleme ve WhatsApp AI
-- elde edebiliyordu. Satırı silip serbest değerlerle yeniden eklemek de mümkündü.
--
-- Sorun 2: "menu_images: owner" politikası `for all` idi. Sahip, status='processing' kind='bulk'
-- satırı ekleyerek ödeme yapmadan toplu iyileştirme kuyruğunu (Gemini) tetikleyebiliyor ve
-- original_path'i başka bir işletmenin klasörüne çevirebiliyordu.
--
-- Sorun 3: "wa_numbers: owner full access" ile sahip, telefon sahipliğini kanıtlamadan
-- verified=true satırı yazabiliyordu.
--
-- Çözüm: sahibe yalnızca ihtiyaç duyduğu işlemler verilir; faturalama/yetki sütunları ise
-- (service_role dışında) bir trigger ile değiştirilemez hale getirilir. Uygulama tarafında tüm
-- bu alanlar zaten service_role ile (Stripe webhook, cron, API route'ları) yazılıyor.

-- === restaurants ===
drop policy if exists "restaurants: owner full access" on public.restaurants;
drop policy if exists "restaurants: owner select" on public.restaurants;
drop policy if exists "restaurants: owner update" on public.restaurants;

create policy "restaurants: owner select"
  on public.restaurants for select
  using (auth.uid() = user_id);

-- insert/delete politikası yok: satırı handle_new_user() trigger'ı (security definer) oluşturur,
-- hesap silme service_role ile yapılır.
create policy "restaurants: owner update"
  on public.restaurants for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.guard_restaurant_protected_columns()
returns trigger
language plpgsql
as $$
begin
  -- Yalnızca istemci rolleri kısıtlanır; service_role, postgres ve diğer sunucu rolleri serbesttir.
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if new.id is distinct from old.id
     or new.user_id is distinct from old.user_id
     or new.tier is distinct from old.tier
     or new.plan is distinct from old.plan
     or new.is_lifetime is distinct from old.is_lifetime
     or new.image_quota is distinct from old.image_quota
     or new.image_quota_used is distinct from old.image_quota_used
     or new.image_quota_period_end is distinct from old.image_quota_period_end
     or new.brand_hidden is distinct from old.brand_hidden
     or new.custom_domain is distinct from old.custom_domain
     or new.qr_token is distinct from old.qr_token
     or new.edit_unlock_until is distinct from old.edit_unlock_until
     or new.whatsapp_number is distinct from old.whatsapp_number
     or new.whatsapp_verified is distinct from old.whatsapp_verified
     or new.whatsapp_verify_code is distinct from old.whatsapp_verify_code
     or new.kvkk_onay_at is distinct from old.kvkk_onay_at
     or new.kullanim_sartlari_onay_at is distinct from old.kullanim_sartlari_onay_at
  then
    raise exception 'protected restaurant column' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_restaurants_guard on public.restaurants;
create trigger trg_restaurants_guard
  before update on public.restaurants
  for each row execute function public.guard_restaurant_protected_columns();

-- === menu_images: sahip yalnızca okuyabilir; yazma service_role (API route + webhook + cron) ===
drop policy if exists "menu_images: owner" on public.menu_images;
drop policy if exists "menu_images: owner read" on public.menu_images;
create policy "menu_images: owner read" on public.menu_images for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

-- === whatsapp_authorized_numbers: sahip okuyabilir ve silebilir; ekleme/doğrulama service_role ===
drop policy if exists "wa_numbers: owner full access" on public.whatsapp_authorized_numbers;
drop policy if exists "wa_numbers: owner read" on public.whatsapp_authorized_numbers;
drop policy if exists "wa_numbers: owner delete" on public.whatsapp_authorized_numbers;

create policy "wa_numbers: owner read"
  on public.whatsapp_authorized_numbers for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));

create policy "wa_numbers: owner delete"
  on public.whatsapp_authorized_numbers for delete
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.user_id = auth.uid()));
