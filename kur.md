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
- `npm install`
- `npm run dev`

## 6. Notlar

- Menü verileri ve QR hedefleri `src` altında tanımlanmalıdır.
- `src/menu.js` hazırlanırken `yasal-uyum-rehberi.md` dosyasındaki veri şemasına (et türü, kalori, alerjen, alkol/domuz türevi alanları) uyulmalıdır.
- Ürün ekleme/düzenleme şimdilik Supabase Studio üzerinden yapılır (`is_published = true` yapılan ürünler menüde görünür); yazma API'si eklenene kadar `service_role` key hiçbir client dosyasına girmemelidir (bkz. `restoran-siparis-sistemi/guvenlik-ve-mimari-rehberi.md`).
