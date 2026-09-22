-- SiriusMenu: landing showcase + /ornek + /m/demo-* için gömülü demo menüler.
-- Bu dosyanın içeriği app/lib/demos.ts (DEMOS) ile birebir aynı tutulur; biri değişirse
-- diğeri de güncellenmeli (scripts/seed-demos.mts DEMOS'tan otomatik türetip prod'a da uygular).
-- Yalnızca lokal `supabase db reset` / `supabase start` sırasında otomatik çalışır.

do $$
declare
  v_user_id uuid;
begin
  -- demo-kafe
  select id into v_user_id from auth.users where email = 'demo-kafe@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-kafe@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Kahve Durağı',
    subtitle = 'Üçüncü nesil kahve & ev yapımı tatlılar',
    theme = 'kafe',
    currency = '₺',
    menu = '[{"id":1,"name":"Kahveler","items":[{"id":11,"name":"Flat White","desc":"Çift shot espresso, kadifemsi süt","price":"95","tags":["sef"],"image":"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=70"},{"id":12,"name":"Filtre Kahve","desc":"Günün çekirdeği, V60","price":"80","tags":[],"image":"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70"},{"id":13,"name":"Soğuk Demleme","desc":"18 saat demlenmiş, buzlu","price":"105","tags":["yeni"],"image":"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=70"}]},{"id":2,"name":"Tatlılar","items":[{"id":21,"name":"San Sebastian","desc":"Yanık cheesecake, tuzlu karamel","price":"140","tags":["sef"],"image":"https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=70"},{"id":22,"name":"Vegan Brownie","desc":"Çikolatalı, cevizli","price":"110","tags":["vegan","glutensiz"]}]},{"id":3,"name":"Atıştırmalıklar","items":[{"id":31,"name":"Avokado Tost","desc":"Ekşi maya ekmek, kiraz domates, acı sos","price":"160","tags":["aci"],"image":"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=70"}]}]'::jsonb,
    published = true
  where user_id = v_user_id;

  -- demo-restoran
  select id into v_user_id from auth.users where email = 'demo-restoran@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-restoran@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Meze & Mangal',
    subtitle = 'Ege mezeleri ve odun ateşinde ızgara',
    theme = 'klasik',
    currency = '₺',
    menu = '[{"id":1,"name":"Başlangıçlar","items":[{"id":11,"name":"Humus","desc":"Nohut, tahin, zeytinyağı, kimyon","price":"120","tags":["vegan"],"image":"https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=400&q=70"},{"id":12,"name":"Haydari","desc":"Süzme yoğurt, ceviz, taze nane","price":"110","tags":[],"image":"https://images.unsplash.com/photo-1601001435957-74f0958a93df?w=400&q=70"},{"id":13,"name":"Sigara Böreği","desc":"El açması yufka, beyaz peynir","price":"130","tags":["sef"],"image":"https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=70"}]},{"id":2,"name":"Izgara","items":[{"id":21,"name":"Adana Kebap","desc":"Zırh kıyma, közlenmiş biber ve domates","price":"320","tags":["aci","sef"],"image":"https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=70"},{"id":22,"name":"Kuzu Pirzola","desc":"Köz patlıcan püresi ile","price":"480","tags":[],"image":"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=70"},{"id":23,"name":"Çöp Şiş","desc":"Küçük kuşbaşı kuzu, közde","price":"340","tags":["yeni"],"image":"https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=70"}]},{"id":3,"name":"Tatlı","items":[{"id":31,"name":"Künefe","desc":"Antep fıstığı, kaymak","price":"180","tags":["sef"],"image":"https://images.unsplash.com/photo-1610452271614-ec4d2f92b7b4?w=400&q=70"}]}]'::jsonb,
    published = true
  where user_id = v_user_id;

  -- demo-bar
  select id into v_user_id from auth.users where email = 'demo-bar@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-bar@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Gece Vardiyası',
    subtitle = 'İmza kokteyller ve kadeh şarap',
    theme = 'gece',
    currency = '₺',
    menu = '[{"id":1,"name":"İmza Kokteyller","items":[{"id":11,"name":"Duman & Bal","desc":"İsli viski, bal, limon, ardıç","price":"420","tags":["sef"],"image":"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=70"},{"id":12,"name":"Bahçe Sour","desc":"Cin, taze salatalık, fesleğen","price":"380","tags":["yeni"],"image":"https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=70"},{"id":13,"name":"Acı Paloma","desc":"Tekila, greyfurt, jalapeño","price":"390","tags":["aci"],"image":"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=70"}]},{"id":2,"name":"Kadeh Şarap","items":[{"id":21,"name":"Narince","desc":"Tokat, beyaz, kuru kayısı notaları","price":"260","tags":[],"image":"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=70"},{"id":22,"name":"Öküzgözü","desc":"Elazığ, kırmızı, olgun kiraz","price":"280","tags":[]}]},{"id":3,"name":"Atıştırma","items":[{"id":31,"name":"Peynir Tabağı","desc":"Yerel peynirler, bal, ceviz","price":"320","tags":["sef"],"image":"https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=70"},{"id":32,"name":"Baharatlı Badem","desc":"Ev usulü kavrulmuş","price":"90","tags":["vegan","aci"]}]}]'::jsonb,
    published = true
  where user_id = v_user_id;

end $$;
