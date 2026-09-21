# SiriusMenu — İş Akışı Planı (işletmeye sunum)

FineDine benzeri, ama esnaf odaklı ve WhatsApp'tan yönetilen bir dijital menü hizmeti.
İşletme menüsünü hep güncel tutar, fotoğraflarını yükleyip AI ile iyileştirir; teknik iş bize kalır.

---

## 1. Onboarding (kurulum) akışı

| Adım | Kim | Ne olur |
|---|---|---|
| 1 | İşletme | `/kayit` — e-posta ile üye olur (Supabase Auth). Trigger otomatik `restaurant` + `trialing` abonelik oluşturur. |
| 2 | İşletme | Panelde işletme adı, alt başlık, tema seçer; kategorileri ve ürünleri girer (AI açıklama yardımcısı ile). |
| 3 | İşletme | "Plana geç" → Stripe Checkout: **kurulum ücreti (tek seferlik) + aylık/yıllık abonelik**. |
| 4 | Sistem | Stripe webhook → abonelik `active`, görsel kotası tanımlanır (`image_quota`), `setup_fee_paid=true`. |
| 5 | İşletme | "WhatsApp bağla" → numara girer, 6 haneli kod alır, işletme numaramıza yazar → doğrulanır. |
| 6 | İşletme | İlk fotoğrafları yükler; kurulum paketiyle ilk 20 fotoğraf iyileştirmesi dahil. |
| 7 | İşletme | "Menüyü yayına al" → `/m/<slug>` canlı. QR kodu indirir, masaya/vitrine koyar. |

Kurulum bizde yarım gün: menü girişi + tema + ilk fotoğraf turu + WhatsApp bağlama.

---

## 2. Günlük menü güncelleme — WhatsApp AI akışı

```
İşletme (WhatsApp)                SiriusMenu numarası (Evolution API)         Uygulama (Vercel)              Supabase
      |  "Latte 120 olsun"  ───────────────►  webhook: messages.upsert  ──────►  /api/whatsapp/webhook
      |                                                                            |  numara -> restaurant eşle
      |                                                                            |  Gemini: komutu ayrıştır
      |                                                                            |     -> {update_price, "Latte", "120"}
      |                                                                            |  applyMenuIntent(menu)
      |                                                                            |  restaurants.menu güncelle  ──►  jsonb
      |                                                                            |  menu_change_log yaz (geri al için)
      |  ◄──  "✅ Latte fiyatı 120. Geri almak için 'geri' yaz."  ◄────────────────  sendText
      |
   /m/<slug>  ──  revalidate=0  ──►  müşteri okuttuğunda anında yeni fiyat
```

**Desteklenen komutlar (Türkçe, serbest yazım):**
- Fiyat: "Latte 120", "San Sebastian'ı 150 yap"
- Açıklama: "Adana kebabın açıklamasını 'acılı, közde' yap"
- İsim: "Filtre Kahve'yi 'Günün Kahvesi' yap"
- Ekleme: "Tatlılar'a Tiramisu 130 ekle"
- Silme: "Vegan Brownie'yi kaldır"
- Stok: "Künefe tükendi" / "Künefe tekrar var"
- Geri alma: "geri"
- Belirsizse asistan sorar ("Hangi Latte: Sıcak mı Buzlu mu?"), körlemesine uygulamaz.

**Fotoğraf WhatsApp'tan:** işletme fotoğrafı yollar → "hangi ürün?" → ürün adını yazar → foto menüye eklenir, kota varsa AI ile iyileştirilir.

---

## 3. Fotoğraf iyileştirme akışı

### Tekli (panel veya WhatsApp) — kotadan düşer
1. İşletme telefonuyla çektiği fotoğrafı yükler → `menu-photos` bucket'ına `original`.
2. "✨ İyileştir" → `/api/images/enhance` → Gemini 2.5 Flash Image: ışık, renk, arka plan, keskinlik, kare kırpma.
3. `enhanced.png` kaydedilir, menüdeki ürüne bağlanır, `image_quota_used += 1`.
4. Kota dolmuşsa: 402 + "ek paket al" yönlendirmesi.

### Toplu (bulk) — kotadan bağımsız, ayrı ücret
1. İşletme panelde birden çok ürün seçer → "Toplu iyileştir".
2. `/api/images/bulk` → `menu_images` satırları (`kind=bulk`, `status=uploaded`) + Stripe ödeme (50/100 foto paketi).
3. Ödeme sonrası webhook → satırlar `processing`.
4. Vercel Cron (`*/1 * * * *`) → `/api/cron/process-images` → her turda birkaç fotoğrafı Gemini'den geçirir, ürüne bağlar.
5. İşletme panelde ilerlemeyi görür; biten fotoğraflar menüde belirir.

---

## 4. Faturalama akışı

| Kalem | Tip | Stripe |
|---|---|---|
| Kurulum | Tek seferlik | İlk abonelik Checkout'una ek satır (`STRIPE_PRICE_ID_SETUP`) |
| Aylık / Yıllık abonelik | Recurring | `STRIPE_PRICE_ID_MONTHLY` / `_YEARLY` |
| Görsel paketi (kota aşımı) | Tek seferlik | `payment` Checkout → `image_quota += 20` |
| Toplu iyileştirme 50/100 | Tek seferlik | `payment` Checkout → bulk kuyruğu serbest |
| Aylık kota sıfırlama | Otomatik | `invoice.paid` + gece cron yedeği |

İptal: Stripe müşteri portalı (`/api/stripe/portal`). İptalde plan `trial`'a düşer, yayın durur.

---

## 5. Fiyat tablosu (taslak — netleştirilecek)

| | Deneme | Aylık | Yıllık |
|---|---|---|---|
| Ücret | 0 | **749 TL/ay** | **7.490 TL/yıl** (~2 ay bedava) |
| Kurulum (tek sefer) | — | 2.500 TL | 2.500 TL |
| Menü + tema + QR | ✓ | ✓ | ✓ |
| Yayın (`/m/<slug>`) | — | ✓ | ✓ |
| WhatsApp AI güncelleme | — | ✓ | ✓ |
| AI fotoğraf iyileştirme / ay | — | 30 | 40 |
| Kota aşımı | — | 25 TL/görsel · 20'li 400 TL | aynı |
| Toplu iyileştirme | — | 50 foto 999 TL · 100 foto 1.799 TL | aynı |

---

## 6. Mimari

```
GitHub ──► Vercel (Next.js: landing, panel, /m, API routes, Cron)
                 │
     ┌───────────┼────────────────────────────┐
     ▼           ▼                            ▼
  Supabase    Stripe                     Gemini API
  (DB/Auth/   (abonelik +               (görsel iyileştirme/üretme,
   Storage)    tek seferlik)             menü komut ayrıştırma)
     ▲
     │ webhook
  Evolution API (ayrı konteyner / VPS)  ◄── WhatsApp (işletme numarası)
```

- **n8n yok.** Tetikleme: WhatsApp→webhook, Stripe→webhook, zamanlı→Vercel Cron.
- Ağır görsel işleri Cron + batch; gerekirse Supabase Edge Function'a taşınabilir.
