# SiriusMenu — Yapılacaklar

- [ ] **Stripe fiyat ID'lerini ekle** — Stripe panelinden her ürün için ayrı price oluşturup ID'lerini `.env.local` (yerel) ve Vercel proje ayarlarına (production) ekle: `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`, `STRIPE_PRICE_ID_SETUP`, `STRIPE_PRICE_ID_IMAGE_PACK`, `STRIPE_PRICE_ID_BULK50`, `STRIPE_PRICE_ID_BULK100`. Eksik oldukları sürece ilgili panel butonları ("Plana geç", "+paket", "Toplu iyileştir") "Geçersiz ürün" hatası verir (bkz. `app/api/stripe/checkout/route.ts`).
