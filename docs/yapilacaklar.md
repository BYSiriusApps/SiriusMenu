# SiriusMenu — Yapılacaklar

- [x] **Stripe fiyat ID'leri** (16 adet) — 2026-10-17: hepsi `.env.local`'da, Stripe API ile doğrulandı (hepsi LIVE, aktif, tutarlar `PRICING` ile birebir; anahtar teslim 4 fiyat dahil). Vercel Production'a girildiği ayrıca teyit edilecek (aşağıdaki "Canlıya alma").
- [ ] **Avukat teyidi** — güncellenen mesafeli satış sözleşmesi, iade/iptal politikası ve yapay zekâ görseli/telif metinleri (`docs/yasal-uyumluluk.md` 6b) yayına almadan önce hukuki olarak kontrol ettirilmeli (`LEGAL_DOC_VERSION` 2026-10-13).
- [ ] **Temel plan canlı testi** — Temel aylık/yıllık satın alma, panelde WhatsApp kartındaki uyarı ve WhatsApp mesajına verilen "Temel planda yok" yanıtı denenmeli. Not: `.env.local` artık canlı Stripe anahtarlı; test için test anahtarlarını `.env.development.local` dosyasına koy.
- [ ] **Anahtar teslim kurulum canlı testi** — sipariş, `service_orders` kaydı, teslimatta ürünlerde "Görsel temsilidir" kutusunun işaretlenmesi (test anahtarlarıyla, yukarıdaki not).

## Canlıya alma (2026-10-17)
> **Sahibi sonra ekleyecek (bilinçli olarak bekletiliyor):** Stripe webhook secret, Anthropic API anahtarı, Resend API anahtarı. Bunlar girilene kadar: ödeme sonrası plan/kota otomatik aktifleşmez, Gemini yedeği yok, sözleşme onay e-postası gitmez.

