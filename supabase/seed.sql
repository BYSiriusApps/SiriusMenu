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
    menu = '[{"id":1,"name":"Kahveler","items":[{"id":11,"name":"Flat White","desc":"Çift shot espresso, kadifemsi süt","price":"95","tags":["sef"],"image":"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=70"},{"id":12,"name":"Filtre Kahve","desc":"Günün çekirdeği, V60","price":"80","tags":[],"image":"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70"},{"id":13,"name":"Soğuk Demleme","desc":"18 saat demlenmiş, buzlu","price":"105","tags":["yeni"],"image":"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=70"}]},{"id":2,"name":"Tatlılar","items":[{"id":21,"name":"San Sebastian","desc":"Yanık cheesecake, tuzlu karamel","price":"140","tags":["sef"],"image":"https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=70"},{"id":22,"name":"Vegan Brownie","desc":"Çikolatalı, cevizli","price":"110","tags":["vegan","glutensiz"]}]},{"id":3,"name":"Atıştırmalıklar","items":[{"id":31,"name":"Avokado Tost","desc":"Ekşi maya ekmek, kiraz domates, acı sos","price":"160","tags":["aci"],"image":"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=70"}]},{"id":4,"name":"Sıcak İçecekler","items":[{"id":41,"name":"Latte","desc":"Kadifemsi süt köpüğü, tek shot","price":"90","tags":[]},{"id":42,"name":"Cappuccino","desc":"Eşit parça espresso ve süt köpüğü","price":"90","tags":[]},{"id":43,"name":"Türk Kahvesi","desc":"Közde, lokum ile","price":"70","tags":["sef"]},{"id":44,"name":"Sıcak Çikolata","desc":"Belçika çikolatası, krema","price":"100","tags":["yeni"]},{"id":45,"name":"Bitki Çayı","desc":"Ihlamur, adaçayı veya papatya","price":"65","tags":["vegan"]}]},{"id":5,"name":"Soğuk İçecekler","items":[{"id":51,"name":"Buzlu Latte","desc":"Buz, süt, çift shot","price":"100","tags":[]},{"id":52,"name":"Ev Yapımı Limonata","desc":"Taze nane, buz","price":"85","tags":["vegan"]},{"id":53,"name":"Frappe","desc":"Karamel veya vanilya","price":"110","tags":["yeni"]}]},{"id":6,"name":"Sandviç & Tostlar","items":[{"id":61,"name":"Kaşarlı Tost","desc":"Ekşi maya, eritilmiş kaşar","price":"120","tags":[]},{"id":62,"name":"Hindi Füme Sandviç","desc":"Cheddar, marul, hardal sos","price":"150","tags":[]},{"id":63,"name":"Mozzarella Pesto","desc":"Kurutulmuş domates, fesleğen","price":"155","tags":["sef"]}]}]',
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
    menu = '[{"id":1,"name":"Başlangıçlar","items":[{"id":11,"name":"Humus","desc":"Nohut, tahin, zeytinyağı, kimyon","price":"120","tags":["vegan"],"image":"https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=400&q=70"},{"id":12,"name":"Haydari","desc":"Süzme yoğurt, ceviz, taze nane","price":"110","tags":[],"image":"https://images.unsplash.com/photo-1777199264017-84af9308a41f?w=400&q=70"},{"id":13,"name":"Sigara Böreği","desc":"El açması yufka, beyaz peynir","price":"130","tags":["sef"],"image":"https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=70"}]},{"id":2,"name":"Izgara","items":[{"id":21,"name":"Adana Kebap","desc":"Zırh kıyma, közlenmiş biber ve domates","price":"320","tags":["aci","sef"],"image":"https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=70"},{"id":22,"name":"Kuzu Pirzola","desc":"Köz patlıcan püresi ile","price":"480","tags":[],"image":"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=70"},{"id":23,"name":"Çöp Şiş","desc":"Küçük kuşbaşı kuzu, közde","price":"340","tags":["yeni"],"image":"https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=70"}]},{"id":3,"name":"Tatlı","items":[{"id":31,"name":"Künefe","desc":"Antep fıstığı, kaymak","price":"180","tags":["sef"],"image":"https://images.unsplash.com/photo-1778447812923-88a9e3e6b567?w=400&q=70"}]},{"id":4,"name":"Ana Yemekler","items":[{"id":41,"name":"Hünkar Beğendi","desc":"Kuzu eti, közlenmiş patlıcan püresi","price":"360","tags":["sef"]},{"id":42,"name":"Karışık Izgara","desc":"Kuzu şiş, tavuk, köfte, pilav","price":"520","tags":[]},{"id":43,"name":"Tavuk Şiş","desc":"Marine edilmiş, bulgur pilavı","price":"280","tags":[]},{"id":44,"name":"Mantı","desc":"El açması, sarımsaklı yoğurt, tereyağlı sos","price":"240","tags":["aci"]}]},{"id":5,"name":"Salatalar","items":[{"id":51,"name":"Çoban Salata","desc":"Domates, salatalık, biber, soğan","price":"110","tags":["vegan","glutensiz"]},{"id":52,"name":"Gavurdağı","desc":"Ceviz, nar ekşisi, taze nane","price":"140","tags":["vegan"]},{"id":53,"name":"Roka Peynir","desc":"Parmesan, kiraz domates","price":"150","tags":[]}]},{"id":6,"name":"İçecekler","items":[{"id":61,"name":"Ayran","desc":"Köpüklü, bakır kupada","price":"50","tags":[]},{"id":62,"name":"Şalgam","desc":"Acılı veya acısız","price":"55","tags":["aci"]},{"id":63,"name":"Türk Çayı","desc":"İnce belli bardakta","price":"30","tags":[]},{"id":64,"name":"Maden Suyu","desc":"Taze sıkım limonla","price":"45","tags":[]}]}]',
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
    menu = '[{"id":1,"name":"İmza Kokteyller","items":[{"id":11,"name":"Duman & Bal","desc":"İsli viski, bal, limon, ardıç","price":"420","tags":["sef"],"image":"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=70"},{"id":12,"name":"Bahçe Sour","desc":"Cin, taze salatalık, fesleğen","price":"380","tags":["yeni"],"image":"https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=70"},{"id":13,"name":"Acı Paloma","desc":"Tekila, greyfurt, jalapeño","price":"390","tags":["aci"],"image":"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=70"}]},{"id":2,"name":"Kadeh Şarap","items":[{"id":21,"name":"Narince","desc":"Tokat, beyaz, kuru kayısı notaları","price":"260","tags":[],"image":"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=70"},{"id":22,"name":"Öküzgözü","desc":"Elazığ, kırmızı, olgun kiraz","price":"280","tags":[]}]},{"id":3,"name":"Atıştırma","items":[{"id":31,"name":"Peynir Tabağı","desc":"Yerel peynirler, bal, ceviz","price":"320","tags":["sef"],"image":"https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=70"},{"id":32,"name":"Baharatlı Badem","desc":"Ev usulü kavrulmuş","price":"90","tags":["vegan","aci"]}]},{"id":4,"name":"Bira","items":[{"id":41,"name":"Fıçı Bira (40cl)","desc":"Pale ale, taze çekilmiş","price":"180","tags":[]},{"id":42,"name":"Craft IPA","desc":"Yerel butik üretim, şişe","price":"210","tags":["yeni"]},{"id":43,"name":"Buğday Birası","desc":"Portakal kabuğu, hafif","price":"190","tags":[]}]},{"id":5,"name":"Viski & Rom","items":[{"id":51,"name":"Single Malt (4cl)","desc":"12 yıllık, İskoç","price":"420","tags":["sef"]},{"id":52,"name":"Bourbon (4cl)","desc":"Meşe fıçı, vanilya","price":"340","tags":[]},{"id":53,"name":"Koyu Rom (4cl)","desc":"Karamel ve baharat notaları","price":"310","tags":[]}]},{"id":6,"name":"Alkolsüz","items":[{"id":61,"name":"Bahçe Mocktail","desc":"Salatalık, nane, tonik","price":"190","tags":["vegan","yeni"]},{"id":62,"name":"Zencefilli Soda","desc":"Ev yapımı şurup","price":"150","tags":["vegan"]},{"id":63,"name":"Tonik Gazoz","desc":"Limon dilimi, buz","price":"90","tags":[]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-brunch
  select id into v_user_id from auth.users where email = 'demo-brunch@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-brunch@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Brunch Sokak',
    subtitle = 'Modern kahvaltı, özel burgerler ve taze sıkım',
    theme = 'modern',
    currency = '₺',
    menu = '[{"id":1,"name":"Kahvaltı Tabakları","items":[{"id":11,"name":"Serpme Kahvaltı","desc":"Peynir çeşitleri, zeytin, reçel, tereyağı, demlik çay","price":"280","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/11.png"},{"id":12,"name":"Avokadolu Yumurta","desc":"Ekşi maya ekmek, poşe yumurta, acı yağ","price":"165","tags":["yeni"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/12.png"},{"id":13,"name":"Simit Waffle","desc":"Susamlı waffle, labne, bal","price":"145","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/13.png"}]},{"id":2,"name":"Burgerler","items":[{"id":21,"name":"Smash Burger","desc":"Double patty, cheddar, özel sos","price":"210","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/21.png"},{"id":22,"name":"Tavuklu Burger","desc":"Çıtır tavuk, turşu, acı mayonez","price":"190","tags":["aci"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/22.png"},{"id":23,"name":"Vegan Burger","desc":"Nohut köftesi, avokado, marul","price":"175","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/23.png"}]},{"id":3,"name":"İçecekler","items":[{"id":31,"name":"Taze Sıkım Portakal","desc":"Günlük sıkım","price":"90","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/31.png"},{"id":32,"name":"Cold Brew","desc":"18 saat demlenmiş","price":"95","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/32.png"}]},{"id":4,"name":"Salata & Bowl","items":[{"id":41,"name":"Sezar Salata","desc":"Çıtır tavuk, parmesan, kruton","price":"185","tags":[]},{"id":42,"name":"Quinoa Bowl","desc":"Avokado, edamame, tahin sos","price":"195","tags":["vegan","glutensiz"]},{"id":43,"name":"Halloumi Salata","desc":"Izgara hellim, nar, roka","price":"180","tags":["yeni"]}]},{"id":5,"name":"Tatlılar","items":[{"id":51,"name":"Pancake Üçlüsü","desc":"Akçaağaç şurubu, mevsim meyveleri","price":"160","tags":["sef"]},{"id":52,"name":"French Toast","desc":"Vanilya kreması, çilek","price":"155","tags":[]},{"id":53,"name":"Cookie","desc":"Sıcak servis, vanilyalı dondurma","price":"120","tags":["yeni"]}]},{"id":6,"name":"Yan Lezzetler","items":[{"id":61,"name":"Patates Kızartması","desc":"Baharatlı, ev yapımı sos ile","price":"80","tags":["vegan"]},{"id":62,"name":"Soğan Halkası","desc":"Çıtır, acı mayonez","price":"85","tags":["aci"]},{"id":63,"name":"Mevsim Meyve Tabağı","desc":"Günlük taze","price":"110","tags":["vegan","glutensiz"]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-vegan
  select id into v_user_id from auth.users where email = 'demo-vegan@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-vegan@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Kök',
    subtitle = 'Bitki bazlı, mevsimlik ve doğal',
    theme = 'bahce',
    currency = '₺',
    menu = '[{"id":1,"name":"Buddha Bowl''lar","items":[{"id":11,"name":"Falafel Bowl","desc":"Nohut falafeli, humus, tahin sos, kinoa","price":"175","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/11.png"},{"id":12,"name":"Tempeh Bowl","desc":"Marine tempeh, kavrulmuş sebze, esmer pirinç","price":"185","tags":["vegan","glutensiz"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/12.png"}]},{"id":2,"name":"Ana Yemekler","items":[{"id":21,"name":"Mantar Risotto","desc":"Kremalı arborio pirinç, kekik","price":"210","tags":["sef","glutensiz"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/21.png"},{"id":22,"name":"Sebzeli Curry","desc":"Nohut, ıspanak, hindistan cevizi sütü","price":"190","tags":["aci","vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/22.png"}]},{"id":3,"name":"Smoothie & İçecek","items":[{"id":31,"name":"Yeşil Detoks","desc":"Ispanak, elma, zencefil, limon","price":"110","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/31.png"},{"id":32,"name":"Kırmızı Meyve Smoothie","desc":"Yaban mersini, çilek, badem sütü","price":"115","tags":["vegan","yeni"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/32.png"}]},{"id":4,"name":"Çorbalar","items":[{"id":41,"name":"Mercimek Çorbası","desc":"Limon, kırmızı biber","price":"85","tags":["vegan"]},{"id":42,"name":"Kabak Çorbası","desc":"Hindistan cevizi sütü, tohum","price":"95","tags":["vegan","glutensiz"]},{"id":43,"name":"Domates Çorbası","desc":"Fesleğen yağı, kızarmış ekmek","price":"90","tags":["vegan"]}]},{"id":5,"name":"Tatlılar","items":[{"id":51,"name":"Çiya Pudingi","desc":"Badem sütü, mevsim meyvesi","price":"105","tags":["vegan","glutensiz"]},{"id":52,"name":"Ham Cheesecake","desc":"Kaju, limon, yaban mersini","price":"135","tags":["vegan","sef"]},{"id":53,"name":"Hurmalı Top","desc":"Fındık, kakao, hindistan cevizi","price":"75","tags":["vegan","glutensiz"]}]},{"id":6,"name":"Sıcak İçecekler","items":[{"id":61,"name":"Matcha Latte","desc":"Yulaf sütü","price":"115","tags":["vegan","yeni"]},{"id":62,"name":"Zerdeçallı Latte","desc":"Badem sütü, tarçın","price":"105","tags":["vegan"]},{"id":63,"name":"Bitki Çayı","desc":"Günün karışımı","price":"60","tags":["vegan"]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-balik
  select id into v_user_id from auth.users where email = 'demo-balik@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-balik@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Liman',
    subtitle = 'Günlük av, ızgara ve meze',
    theme = 'deniz',
    currency = '₺',
    menu = '[{"id":1,"name":"Meze","items":[{"id":11,"name":"Deniz Börülcesi","desc":"Zeytinyağlı, sarımsaklı","price":"130","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/11.png"},{"id":12,"name":"Kalamar Tava","desc":"Çıtır kalamar, tartar sos","price":"220","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/12.png"},{"id":13,"name":"Midye Dolma","desc":"20 adet, limonlu","price":"180","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/13.png"}]},{"id":2,"name":"Balıklar","items":[{"id":21,"name":"Levrek Izgara","desc":"Günlük av, roka salatası ile","price":"380","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/21.png"},{"id":22,"name":"Çupra Buğulama","desc":"Sebzeli, zeytinyağlı","price":"360","tags":["glutensiz"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/22.png"},{"id":23,"name":"Karides Güveç","desc":"Tereyağlı domates sos, kaşar","price":"340","tags":["yeni"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/23.png"}]},{"id":3,"name":"İçecek","items":[{"id":31,"name":"Rakı (35cl)","desc":"Yeşil şişe","price":"450","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/31.png"},{"id":32,"name":"Beyaz Şarap Kadeh","desc":"Sarıgevrek, taze","price":"240","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/32.png"}]},{"id":4,"name":"Sıcak Başlangıçlar","items":[{"id":41,"name":"Karides Tava","desc":"Tereyağı, sarımsak","price":"290","tags":[]},{"id":42,"name":"Ahtapot Izgara","desc":"Zeytinyağı, limon","price":"340","tags":["sef"]},{"id":43,"name":"Balık Çorbası","desc":"Günlük balık, limon","price":"160","tags":[]}]},{"id":5,"name":"Salatalar","items":[{"id":51,"name":"Roka Salata","desc":"Parmesan, nar ekşisi","price":"120","tags":["vegan"]},{"id":52,"name":"Akdeniz Salata","desc":"Zeytin, domates, salatalık","price":"115","tags":["vegan","glutensiz"]},{"id":53,"name":"Deniz Mahsulleri Salatası","desc":"Karides, kalamar, midye","price":"260","tags":["yeni"]}]},{"id":6,"name":"Tatlı","items":[{"id":61,"name":"Ayva Tatlısı","desc":"Kaymak, ceviz","price":"150","tags":["sef"]},{"id":62,"name":"Revani","desc":"Şerbetli, dondurma","price":"130","tags":[]},{"id":63,"name":"Mevsim Meyve","desc":"Günün seçimi","price":"120","tags":["vegan","glutensiz"]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-kafe-3d (3D coverflow düzeni)
  select id into v_user_id from auth.users where email = 'demo-kafe-3d@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-kafe-3d@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Kahve Durağı',
    subtitle = 'Üçüncü nesil kahve & ev yapımı tatlılar',
    theme = 'kafe',
    currency = '₺',
    layout = 'coverflow',
    menu = '[{"id":1,"name":"Kahveler","items":[{"id":11,"name":"Flat White","desc":"Çift shot espresso, kadifemsi süt","price":"95","tags":["sef"],"image":"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=70"},{"id":12,"name":"Filtre Kahve","desc":"Günün çekirdeği, V60","price":"80","tags":[],"image":"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70"},{"id":13,"name":"Soğuk Demleme","desc":"18 saat demlenmiş, buzlu","price":"105","tags":["yeni"],"image":"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=70"}]},{"id":2,"name":"Tatlılar","items":[{"id":21,"name":"San Sebastian","desc":"Yanık cheesecake, tuzlu karamel","price":"140","tags":["sef"],"image":"https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=70"},{"id":22,"name":"Vegan Brownie","desc":"Çikolatalı, cevizli","price":"110","tags":["vegan","glutensiz"]}]},{"id":3,"name":"Atıştırmalıklar","items":[{"id":31,"name":"Avokado Tost","desc":"Ekşi maya ekmek, kiraz domates, acı sos","price":"160","tags":["aci"],"image":"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=70"}]},{"id":4,"name":"Sıcak İçecekler","items":[{"id":41,"name":"Latte","desc":"Kadifemsi süt köpüğü, tek shot","price":"90","tags":[]},{"id":42,"name":"Cappuccino","desc":"Eşit parça espresso ve süt köpüğü","price":"90","tags":[]},{"id":43,"name":"Türk Kahvesi","desc":"Közde, lokum ile","price":"70","tags":["sef"]},{"id":44,"name":"Sıcak Çikolata","desc":"Belçika çikolatası, krema","price":"100","tags":["yeni"]},{"id":45,"name":"Bitki Çayı","desc":"Ihlamur, adaçayı veya papatya","price":"65","tags":["vegan"]}]},{"id":5,"name":"Soğuk İçecekler","items":[{"id":51,"name":"Buzlu Latte","desc":"Buz, süt, çift shot","price":"100","tags":[]},{"id":52,"name":"Ev Yapımı Limonata","desc":"Taze nane, buz","price":"85","tags":["vegan"]},{"id":53,"name":"Frappe","desc":"Karamel veya vanilya","price":"110","tags":["yeni"]}]},{"id":6,"name":"Sandviç & Tostlar","items":[{"id":61,"name":"Kaşarlı Tost","desc":"Ekşi maya, eritilmiş kaşar","price":"120","tags":[]},{"id":62,"name":"Hindi Füme Sandviç","desc":"Cheddar, marul, hardal sos","price":"150","tags":[]},{"id":63,"name":"Mozzarella Pesto","desc":"Kurutulmuş domates, fesleğen","price":"155","tags":["sef"]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-restoran-3d (3D coverflow düzeni)
  select id into v_user_id from auth.users where email = 'demo-restoran-3d@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-restoran-3d@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Meze & Mangal',
    subtitle = 'Ege mezeleri ve odun ateşinde ızgara',
    theme = 'klasik',
    currency = '₺',
    layout = 'coverflow',
    menu = '[{"id":1,"name":"Başlangıçlar","items":[{"id":11,"name":"Humus","desc":"Nohut, tahin, zeytinyağı, kimyon","price":"120","tags":["vegan"],"image":"https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=400&q=70"},{"id":12,"name":"Haydari","desc":"Süzme yoğurt, ceviz, taze nane","price":"110","tags":[],"image":"https://images.unsplash.com/photo-1777199264017-84af9308a41f?w=400&q=70"},{"id":13,"name":"Sigara Böreği","desc":"El açması yufka, beyaz peynir","price":"130","tags":["sef"],"image":"https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=70"}]},{"id":2,"name":"Izgara","items":[{"id":21,"name":"Adana Kebap","desc":"Zırh kıyma, közlenmiş biber ve domates","price":"320","tags":["aci","sef"],"image":"https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=70"},{"id":22,"name":"Kuzu Pirzola","desc":"Köz patlıcan püresi ile","price":"480","tags":[],"image":"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=70"},{"id":23,"name":"Çöp Şiş","desc":"Küçük kuşbaşı kuzu, közde","price":"340","tags":["yeni"],"image":"https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=70"}]},{"id":3,"name":"Tatlı","items":[{"id":31,"name":"Künefe","desc":"Antep fıstığı, kaymak","price":"180","tags":["sef"],"image":"https://images.unsplash.com/photo-1778447812923-88a9e3e6b567?w=400&q=70"}]},{"id":4,"name":"Ana Yemekler","items":[{"id":41,"name":"Hünkar Beğendi","desc":"Kuzu eti, közlenmiş patlıcan püresi","price":"360","tags":["sef"]},{"id":42,"name":"Karışık Izgara","desc":"Kuzu şiş, tavuk, köfte, pilav","price":"520","tags":[]},{"id":43,"name":"Tavuk Şiş","desc":"Marine edilmiş, bulgur pilavı","price":"280","tags":[]},{"id":44,"name":"Mantı","desc":"El açması, sarımsaklı yoğurt, tereyağlı sos","price":"240","tags":["aci"]}]},{"id":5,"name":"Salatalar","items":[{"id":51,"name":"Çoban Salata","desc":"Domates, salatalık, biber, soğan","price":"110","tags":["vegan","glutensiz"]},{"id":52,"name":"Gavurdağı","desc":"Ceviz, nar ekşisi, taze nane","price":"140","tags":["vegan"]},{"id":53,"name":"Roka Peynir","desc":"Parmesan, kiraz domates","price":"150","tags":[]}]},{"id":6,"name":"İçecekler","items":[{"id":61,"name":"Ayran","desc":"Köpüklü, bakır kupada","price":"50","tags":[]},{"id":62,"name":"Şalgam","desc":"Acılı veya acısız","price":"55","tags":["aci"]},{"id":63,"name":"Türk Çayı","desc":"İnce belli bardakta","price":"30","tags":[]},{"id":64,"name":"Maden Suyu","desc":"Taze sıkım limonla","price":"45","tags":[]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-bar-3d (3D coverflow düzeni)
  select id into v_user_id from auth.users where email = 'demo-bar-3d@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-bar-3d@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Gece Vardiyası',
    subtitle = 'İmza kokteyller ve kadeh şarap',
    theme = 'gece',
    currency = '₺',
    layout = 'coverflow',
    menu = '[{"id":1,"name":"İmza Kokteyller","items":[{"id":11,"name":"Duman & Bal","desc":"İsli viski, bal, limon, ardıç","price":"420","tags":["sef"],"image":"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=70"},{"id":12,"name":"Bahçe Sour","desc":"Cin, taze salatalık, fesleğen","price":"380","tags":["yeni"],"image":"https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=70"},{"id":13,"name":"Acı Paloma","desc":"Tekila, greyfurt, jalapeño","price":"390","tags":["aci"],"image":"https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=70"}]},{"id":2,"name":"Kadeh Şarap","items":[{"id":21,"name":"Narince","desc":"Tokat, beyaz, kuru kayısı notaları","price":"260","tags":[],"image":"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=70"},{"id":22,"name":"Öküzgözü","desc":"Elazığ, kırmızı, olgun kiraz","price":"280","tags":[]}]},{"id":3,"name":"Atıştırma","items":[{"id":31,"name":"Peynir Tabağı","desc":"Yerel peynirler, bal, ceviz","price":"320","tags":["sef"],"image":"https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=70"},{"id":32,"name":"Baharatlı Badem","desc":"Ev usulü kavrulmuş","price":"90","tags":["vegan","aci"]}]},{"id":4,"name":"Bira","items":[{"id":41,"name":"Fıçı Bira (40cl)","desc":"Pale ale, taze çekilmiş","price":"180","tags":[]},{"id":42,"name":"Craft IPA","desc":"Yerel butik üretim, şişe","price":"210","tags":["yeni"]},{"id":43,"name":"Buğday Birası","desc":"Portakal kabuğu, hafif","price":"190","tags":[]}]},{"id":5,"name":"Viski & Rom","items":[{"id":51,"name":"Single Malt (4cl)","desc":"12 yıllık, İskoç","price":"420","tags":["sef"]},{"id":52,"name":"Bourbon (4cl)","desc":"Meşe fıçı, vanilya","price":"340","tags":[]},{"id":53,"name":"Koyu Rom (4cl)","desc":"Karamel ve baharat notaları","price":"310","tags":[]}]},{"id":6,"name":"Alkolsüz","items":[{"id":61,"name":"Bahçe Mocktail","desc":"Salatalık, nane, tonik","price":"190","tags":["vegan","yeni"]},{"id":62,"name":"Zencefilli Soda","desc":"Ev yapımı şurup","price":"150","tags":["vegan"]},{"id":63,"name":"Tonik Gazoz","desc":"Limon dilimi, buz","price":"90","tags":[]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-brunch-3d (3D coverflow düzeni)
  select id into v_user_id from auth.users where email = 'demo-brunch-3d@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-brunch-3d@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Brunch Sokak',
    subtitle = 'Modern kahvaltı, özel burgerler ve taze sıkım',
    theme = 'modern',
    currency = '₺',
    layout = 'coverflow',
    menu = '[{"id":1,"name":"Kahvaltı Tabakları","items":[{"id":11,"name":"Serpme Kahvaltı","desc":"Peynir çeşitleri, zeytin, reçel, tereyağı, demlik çay","price":"280","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/11.png"},{"id":12,"name":"Avokadolu Yumurta","desc":"Ekşi maya ekmek, poşe yumurta, acı yağ","price":"165","tags":["yeni"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/12.png"},{"id":13,"name":"Simit Waffle","desc":"Susamlı waffle, labne, bal","price":"145","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/13.png"}]},{"id":2,"name":"Burgerler","items":[{"id":21,"name":"Smash Burger","desc":"Double patty, cheddar, özel sos","price":"210","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/21.png"},{"id":22,"name":"Tavuklu Burger","desc":"Çıtır tavuk, turşu, acı mayonez","price":"190","tags":["aci"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/22.png"},{"id":23,"name":"Vegan Burger","desc":"Nohut köftesi, avokado, marul","price":"175","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/23.png"}]},{"id":3,"name":"İçecekler","items":[{"id":31,"name":"Taze Sıkım Portakal","desc":"Günlük sıkım","price":"90","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/31.png"},{"id":32,"name":"Cold Brew","desc":"18 saat demlenmiş","price":"95","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-brunch/32.png"}]},{"id":4,"name":"Salata & Bowl","items":[{"id":41,"name":"Sezar Salata","desc":"Çıtır tavuk, parmesan, kruton","price":"185","tags":[]},{"id":42,"name":"Quinoa Bowl","desc":"Avokado, edamame, tahin sos","price":"195","tags":["vegan","glutensiz"]},{"id":43,"name":"Halloumi Salata","desc":"Izgara hellim, nar, roka","price":"180","tags":["yeni"]}]},{"id":5,"name":"Tatlılar","items":[{"id":51,"name":"Pancake Üçlüsü","desc":"Akçaağaç şurubu, mevsim meyveleri","price":"160","tags":["sef"]},{"id":52,"name":"French Toast","desc":"Vanilya kreması, çilek","price":"155","tags":[]},{"id":53,"name":"Cookie","desc":"Sıcak servis, vanilyalı dondurma","price":"120","tags":["yeni"]}]},{"id":6,"name":"Yan Lezzetler","items":[{"id":61,"name":"Patates Kızartması","desc":"Baharatlı, ev yapımı sos ile","price":"80","tags":["vegan"]},{"id":62,"name":"Soğan Halkası","desc":"Çıtır, acı mayonez","price":"85","tags":["aci"]},{"id":63,"name":"Mevsim Meyve Tabağı","desc":"Günlük taze","price":"110","tags":["vegan","glutensiz"]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-vegan-3d (3D coverflow düzeni)
  select id into v_user_id from auth.users where email = 'demo-vegan-3d@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-vegan-3d@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Kök',
    subtitle = 'Bitki bazlı, mevsimlik ve doğal',
    theme = 'bahce',
    currency = '₺',
    layout = 'coverflow',
    menu = '[{"id":1,"name":"Buddha Bowl''lar","items":[{"id":11,"name":"Falafel Bowl","desc":"Nohut falafeli, humus, tahin sos, kinoa","price":"175","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/11.png"},{"id":12,"name":"Tempeh Bowl","desc":"Marine tempeh, kavrulmuş sebze, esmer pirinç","price":"185","tags":["vegan","glutensiz"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/12.png"}]},{"id":2,"name":"Ana Yemekler","items":[{"id":21,"name":"Mantar Risotto","desc":"Kremalı arborio pirinç, kekik","price":"210","tags":["sef","glutensiz"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/21.png"},{"id":22,"name":"Sebzeli Curry","desc":"Nohut, ıspanak, hindistan cevizi sütü","price":"190","tags":["aci","vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/22.png"}]},{"id":3,"name":"Smoothie & İçecek","items":[{"id":31,"name":"Yeşil Detoks","desc":"Ispanak, elma, zencefil, limon","price":"110","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/31.png"},{"id":32,"name":"Kırmızı Meyve Smoothie","desc":"Yaban mersini, çilek, badem sütü","price":"115","tags":["vegan","yeni"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-vegan/32.png"}]},{"id":4,"name":"Çorbalar","items":[{"id":41,"name":"Mercimek Çorbası","desc":"Limon, kırmızı biber","price":"85","tags":["vegan"]},{"id":42,"name":"Kabak Çorbası","desc":"Hindistan cevizi sütü, tohum","price":"95","tags":["vegan","glutensiz"]},{"id":43,"name":"Domates Çorbası","desc":"Fesleğen yağı, kızarmış ekmek","price":"90","tags":["vegan"]}]},{"id":5,"name":"Tatlılar","items":[{"id":51,"name":"Çiya Pudingi","desc":"Badem sütü, mevsim meyvesi","price":"105","tags":["vegan","glutensiz"]},{"id":52,"name":"Ham Cheesecake","desc":"Kaju, limon, yaban mersini","price":"135","tags":["vegan","sef"]},{"id":53,"name":"Hurmalı Top","desc":"Fındık, kakao, hindistan cevizi","price":"75","tags":["vegan","glutensiz"]}]},{"id":6,"name":"Sıcak İçecekler","items":[{"id":61,"name":"Matcha Latte","desc":"Yulaf sütü","price":"115","tags":["vegan","yeni"]},{"id":62,"name":"Zerdeçallı Latte","desc":"Badem sütü, tarçın","price":"105","tags":["vegan"]},{"id":63,"name":"Bitki Çayı","desc":"Günün karışımı","price":"60","tags":["vegan"]}]}]',
    published = true
  where user_id = v_user_id;

  -- demo-balik-3d (3D coverflow düzeni)
  select id into v_user_id from auth.users where email = 'demo-balik-3d@demo.siriusmenu.internal';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo-balik-3d@demo.siriusmenu.internal', crypt(gen_random_uuid()::text, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  end if;

  update public.restaurants set
    name = 'Liman',
    subtitle = 'Günlük av, ızgara ve meze',
    theme = 'deniz',
    currency = '₺',
    layout = 'coverflow',
    menu = '[{"id":1,"name":"Meze","items":[{"id":11,"name":"Deniz Börülcesi","desc":"Zeytinyağlı, sarımsaklı","price":"130","tags":["vegan"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/11.png"},{"id":12,"name":"Kalamar Tava","desc":"Çıtır kalamar, tartar sos","price":"220","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/12.png"},{"id":13,"name":"Midye Dolma","desc":"20 adet, limonlu","price":"180","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/13.png"}]},{"id":2,"name":"Balıklar","items":[{"id":21,"name":"Levrek Izgara","desc":"Günlük av, roka salatası ile","price":"380","tags":["sef"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/21.png"},{"id":22,"name":"Çupra Buğulama","desc":"Sebzeli, zeytinyağlı","price":"360","tags":["glutensiz"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/22.png"},{"id":23,"name":"Karides Güveç","desc":"Tereyağlı domates sos, kaşar","price":"340","tags":["yeni"],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/23.png"}]},{"id":3,"name":"İçecek","items":[{"id":31,"name":"Rakı (35cl)","desc":"Yeşil şişe","price":"450","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/31.png"},{"id":32,"name":"Beyaz Şarap Kadeh","desc":"Sarıgevrek, taze","price":"240","tags":[],"image":"https://gyoxbzrrldmllbrltbbb.supabase.co/storage/v1/object/public/menu-photos/demo-assets/demo-balik/32.png"}]},{"id":4,"name":"Sıcak Başlangıçlar","items":[{"id":41,"name":"Karides Tava","desc":"Tereyağı, sarımsak","price":"290","tags":[]},{"id":42,"name":"Ahtapot Izgara","desc":"Zeytinyağı, limon","price":"340","tags":["sef"]},{"id":43,"name":"Balık Çorbası","desc":"Günlük balık, limon","price":"160","tags":[]}]},{"id":5,"name":"Salatalar","items":[{"id":51,"name":"Roka Salata","desc":"Parmesan, nar ekşisi","price":"120","tags":["vegan"]},{"id":52,"name":"Akdeniz Salata","desc":"Zeytin, domates, salatalık","price":"115","tags":["vegan","glutensiz"]},{"id":53,"name":"Deniz Mahsulleri Salatası","desc":"Karides, kalamar, midye","price":"260","tags":["yeni"]}]},{"id":6,"name":"Tatlı","items":[{"id":61,"name":"Ayva Tatlısı","desc":"Kaymak, ceviz","price":"150","tags":["sef"]},{"id":62,"name":"Revani","desc":"Şerbetli, dondurma","price":"130","tags":[]},{"id":63,"name":"Mevsim Meyve","desc":"Günün seçimi","price":"120","tags":["vegan","glutensiz"]}]}]',
    published = true
  where user_id = v_user_id;
end $$;
