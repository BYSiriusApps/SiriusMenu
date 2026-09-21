# SiriusMenu: QR ile dijital menü

Kafe ve restoranlar için QR menü oluşturucu. Kategorileri ve ürünleri gir, şık bir tema seç, QR kodu indir ve masaya koy. Müşteri okutur, menü telefonunda açılır. Fiyat değişince tek yerden güncelle; baskı maliyeti yok, işlem başına ücret yok.

## En kolay yol: Claude Code ile kur ve canlıya al

1. Bu klasörde terminal aç ve `claude` yaz (Claude Code kuruluysa; değilse claude.com/code adresinden indir).
2. Şunu söyle: **"Kuruluma başla"** — Claude sana marka adını, renklerini ve logonu sorar, bütün değişiklikleri kendisi yapar.
3. Bittiğinde **"canlıya al"** de — Claude uygulamayı senin adına internete açar (Vercel, ücretsiz katman yeter).

Kod bilmene gerek yok. Manuel kurulum istersen aşağıdaki adımlar da geçerli.

## Sayfalar
- **`/`** — Satış landing sayfası (canlı telefon menü önizlemesi + fiyatlar).
- **`/app`** — Menü oluşturucu: kategoriler + ürünler + tema → canlı telefon önizleme → QR kodu indir.

## 3 adımda çalıştır
1. `npm install`
2. `npm run dev`
3. Tarayıcıda `http://localhost:3000`

Uygulama **anahtarsız tam çalışır.** "✨ Açıklama" butonu ürün açıklaması yazmana yardım eder; `.env.local` dosyasına `ANTHROPIC_API_KEY=...` eklersen Claude gerçek öneri üretir, eklemezsen hazır demo metni gösterir.

## Nasıl çalışır (teknik)
- Menü verisi ve temalar `app/lib/menu.tsx`; müşteri görünümü `app/lib/MenuView.tsx` (telefon çerçevesi dahil). Tamamı client-side.
- QR kodu `qrcode` paketiyle tarayıcıda üretilir; menü bağlantısına (deploy sonrası kendi alan adın) işaret eder.
- Menü tarayıcıda (localStorage) tutulur. Gerçek dağıtımda menü herkese açık bir URL'de yayınlanır ve QR ona bakar.

## Faz-C: fotoğraf + WhatsApp + fiyatlama
- **Ürün fotoğrafı:** panelde her ürüne fotoğraf yükle, "✨ İyileştir" ile Gemini fotoğrafı menülük hale getirir. Kota `restaurants.image_quota`; aşımda ek paket (Stripe).
- **WhatsApp AI editör:** işletme, `WHATSAPP_BUSINESS_NUMBER`'a "Latte 120 olsun" yazar → menü anında güncellenir. Köprü: kendi barındırdığın Evolution API (`docs/evolution-api-kurulum.md`). Webhook: `/api/whatsapp/webhook`.
- **Fiyatlama:** `app/lib/menu.tsx` `PRICING`. Kurulum (tek seferlik) + aylık/yıllık abonelik + görsel paketi/toplu iyileştirme (tek seferlik). Stripe price id'leri `.env.example`'da.
- **Demo menüler:** `app/lib/demos.ts` (landing showcase + `/ornek`); canlı örnekler `/m/demo-*` için `supabase/seed.sql`. İsteğe bağlı Gemini görselleri: `node scripts/generate-demo-photos.mjs`.
- **Zamanlı işler:** `vercel.json` cron → `/api/cron/process-images` (toplu kuyruk), `/api/cron/reset-quota`.
- **Migration:** `supabase/migrations/0002_images_whatsapp_pricing.sql` (`supabase db reset` ile uygulanır, seed dahil).
- **İş akışı planı (sunum):** `docs/is-akisi-plani.md`.
- **Yasal uyumluluk (KVKK, ticari elektronik ileti, ticari kullanım denetimi):** `docs/yasal-uyumluluk.md`. Kayıt formu (`app/kayit`) Kullanım Şartları + KVKK Aydınlatma Metni için zorunlu, ticari elektronik ileti için ayrı/opsiyonel onay kutucukları içerir; onaylar `supabase/migrations/0005_consents.sql` ile `restaurants` tablosunda saklanır.

## Notlar
- Yeni tema `THEMES`, etiketler `TAGS`, para birimleri `CURRENCIES` (menu.tsx) içinde.
- Gerçek kullanımda menüyü canlıya aldıktan sonra QR'ı bir kez basman yeterli; içeriği güncellesen de QR aynı kalır.
