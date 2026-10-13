-- Abonelik pasifken tek seferlik ücretli düzenleme erişimi penceresi (bkz. PRICING.editUnlock).
-- Yayında kalan menü aboneliksiz de ücretsiz görüntülenmeye devam eder (bilinçli tasarım);
-- bu alan sadece panelden İÇERİK DÜZENLEMEYİ pasif abonelikte geçici olarak yeniden açar.

alter table public.restaurants
  add column if not exists edit_unlock_until timestamptz;
