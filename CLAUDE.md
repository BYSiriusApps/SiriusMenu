# qr-menu - CLAUDE Kurulum

## Proje Tanımı

`qr-menu` projesi, QR kod tabanlı menü gösterimi ve sipariş yönlendirme için temel uygulama iskeletini sağlar.

## Hazırlık

- Proje klasörünü açın.
- `page.json` içeriğini kontrol edin.
- `kur.md` dosyasındaki adımları takip edin.

## Örnek page.json

```json
{
  "name": "qr-menu",
  "displayName": "QR Menü",
  "description": "QR kod tabanlı menü ve sipariş akışı için temel yapılandırma.",
  "type": "web-app",
  "entry": "src/index.html",
  "route": "/",
  "pages": [
    {
      "id": "menu",
      "title": "Menü",
      "route": "/",
      "component": "MenuPage"
    }
  ],
  "settings": {
      "theme": "light",
      "locale": "tr-TR"
  }
}
```

## Claude için Notlar

- `page.json` Claude tarafından okunup proje iskeletine dönüştürülebilir.
- Menü ve QR tarama akışı `pages` içinde tanımlanmalıdır.
- Yeni menü oluşturulurken veya mevcut menü düzenlenirken `yasal-uyum-rehberi.md` dosyasındaki zorunlu alan şeması ve kontrol listesi referans alınmalıdır (1 Temmuz 2026 Menü Şeffaflığı Yönetmeliği uyumu için).
