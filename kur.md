# qr-menu - Kurulum Rehberi

## 1. Proje Hazırlığı

- Klasör: `qr-menu`
- Temel dosyalar: `CLAUDE.md`, `kur.md`, `page.json`
- Gerekirse: `package.json`, `src/`, `public/`

## 2. Dosya Yapısı

- `page.json`
- `src/index.html`
- `src/menu.js`
- `public/styles.css`
- `.env`

## 3. Örnek page.json

```json
{
  "name": "qr-menu",
  "displayName": "QR Menü",
  "type": "web-app",
  "description": "QR kod tabanlı menü uygulaması için temel yapılandırma.",
  "entry": "src/index.html",
  "route": "/",
  "pages": [
    {
      "id": "menu",
      "title": "Menü",
      "route": "/",
      "component": "MenuPage"
    }
  ]
}
```

## 4. Örnek package.json

```json
{
  "name": "qr-menu",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 5. Çalıştırma

- `.env.example` dosyasını `.env` olarak kopyalayın ve Supabase proje URL'inizi/publishable key'inizi girin (bu dosya `.gitignore` ile repoya girmez).
- `supabase/migrations/0001_menu_items.sql` dosyasını Supabase Dashboard > SQL Editor'da bir kere çalıştırarak `menu_items` tablosunu ve okuma iznini (RLS policy) oluşturun.
- (Opsiyonel örnek veri) `supabase/migrations/0002_seed_menu_items.sql` dosyasını aynı şekilde SQL Editor'da bir kere çalıştırarak örnek/başlangıç menüsünü yükleyin. Gerçek işletme verisiyle değiştirmeden önce fiyatları güncelleyin.
- `npm install`
- `npm run dev`

> Not: Bu iki SQL dosyası Claude/otomasyon tarafından **çalıştırılamaz** — Supabase şema/veri değişikliği için proje sahibinin Dashboard erişimi (veya `service_role`/DB şifresi) gerekir; publishable/anon key ile RLS bu işlemlere izin vermez. Kod tarafı ve dosyalar hazır; SQL Editor adımı elle yapılmalıdır.

## 5b. QR Kod ve Fiziki Tabela

- `npm run generate-qr -- https://SITE_DOMAIN` çalıştırarak `public/images/qr-menu.png` dosyasını üretim domaininize göre üretin (argüman verilmezse `http://localhost:5173` ile test QR'ı üretilir — yayına almadan önce mutlaka gerçek domain ile yeniden üretin).
- `public/tabela.html` dosyası, §3'teki zorunlu yönlendirme ibaresini ve üretilen QR kodu içeren, A5 boyutunda basılabilir bir masa/tabela kartı şablonudur. Tarayıcıda açıp "Yazdır / PDF olarak kaydet" ile çıktı alınabilir. `[RESTORAN ADI]` yer tutucusunu gerçek işletme adıyla değiştirin.

## 6. Notlar

- Menü verileri ve QR hedefleri `src` altında tanımlanmalıdır.
- `src/menu.js` hazırlanırken `yasal-uyum-rehberi.md` dosyasındaki veri şemasına (et türü, kalori, alerjen, alkol/domuz türevi alanları) uyulmalıdır.
- Ürün ekleme/düzenleme iki yoldan yapılabilir: Supabase Studio üzerinden elle, veya `api/menu-items.js` admin API'si üzerinden (bkz. §7). Her iki yolda da `is_published = true` yapılan ürünler menüde görünür.
- `service_role` key hiçbir client dosyasına veya `.env`'e commitlenerek girmemelidir; sadece Vercel Environment Variables üzerinde, `api/menu-items.js` sunucu fonksiyonu için tanımlanır (bkz. `restoran-siparis-sistemi/guvenlik-ve-mimari-rehberi.md`).

## 7. Admin Yazma API'si (`api/menu-items.js`)

Vercel Serverless Function olarak çalışır, `service_role` key'i sadece sunucu tarafında kullanır. Her istekte `x-admin-key` header'ı ile `ADMIN_API_KEY` doğrulanır.

Ortam değişkenleri (Vercel Dashboard > Settings > Environment Variables, `.env.example` içinde şablonu var):

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — `VITE_` önekiyle **karıştırılmamalı**.
- `ADMIN_API_KEY` — uzun/rastgele bir secret; sadece yetkili kişilerde bulunur.

Örnek kullanım:

```bash
# Yeni ürün ekle
curl -X POST https://SITE_DOMAIN/api/menu-items \
  -H "x-admin-key: $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Lahmacun","category":"Ana Yemek","price":150,"meat_type":"dana","calories":300,"ingredients":["dana kıyma","lavaş","domates","biber"],"allergens":["gluten"],"contains_alcohol":false,"contains_pork":false,"is_published":true}'

# Ürün güncelle
curl -X PATCH "https://SITE_DOMAIN/api/menu-items?id=UUID" \
  -H "x-admin-key: $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"price":160}'

# Ürün sil
curl -X DELETE "https://SITE_DOMAIN/api/menu-items?id=UUID" -H "x-admin-key: $ADMIN_API_KEY"
```

API, POST/PATCH isteklerinde `yasal-uyum-rehberi.md` §5 şemasındaki zorunlu alanları (`meat_type`, `calories`, `ingredients`, `allergens`, `contains_alcohol`, `contains_pork`) sunucu tarafında doğrular; eksikse `400` döner.
