# SiriusMenu — kişiselleştirme rehberi
Sor: 1) Marka adı (vars. SiriusMenu). 2) Aksan renk (vars. amber #e0891b) → globals.css `--accent`. 3) Fiyatlar (`app/lib/menu.tsx` `PRICING`: kurulum 2500; Temel (sadece QR menü) 500/ay 5000/yıl; Başlangıç 999/ay 9990/yıl; Profesyonel 1499/ay 14990/yıl; ömür boyu menü; anahtar teslim kurulum `PRICING.service`; görsel kotaları/paketleri; landing + panel + ödeme + yasal metinler bunu kullanır — Temel plan 500 TL/ay'ın, Başlangıç 999 TL/ay'ın altına inilmez; WhatsApp ile güncelleme ve AI görsel kotası Temel planda yoktur). 4) Menü temaları / etiketler / para birimleri (isteğe bağlı; app/lib/menu.tsx `THEMES`, `TAGS`, `CURRENCIES`).

## Faz-C özellikleri (görsel + WhatsApp + fiyatlama)
- Ürün fotoğrafı: `Item.image` (menu.tsx), `MenuView` render eder, panelde yükleme + `/api/images/enhance` (Gemini). Kota: `restaurants.image_quota(_used)`.
- WhatsApp AI editör: `/api/whatsapp/webhook` (Evolution API) + `app/lib/menu-ops.ts applyMenuIntent` + `app/lib/gemini.ts parseMenuCommand`. Kurulum: `docs/evolution-api-kurulum.md`.
- Fiyatlama: `/api/stripe/checkout` (interval + product), webhook plan/kota işler. Env: `.env.example`.
- Demo menüler: `app/lib/demos.ts` (landing showcase + `/ornek`) + `supabase/seed.sql` (`/m/demo-*`).
- İş akışı planı (sunum): `docs/is-akisi-plani.md`.
- **Fotoğraftan menü içe aktarma**: panelde "Fotoğraftan menü yükle" → `/api/menu/import-photo` → `app/lib/gemini.ts parseMenuPhoto` (Gemini vision, OCR). Sonuç kullanıcıya düzenlenebilir bir onay listesi olarak gösterilir (`ImportRow`), onaylanınca `PanelBuilder.confirmImport` mevcut menüye ekler. Kota tüketmez, sadece Gemini metin çağrısı.
- **Ürün kodu (SKU)**: her kategori/ürün oluşturulduğunda kalıcı, sıralı bir kod alır (`app/lib/menu.tsx`: `nextCategoryCode`/`nextItemCode`/`backfillCodes`). Kod = 2 haneli kategori sırası + 2 haneli ürün sırası (ör. kategori 01 → ürünler 0101, 0102). `menu` jsonb içinde saklanır, ek migration gerekmez; panelde kategori/ürün başlığında rozet olarak gösterilir, müşteri tarafında (`MenuView`) görünmez.
- **QR yenileme (güvenlik)**: `restaurants.qr_token` (migration 0004) rastgele hex değer. Basılı QR görseli `/m/{slug}?k={qr_token}` kodlar; panelde "QR'ı yenile" → `/api/qr/rotate` yeni token üretir, eski basılı QR'lar `k` uyuşmazlığında "artık geçerli değil" sayfasına düşer. Düz `/m/{slug}` linki (paylaşım/kopyala butonu, SEO) `k` olmadan her zaman çalışmaya devam eder.
- Telegram entegrasyonu bilinçli olarak kapsam dışı bırakıldı (2026-09-21); güncelleme kanalı şimdilik sadece WhatsApp.
Kurallar: em dash yok; tek aksan (amber); "baskı yok / anlık güncelleme" vaadi korunur ("işlem başına ücret yok" artık geçerli DEĞİL — görsel kota aşımı ve toplu iyileştirme ayrı ücretli). **"Sınırsız ürün" gibi bir vaat verilmez** (200+ ürünlü büyük menüler de desteklenir ama pazarlama dilinde "sınırsız" kullanılmaz). Menü motoru (menu.tsx + MenuView.tsx) markalamada DEĞİŞTİRİLMEZ, sadece landing metni/renk/fiyat değişir. Not: burada iki "menü" var — ürünün SATTIĞI şey restoranın QR menüsü; işletmenin kendi markası üstteki "SiriusMenu" yazısıdır (rebrand edilir).

## Logo ekleme (kişiselleştirmenin parçası, marka adından hemen sonra sor)

"Logon var mı? Dosyayı (png/jpg/svg) bu klasöre bırakman yeterli, ben yerleştiririm."
- Dosya verirse: `public/logo.png` olarak kopyala. Üst bardaki "SiriusMenu" yazısının yanına koy (yükseklik ~28px); landing header'daki marka adının yanına da ekle.
- Aynı görseli `app/icon.png` olarak da kaydet; Next.js bunu otomatik favicon yapar.
- Logo yoksa: "Sorun değil, temiz marka adı yazısı yeter; logon hazır olunca dosyayı bırak" de.
- Logoyu yerleştirdikten sonra kullanıcıya ekranda nasıl göründüğünü kontrol ettir.

## Her revizyonda zorunlu kalite kontrolü (kullanıcı kuralı, 2026-10-13)
Hiçbir revizyon bu liste yapılmadan bitmiş sayılmaz:
- **Butonlar/akışlar:** dokunduğun veya etkilenen her buton, form ve bağlantı gerçekten çalışıyor mu (panel, landing, ödeme, giriş, yasal sayfalar)? Ölü bağlantı, kopuk akış, eksik `onClick`/route olmamalı.
- **Bilgi tutarlılığı:** fiyat, plan adı, kota, özellik listesi ve vaatler `PRICING` + `messages/tr.json` + `messages/en.json` + landing + panel + `/api/stripe/*` + `app/[locale]/mesafeli-satis-sozlesmesi`, `kullanim-sartlari`, `iade-iptal-politikasi`, `kvkk-aydinlatma-metni` + `docs/` + `.env.example` içinde birbiriyle birebir uyumlu olmalı. Bir yeri değiştirirsen hepsini `Grep` ile tara ve düzelt. Sözleşme metni değişirse `app/lib/legal/versions.ts` `LEGAL_DOC_VERSION` artırılır.
- **Güvenlik:** tutar/kota/yetki kararı sunucuda verilir (istemciden gelen fiyat/plan alanına güvenme); yeni API route'u oturum + sahiplik kontrolü yapar; sırlar (`.env.local`) commit edilmez ve çıktıya basılmaz; kullanıcı girdisi doğrulanır; yeni tablolarda RLS açık olur.
- **Çeviri:** her yeni metin hem `tr.json` hem `en.json`'a eklenir; anahtarlar iki dosyada da aynı olmalı.
- **Doğrulama:** `npx tsc --noEmit` ve `npm run build` (varsa `npm run lint`) hatasız geçmeden commit/merge yapılmaz; sonuç kullanıcıya dürüstçe raporlanır (çalıştırılamayan test 'yapıldı' diye söylenmez).
- **Migration:** yeni migration eklendiğinde `docs/yapilacaklar.md`'ye uygulanması gerektiği yazılır ve kullanıcıya haber verilir.
