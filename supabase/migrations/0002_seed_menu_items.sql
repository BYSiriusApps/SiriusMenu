-- Bu dosya otomatik uygulanmaz. Supabase Dashboard > SQL Editor içine yapıştırıp
-- elle çalıştırın (0001_menu_items.sql tablosu daha önce oluşturulmuş olmalı).
--
-- Örnek/başlangıç menüsü — yasal-uyum-rehberi.md §5 şemasındaki tüm zorunlu
-- alanlar (meat_type, calories, ingredients, allergens, contains_alcohol,
-- contains_pork) doldurulmuştur. Gerçek işletme verisiyle değiştirilmeden
-- önce fiyat ve porsiyon bilgileri kontrol edilmelidir.

insert into public.menu_items
  (name, category, price, meat_type, calories, ingredients, allergens, contains_alcohol, contains_pork, image_url, is_published)
values
  ('Mercimek Çorbası', 'Başlangıçlar', 90.00, 'yok', 180,
    array['kırmızı mercimek', 'soğan', 'havuç', 'tereyağı', 'un'],
    array['gluten', 'süt'], false, false, null, true),

  ('Ezogelin Çorbası', 'Başlangıçlar', 90.00, 'yok', 190,
    array['kırmızı mercimek', 'bulgur', 'domates salçası', 'nane', 'pul biber'],
    array['gluten'], false, false, null, true),

  ('Çoban Salata', 'Başlangıçlar', 130.00, 'yok', 120,
    array['domates', 'salatalık', 'soğan', 'biber', 'zeytinyağı'],
    array[]::text[], false, false, null, true),

  ('Adana Kebap', 'Ana Yemek', 320.00, 'kuzu', 650,
    array['kuzu eti', 'kırmızı biber', 'soğan', 'baharat'],
    array['sülfit'], false, false, null, true),

  ('Izgara Tavuk Şiş', 'Ana Yemek', 260.00, 'kanatli', 480,
    array['tavuk göğsü', 'zeytinyağı', 'sarımsak', 'baharat'],
    array[]::text[], false, false, null, true),

  ('Dana Bonfile Izgara', 'Ana Yemek', 480.00, 'dana', 560,
    array['dana bonfile', 'tereyağı', 'sarımsak', 'roka'],
    array['süt'], false, false, null, true),

  ('Karışık Izgara', 'Ana Yemek', 420.00, 'kuzu', 890,
    array['kuzu pirzola', 'dana kuşbaşı', 'tavuk şiş', 'baharat'],
    array['sülfit'], false, false, null, true),

  ('Mantı', 'Ana Yemek', 240.00, 'dana', 620,
    array['un', 'yumurta', 'dana kıyma', 'yoğurt', 'tereyağı', 'nane'],
    array['gluten', 'süt', 'yumurta'], false, false, null, true),

  ('Karnıyarık', 'Ana Yemek', 220.00, 'dana', 540,
    array['patlıcan', 'dana kıyma', 'domates', 'soğan', 'biber'],
    array[]::text[], false, false, null, true),

  ('Mevsim Sebze Izgara (Vegan)', 'Ana Yemek', 190.00, 'yok', 210,
    array['patlıcan', 'kabak', 'biber', 'mantar', 'zeytinyağı'],
    array[]::text[], false, false, null, true),

  ('Künefe', 'Tatlı', 150.00, 'yok', 520,
    array['kadayıf', 'peynir', 'şerbet', 'antep fıstığı'],
    array['süt', 'gluten', 'fındık/kabuklu yemiş'], false, false, null, true),

  ('Sütlaç', 'Tatlı', 110.00, 'yok', 310,
    array['süt', 'pirinç', 'şeker', 'vanilya'],
    array['süt'], false, false, null, true),

  ('Baklava (4 dilim)', 'Tatlı', 180.00, 'yok', 600,
    array['yufka', 'antep fıstığı', 'tereyağı', 'şerbet'],
    array['gluten', 'süt', 'fındık/kabuklu yemiş'], false, false, null, true),

  ('Ayran', 'İçecek', 40.00, 'yok', 70,
    array['yoğurt', 'su', 'tuz'],
    array['süt'], false, false, null, true),

  ('Taze Sıkılmış Portakal Suyu', 'İçecek', 70.00, 'yok', 110,
    array['portakal'],
    array[]::text[], false, false, null, true),

  ('Türk Kahvesi', 'İçecek', 60.00, 'yok', 5,
    array['kahve', 'su'],
    array[]::text[], false, false, null, true),

  ('Kırmızı Şarap (Kadeh)', 'İçecek', 220.00, 'yok', 125,
    array['üzüm'],
    array['sülfit'], true, false, null, true),

  ('Efes Bira', 'İçecek', 160.00, 'yok', 150,
    array['malt', 'şerbetçi otu', 'su'],
    array['gluten'], true, false, null, true);
