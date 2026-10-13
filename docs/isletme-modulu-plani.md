# İşletme modülü planı (2. aşama)

Durum: planlama. Önce SiriusMenu QR menü ilk haliyle tamamlanır, Evolution API kurulur, geliştirme lokalde yapılır.

## Paketler

| Paket | Fiyat | İçerik |
|---|---|---|
| QR Menü | 500 TL/ay | Mevcut QR menü, WhatsApp ile güncelleme, fotoğraftan menü aktarma |
| İşletme | 999 TL/ay | QR Menü + masa siparişi, kasa, gelir/gider, iade, stok, raporlar |

Not: CLAUDE.md'deki "999 TL altına inilmez" kuralı bu karardan öncedir. PRICING değişirken güncellenmeli.

## Kapsam dışı

- Gerçek ödeme altyapısı yok. Ödemeyi işletme kendi alır; sistemde "ödendi" ve ödeme türü (nakit, kart, havale) kaydedilir.
- POS entegrasyonu ilk sürümde yok. Gün sonunda POS z raporu ile sistem toplamı karşılaştırma ekranı eklenir.
- Sistem mali cihaz değildir. Çıktılar "bilgi fişi"dir; yazarkasa / e-arşiv yerine geçmez.

## Modüller

1. Sipariş: masa numaralı QR (`?t=5`), sepet, durum takibi, sesli bildirim, garson çağır / hesap iste.
2. Kasa: gün açılış/kapanış, nakit/kart/havale ayrımı, gün sonu farkı.
3. Gelir/gider: satışlar otomatik gelir, giderler elle.
4. İade/iptal: neden, kim yaptı, tutar, stoka geri ekleme seçeneği, yetki kontrolü.
5. Stok: ürün stoğu, reçete bazlı düşüm, kritik stok uyarısı.
6. Raporlar: ciro, en çok satan, saat yoğunluğu, iade oranı, kâr.
7. WhatsApp/AI: günlük özet, "bugün ciro ne?" gibi sorular.

## Çevrimdışı çalışma

- PWA + service worker; sipariş, ödeme kaydı, gider ve stok hareketleri yerel kuyrukta (IndexedDB) tutulur.
- Bağlantı gelince sunucuya senkronlanır. İstemci tarafında üretilen UUID ile çift kayıt önlenir.
- Çakışma kuralı: kayıtlar eklemeli (append-only) tutulur, düzeltmeler yeni hareket olarak yazılır.

## Veri modeli (taslak)

`orders` (source: table | phone | yemeksepeti | trendyol | getir), `order_items`, `payments`, `cash_sessions`, `expenses`, `refunds`, `stock_items`, `stock_movements`. Hepsi `restaurant_id` ile bağlı, RLS ile izole.

## Platform siparişleri

İlk sürümde elle giriş: kaynak, tutar, komisyon oranı. Net gelir = tutar - komisyon; "platformdan alacak" olarak izlenir. Otomatik API entegrasyonu partner onayı netleşince eklenir.

## Faz sırası

1. Evolution API kurulumu, QR menünün ilk haliyle tamamlanması.
2. Sipariş + garson çağır.
3. Kasa ve gelir.
4. İade ve gider.
5. Stok ve reçete.
6. WhatsApp/AI özetleri.
7. POS entegrasyonu (tek marka pilot).
