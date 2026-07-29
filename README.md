# Karemenü: QR ile dijital menü

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

## Notlar
- Yeni tema `THEMES`, etiketler `TAGS`, para birimleri `CURRENCIES` (menu.tsx) içinde.
- Gerçek kullanımda menüyü canlıya aldıktan sonra QR'ı bir kez basman yeterli; içeriği güncellesen de QR aynı kalır.