- [ ] **Stripe webhook endpoint'i oluştur** (Live mod, Developers > Webhooks): URL `https://siriusmenu.com/api/stripe/webhook`; olaylar `checkout.session.completed`, `invoice.paid`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. Çıkan `whsec_...` değerini Vercel Production'da `STRIPE_WEBHOOK_SECRET` olarak gir. Şu an hesapta SiriusMenu endpoint'i YOK (sadece Siriplan/Astroviral). Ödeme sonrası plan/kota aktifleşmesi buna bağlı.
- [ ] **Vercel Production env eksikleri**: `STRIPE_SECRET_KEY` (canlı; girildiği doğrulanacak, 2026-10-17'de sadece Development'ta görünüyordu), `STRIPE_WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` değerinin `pk_live` olduğunu panelden kontrol et. Hepsinden sonra redeploy (`NEXT_PUBLIC_*` build'e gömülür). `CRON_SECRET` girildi (doğrulandı).
- [ ] **Eski `STRIPE_PRICE_ID` değişkenini sil** (Vercel Production + Development ve `.env.local`); Temmuz'dan kalma, kodda kullanılmıyor.
- [ ] **Anthropic yedek anahtarı**: anahtar 2027-11-30'da sona erecek (takvime hatırlatma), Console'da aylık harcama limiti koy. Yedek yalnız metin çağrıları içindir; görsel iyileştirmenin yedeği yok.
- [ ] **Görsel maliyeti**: `gemini-2.5-flash-image` deprecated/kapanış geçti; varsayılan `gemini-3.1-flash-image` oldu (görsel başı ~$0.067, eskisi ~$0.039). Görsel kotası fiyatları (`PRICING`) hâlâ kâr bırakıyor mu kontrol et; ucuz alternatif `gemini-3.1-flash-lite-image` (~$0.034).
- [ ] **Siriplan webhook'u**: aynı Stripe hesabında olduğu için SiriusMenu ödemelerinin olaylarını da alacak; Siriplan işleyicisinin `restaurant_id` metadata'sı olan olayları yok saydığını kontrol et (SiriusMenu tarafı güvenli, ilgisiz olayları atlıyor).
- [ ] **WhatsApp bağlama**: Railway Evolution hazır (`evo.siriusmenu.com`); instance aç (`siriusmenu`, numara +905102213630), pairing code/QR ile bağla, `connectionState` `open` doğrula, panelden test (bkz. `docs/evolution-api-kurulum.md`). Telefonu 14 günde bir internete bağla; ilk haftalarda düşük hacim.
- [x] **Migration 0009 ve 0010 uygulandı** (2026-10-17, canlı veritabanında doğrulandı). Dosyalar yeniden numaralandı: `0013_menu_layout`, `0014_service_orders` (çift 0012 sorunu giderildi). Tüm migration'lar SQL Editor'dan uygulandığı için `supabase db push` kullanılacaksa önce `supabase migration repair` ile geçmiş işaretlenmeli.
- [x] **Gemini modelleri güncellendi** (2026-10-17): `gemini-2.5-flash` bu hesapta 404 veriyordu; varsayılanlar `gemini-3.5-flash-lite` (metin) ve `gemini-3.1-flash-image` (görsel), metin çağrıları için Anthropic yedeği eklendi (`app/lib/gemini.ts`).

## Fiyat/Stripe kontrolü (2026-10-13)
- [x] **Stripe price ID'lerini `.env.local`'a gir** — 2026-10-17'de tamamlandı ve doğrulandı; Vercel Production için yukarıdaki "Canlıya alma" maddelerine bak.
- [ ] **`STRIPE_PRICE_SMS_5.000` / `_10.000`** ürünleri Stripe'ta var ama SiriusMenu kodunda SMS özelliği yok (muhtemelen başka proje). Karışıklık olmaması için başka hesaba taşı veya arşivle.

## Topluluktan yardım istenecek konular (notlar)
Aşağıdakiler kod dışı; karar/uzman görüşü gerekiyor. Topluluğa sorarken bağlam: SiriusMenu, Türkiye'deki kafe/restoranlara QR menü + WhatsApp ile menü güncelleme sunan SaaS; satıcı BY Sirius Group AI and Technology Co. Ltd. (Londra, UK); ödeme Stripe; altyapı Supabase + Vercel; AI Gemini; WhatsApp şu an Evolution API (resmî olmayan Baileys).

### 1. SMS durumu
- Şu an uygulamada SMS yok. Supabase `auth.sms` kapalı, şifre sıfırlama/doğrulama e-posta ile (`app/lib/mailer.ts`).
- Karar bekleyen: SMS ile giriş/doğrulama veya bildirim istenecek mi? İstenirse sağlayıcı (Netgsm/İletimerkezi TR, Twilio uluslararası), operatör onaylı gönderici adı (TR için BTK/İYS), maliyet ve KVKK/İYS (ticari ileti) şartları netleştirilmeli.
- Sorulacak: Türkiye'de işletmelere SMS gönderiminde güncel zorunluluklar (İYS kaydı, başlık onayı), uluslararası için en ucuz güvenilir sağlayıcı.

### 2. Meta Business / WhatsApp durumu
- Şu an: Evolution API (Baileys, resmî olmayan). Hesap yasaklama (ban) ve Meta ToS riski var; `WHATSAPP_PROVIDER=meta_cloud` için sağlayıcı iskeleti var ama boş (`app/lib/whatsapp/meta-provider.ts`).
- Yapılacak: Meta Business hesabı doğrulama (işletme belgeleri), WhatsApp Business Platform (Cloud API) numarası, mesaj şablonları, ücretlendirme (konuşma bazlı), webhook doğrulama.
- Sorulacak: Londra merkezli şirketle Türkiye numarası için Meta Business doğrulama süreci/belge listesi, Cloud API'ye geçişte kullanıcı başı maliyet, ban riskini azaltma, Evolution'dan resmî API'ye geçiş stratejisi.
- Kod tarafı hazır olunca: `meta-provider.ts` doldurulacak, webhook route'u değişmeden çalışacak (bkz. `docs/evolution-api-kurulum.md`).

### 3. AB (ve ABD) uyumluluk politikaları
Avrupa/ABD'ye satış ve bölgesel fiyat öncesi netleştirilecekler (bkz. `docs/yasal-uyumluluk.md`):
- **Vergi:** Satıcı UK'de. AB tüketici/işletme satışında KDV (VAT) ve OSS/IOSS, İngiltere KDV kaydı, ABD eyalet satış vergisi (nexus). Stripe Tax kullanılacak mı, muhasebeci kim?
- **GDPR/UK GDPR:** Aydınlatma metni, işleme envanteri, DPA (Supabase, Vercel, Stripe, Google Gemini ile), yurt dışı aktarım (SCC/UK IDTA), AB temsilcisi gerekliliği (Art. 27), saklama süreleri, silme/erişim talepleri.
- **Çerez/ePrivacy:** AB'de analitik çerezler için açık rıza banner'ı (şu an yalnızca zorunlu çerez).
- **Tüketici hakları:** AB'de 14 gün cayma hakkı ve dijital hizmet istisnası koşulları; sözleşme ve iade metinleri EU/UK için ayrı yazılmalı (şu an Türk mevzuatına göre).
- **Yapay zekâ:** AB AI Act şeffaflık yükümlülükleri (yapay zekâ ile üretilen görsellerin işaretlenmesi) ve "Görsel temsilidir" etiketinin yeterliliği.
- **Fiyat:** Önerilen EU/US fiyat tablosu onay bekliyor (Temel 19 USD/17 EUR, Full 49/45, Profesyonel 79/75 ...); Stripe çoklu para birimi (`currency_options`) ve bölge seçimi kodlanacak.
- Sorulacak: UK merkezli SaaS'ın AB'ye satışında minimum yasal kurulum (VAT kaydı eşiği, DPA şablonları), küçük işletmeler için pratik uyum kontrol listesi.
