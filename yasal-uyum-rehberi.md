# qr-menu - Yasal Uyum Rehberi (Menü Şeffaflığı)

## 1. Yasal Dayanak

Tarım ve Orman Bakanlığı **Toplu Tüketim Yerleri Menü Şeffaflığı Yönetmeliği**, **1 Temmuz 2026** itibarıyla yürürlüktedir.

Kapsam: restoran, kafe, lokanta, otel gibi tüm toplu tüketim yerleri. Menülerde artık şu bilgiler açıkça belirtilmek zorunda:

- Etin türü (sadece "köfte" / "kebap" değil — dana, kuzu veya kanatlı olduğu açıkça yazılmalı)
- Bir porsiyonun kalori değeri
- Ürünün temel bileşenleri ve hammaddeleri
- Alerjen madde içerikleri
- Alkol veya domuz türevi bileşen içerip içermediği

Bu bilgiler basılı menü, yazı tahtası, broşür, dijital ekran veya QR kod ile sunulabilir. **QR kod kullanan işletmelerde, müşteriyi bu sisteme yönlendiren açık bir bilgilendirme menüde/tabelada bulunmalıdır.**

## 2. Menüde Zorunlu Bilgiler — Kontrol Listesi

Her ürün için:

- [ ] Et türü belirtildi mi? (dana / kuzu / kanatlı / yok)
- [ ] Porsiyon başına kalori (kcal) değeri var mı?
- [ ] Temel bileşen/hammadde listesi var mı?
- [ ] Alerjen bilgisi (gluten, süt, yumurta, fındık/kabuklu yemiş, soya, balık/kabuklu deniz ürünü, hardal, susam, kükürt dioksit/sülfit, vb.) işaretlendi mi?
- [ ] Alkol veya domuz türevi bileşen içerip içermediği belirtildi mi?

Fiziki menüde/tabelada:

- [ ] QR kod kullanılıyorsa, müşteriyi yönlendiren açık bir ibare var mı? (bkz. §3)

## 3. Sunum Yöntemleri

Yönetmelik sunum biçimini serbest bırakıyor; aşağıdakilerden biri veya birkaçı kullanılabilir:

- Basılı menü, yazı tahtası, broşür
- Dijital ekran
- QR kod sistemi

**QR kod kullanılıyorsa örnek yönlendirme ibaresi** (fiziki menüde/tabelada yer almalı):

> "Ürün içerikleri, alerjen ve kalori bilgileri için lütfen QR kodu okutunuz."

## 4. Kademeli Geçiş Takvimi

| İşletme Grubu | İçerik / Alerjen / Et Türü | Kalori Bilgisi |
|---|---|---|
| Ulusal zincir restoranlar | **1 Temmuz 2026** | 31 Aralık 2027 |
| Aynı ilde 3+ şubesi olan işletmeler | 31 Aralık 2026 | 31 Aralık 2027 |
| Diğer tüm işletmeler | 31 Aralık 2026 | 31 Aralık 2027 |

> Not: Pazar bir günde değil, önümüzdeki ~18 ay içinde kademeli olarak oluşuyor. Erken uyum, rekabet avantajı sağlar.

## 5. Menü Veri Modeli (page.json / src/menu.js için önerilen şema)

`kur.md` içinde tanımlı `src/menu.js` dosyası oluşturulduğunda, her ürün aşağıdaki alanları taşımalıdır:

```json
{
  "id": "urun-001",
  "name": "Adana Kebap",
  "category": "Ana Yemek",
  "price": 320,
  "meatType": "kuzu",
  "calories": 650,
  "ingredients": ["kuzu eti", "kırmızı biber", "soğan", "baharat"],
  "allergens": ["gluten", "sülfit"],
  "containsAlcohol": false,
  "containsPork": false,
  "image": "/images/adana-kebap.jpg"
}
```

Alan açıklamaları:

- `meatType`: `"dana"` | `"kuzu"` | `"kanatli"` | `"yok"` (et içermeyen ürünlerde)
- `calories`: porsiyon başına kcal (sayısal)
- `ingredients`: temel bileşen/hammadde listesi
- `allergens`: alerjen kodları listesi (boş dizi de olabilir, ama alan mutlaka bulunmalı)
- `containsAlcohol` / `containsPork`: boolean, zorunlu

## 6. Yeni Menü Hazırlama / Mevcut Menü Düzenleme — Adım Adım

1. Mevcut menüdeki her ürünü tek tek listele.
2. Her üründe §2'deki 5 zorunlu alanın eksik olup olmadığını tara.
3. Eksik et türü bilgisini netleştir (tedarikçi/mutfak ile teyit).
4. Alerjen ve kalori bilgisini topla (gerekirse laboratuvar/üretici verisi veya standart tarif hesaplaması kullan).
5. QR kod kullanılacaksa, fiziki menüye/tabelaya yönlendirme ibaresini ekle (§3).
6. Veriyi `src/menu.js` şemasına (§5) uygun şekilde gir.
7. Yayına almadan önce kontrol listesini (§2) tekrar kontrol et.

## 7. Hizmet Paketleri (Yasal Uyum Paketleri)

Fiyatlar dolar bazlıdır (KDV hariç, piyasa koşullarına göre gözden geçirilmelidir).

### Paket A — Hızlı Uyum
- Mevcut menü metninin taranması, eksik alan tespiti (et türü, alerjen, kalori)
- Metinsel içerik güncelleme (tasarım/görsel yok)
- Teslim: 24–48 saat
- **Fiyat: $75 – $120** (tek seferlik, tek şube)

### Paket B — Uyum + Görsel
- Paket A'nın tamamı
- Ürün görselleri / ikon seti (alerjen ikonları, et türü rozetleri)
- QR kod tasarımı, masa üstü/tabela bilgilendirme kartı
- Teslim: 1–2 iş günü
- **Fiyat: $180 – $280** (tek seferlik, tek şube; çok şubeli işletmelerde şube başına ek ücret)

### Paket C — Tam Kurulum (SiriusMenü SaaS)
- Paket B'nin tamamı
- Tam QR/dijital menü sistemi kurulumu (page.json / MenuPage tabanlı), yönetim paneli
- Aylık abonelik
- Teslim: 3–5 iş günü
- **Fiyat: $250 – $400 kurulum**
  - + **$15/ay** (tek şube)
  - + **$35/ay** (çok şubeli / orta ölçek)
  - + **$79+/ay** (zincir / kurumsal, özel teklif)

## 8. Claude için Uygulama Notu

Yeni bir menü oluşturulurken veya mevcut bir menü düzenlenirken:

- Her ürün girişinde §5'teki şemadaki tüm zorunlu alanların (özellikle `meatType`, `calories`, `allergens`, `containsAlcohol`, `containsPork`) dolu olduğunu doğrula.
- QR tabanlı bir akış kuruluyorsa, fiziki menüye §3'teki yönlendirme ibaresinin eklendiğini kontrol et.
- Müşteriye paket teklifi hazırlanıyorsa §7'deki paketleri referans al.

## 9. İlgili Belgeler

Paket C ile sepet/sipariş/ödeme akışı (online sipariş, adrese teslim, online ödeme) devreye girdiğinde, KVKK aydınlatma metni, gizlilik politikası, mesafeli satış sözleşmesi ve güvenli Supabase/Vercel/GitHub mimarisi için kardeş projedeki şu dosyalara bakılmalıdır:

- `restoran-siparis-sistemi/kvkk-ve-hukuki-metinler.md`
- `restoran-siparis-sistemi/guvenlik-ve-mimari-rehberi.md`
