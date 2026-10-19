# SiriusMenu — Yapılacaklar

## Konsolide açık işler (5 oturumdan derlendi, 2026-10-18)
> `npx tsc --noEmit` ve `npm run build` 2026-10-18'de hatasız geçti (projede `lint` script'i yok). Tarayıcı/ödeme/WhatsApp akışları elle test edilmedi.

**Karar bekleyen**
- [ ] Temel plana 2.500 TL kurulum bedeli (ilk ödeme 2.999 TL) Temel için kaldırılacak mı?
- [ ] Profesyonel plan farkı yalnızca görsel kotası (60/ay, yıllık 80): ek özellik tanımla veya fiyatı gözden geçir.
- [ ] Yıllık "öncelikli destek" vaadi landing'den kaldırıldı; geri istenirse destek süreci tanımlanmalı.
- [ ] EU/US bölgesel fiyat tablosu onayı (Temel 19 USD/17 EUR, Full 49/45, Pro 79/75, ömür boyu 499/449, kurulum 149/139'dan); onaylanırsa Stripe `currency_options` + bölge seçimi kodlanır.

**Rakip analizi sonrası (2026-10-19, dal `feat/paket-karsilastirma-alerjen`, commit edilmedi)**
- [x] Faz 1: landing'e plan karşılaştırma tablosu, maliyet hesaplayıcı, genişletilmiş SSS (5'ten 15'e), yıllık tasarruf tutarı; yeni özellik kartları. Migration yok.
- [x] Madde 9: ürüne alerjen, kalori, gramaj, porsiyon seçenekleri (panel "Detaylar" bölümü + menü görünümü). `menu` jsonb içinde, migration yok. `/api/menu/save` artık `sanitizeCategories` ile doğruluyor.
- [ ] **Çok dilli menü** (Full ve Pro): Gemini ile ürün/kategori çevirisi, müşteri dil seçimi, telefon dilini algılama, alerjen/etiket adlarının çevirisi. Migration gerekir. Canlı testten sonra başlanacak.
- [ ] Sırada: basit analitik (QR tarama/ürün görüntüleme, migration gerekir), yazdırılabilir QR şablonları. Karar: alerjen/porsiyon tüm planlarda; çok dil Full ve Pro; analitik tüm planlarda.
- [ ] Elle test: panelde Detaylar bölümü, menüde alerjen/porsiyon görünümü (list ve coverflow), hesaplayıcı mobil görünümü, karşılaştırma tablosu mobil yatay kaydırma.
- [ ] Alerjen sorumluluğu: panelde işletme sorumluluğu notu var; kullanım şartlarına da madde eklenecekse `LEGAL_DOC_VERSION` artırılmalı (avukat teyidiyle).

**Migration (uygulandı mı kontrol et)**
- [ ] `0011_purchase_consents` ve `0012_consent_retention` canlı Supabase'de uygulandı mı doğrula (SQL Editor). 0009/0010 doğrulandı; 0013/0014 için de kontrol et.

**Kod boşlukları (bilinen)**
- [ ] Kurulum hizmeti teslimatı: `service_orders` durumunu (paid, in_progress, delivered) ve "Görsel temsilidir" kutusunu değiştirecek admin ekranı/prosedür yok (şimdilik elle SQL).
- [ ] Hesap silme: Supabase Storage'daki görseller silinmiyor olabilir; tek seferlik "Ömür Boyu" alıcıları için silme sonrası durum metne eklenmeli.
- [ ] Kayıt anında sözleşme sürümü `handle_new_user`'a yazılmıyor.
- [ ] Sözleşme onay e-postasında ürün satırı ham değer ("subscription / pro / month") ve yalnızca Türkçe.
- [ ] Pazarlama izni geri alma için panelde ekran yok (şimdilik e-posta ile). Pazarlama e-postasına başlanırsa İYS 1.000 alıcı eşiği.
- [ ] Çerez bildirimindeki "Reddet" işlevsiz (yalnızca zorunlu çerez var); analitik eklenirse gerçek kapı olmalı.
- [ ] Webhook/cron secret karşılaştırmaları `===` (zamanlama güvenli değil, düşük risk); istenirse `timingSafeEqual`.

**Elle test (giriş gerektirir)**
- [ ] Kayıt: kayıtlı e-postayla "zaten hesap var" uyarısı (Supabase `identities` boş gelmesine dayanıyor; canlıda doğrulanmadı).
- [ ] E-posta onay sekmesi, tekrar gönder, "E-postayı düzelt", giriş mesajları; şifre sıfırlama zinciri (sifre-sifirla, mail, sifre-yenile).
- [ ] Panel: plan seçici, Temel planda WhatsApp uyarısı, Kurulum Hizmeti kartı, "Görsel temsilidir" kutusu.
- [ ] Ödeme (test anahtarlarıyla): Temel aylık/yıllık, kurulum (taban + ek satır = `serviceQuote`), `service_orders`, `purchase_consents` kaydı, hesap silme + abonelik iptali.
- [ ] WhatsApp: Temel planlı hesapta "Temel planda yok" yanıtı.

**Kod dışı (sen)**
- [ ] Supabase: minimum şifre uzunluğu 8, Reset Password şablonunda `{{ .ConfirmationURL }}`.
- [ ] Resend: `siriusmenu.com` doğrulandı; Supabase SMTP bağla.
- [ ] DPA'lar (Supabase, Stripe, Vercel, Google, Resend), VERBİS, KVKK yurt dışı aktarım bildirimi, Supabase veri bölgesi, Stripe KDV ayarı, Vercel Hobby/Gemini ücretsiz katman uygunluğu, avukat teyidi.
- [ ] Stripe'ta `STRIPE_PRICE_SMS_5.000/_10.000` ürünlerini arşivle (başka projeye ait).
- [ ] Danışılacaklar: SMS, Meta Cloud API geçişi (Evolution ban riski), AB uyumluluğu (VAT/OSS, GDPR, çerez, AI Act).

- [x] **Stripe fiyat ID'leri** (16 adet) — 2026-10-17: hepsi `.env.local`'da, Stripe API ile doğrulandı (hepsi LIVE, aktif, tutarlar `PRICING` ile birebir; anahtar teslim 4 fiyat dahil). Vercel Production'a girildiği ayrıca teyit edilecek (aşağıdaki "Canlıya alma").
- [ ] **Avukat teyidi** — güncellenen mesafeli satış sözleşmesi, iade/iptal politikası ve yapay zekâ görseli/telif metinleri (`docs/yasal-uyumluluk.md` 6b) yayına almadan önce hukuki olarak kontrol ettirilmeli (`LEGAL_DOC_VERSION` 2026-10-13).
- [ ] **Temel plan canlı testi** — Temel aylık/yıllık satın alma, panelde WhatsApp kartındaki uyarı ve WhatsApp mesajına verilen "Temel planda yok" yanıtı denenmeli. Not: `.env.local` artık canlı Stripe anahtarlı; test için test anahtarlarını `.env.development.local` dosyasına koy.
- [ ] **Anahtar teslim kurulum canlı testi** — sipariş, `service_orders` kaydı, teslimatta ürünlerde "Görsel temsilidir" kutusunun işaretlenmesi (test anahtarlarıyla, yukarıdaki not).

## Canlıya alma (2026-10-17/18)
> **Durum 2026-10-18:** Vercel Production env'leri tamam, tek eksik `STRIPE_WEBHOOK_SECRET`. Evolution WhatsApp `siriusmenu` instance'ı `open` (+905102213630 bağlı). ImproMX e-posta yönlendirmesi ve Resend DNS çalışıyor. Aşağıdaki iki **kritik** madde (webhook secret + www URL) bitmeden ödeme sonrası plan/kota aktifleşmez.

- [x] **KRİTİK: Stripe webhook URL'sini `www` yap.** `https://siriusmenu.com` her yola 308 ile `https://www.siriusmenu.com`'a yönleniyor; Stripe yönlendirme takip etmez, teslimatlar başarısız olur. Stripe Dashboard > Developers > Webhooks > SiriusMenu endpoint'inde URL'yi `https://www.siriusmenu.com/api/stripe/webhook` olarak düzenle (olaylar zaten doğru: `checkout.session.completed`, `invoice.paid`, `customer.subscription.created/updated/deleted`; endpoint LIVE ve aktif). `www` adresi imzasız isteğe 400 ile doğru yanıt veriyor (rota canlı).
- [ ] **KRİTİK: `STRIPE_WEBHOOK_SECRET` Vercel Production'da yok.** Sadece Development'ta (81 gün önceki eski kayıt) görünüyor. Stripe'taki SiriusMenu endpoint'inin `whsec_...` değerini Vercel'de **Production** kutusu işaretli olarak gir (kaydı düzenlerken ortam kutusunu işaretlemeyi unutma), sonra redeploy.
- [x] **Vercel `RESEND_FROM` değeri** `SiriusMenu <info@siriusmenu.com>` olmalı (Resend'de doğrulanan alan adı `siriusmenu.com`; `bysirius.com` olursa gönderim reddedilir). Yerel `.env.local`'da hâlâ `info@bysirius.com`. İstenirse `app/lib/mailer.ts` içindeki sabit `reply_to` (`info@bysirius.com`) de `info@siriusmenu.com` yapılabilir.
- [ ] **Vercel Preview ortamından canlı `STRIPE_SECRET_KEY`'i kaldır** (Preview'da canlı anahtar açık; preview denemeleri gerçek tahsilat yapar).
- [x] **Env'ler** (2026-10-18 doğrulandı, Production): Stripe secret + 16 fiyat, Supabase, Gemini (+model adları), Anthropic, Resend, CRON_SECRET, Evolution/WhatsApp. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` kodda kullanılmıyor.
- [x] **Eski `STRIPE_PRICE_ID` silindi** (2026-10-18 doğrulandı).
- [ ] **Anthropic yedek anahtarı**: anahtar 2027-11-30'da sona erecek (takvime hatırlatma), Console'da aylık harcama limiti koy. Yedek yalnız metin çağrıları içindir; görsel iyileştirmenin yedeği yok.
- [ ] **Görsel maliyeti**: `gemini-2.5-flash-image` deprecated/kapanış geçti; varsayılan `gemini-3.1-flash-image` oldu (görsel başı ~$0.067, eskisi ~$0.039). Görsel kotası fiyatları (`PRICING`) hâlâ kâr bırakıyor mu kontrol et; ucuz alternatif `gemini-3.1-flash-lite-image` (~$0.034).
- [ ] **Siriplan webhook'u**: aynı Stripe hesabında olduğu için SiriusMenu ödemelerinin olaylarını da alacak; Siriplan işleyicisinin `restaurant_id` metadata'sı olan olayları yok saydığını kontrol et (SiriusMenu tarafı güvenli, ilgisiz olayları atlıyor).
- [x] **WhatsApp bağlandı** (2026-10-18): `siriusmenu` instance'ı `open`, numara +905102213630 (pairing code ile).
- [ ] **Railway `WEBHOOK_GLOBAL_URL`** `https://www.siriusmenu.com/api/whatsapp/webhook?secret=...` olmalı (apex `siriusmenu.com` 308 ile yönleniyor, `www` kullan) ve `secret=` değeri Vercel'deki `WHATSAPP_WEBHOOK_SECRET` ile birebir aynı olmalı; değişirse Railway servisini redeploy et.
- [ ] **WhatsApp uçtan uca test**: panelde "WhatsApp bağla" (numara + 6 haneli kod) > SiriusMenu numarasına kodu yaz > "✅ WhatsApp bağlandı" > "Latte fiyatını 120 yap" > "geri". Telefonu 14 günde bir internete bağla; ilk haftalarda düşük hacim, toplu mesaj yok. Evolution panelinde 173 kişi / 500 sohbet / 278 mesaj senkronize görünüyor; webhook'un eski mesajlara cevap vermediğini ilk testte izle.
- [x] **ImproMX alias**: `info@siriusmenu.com` vb. alias'ları gerçek gelen kutusuna yönlendir (DNS tamam, "forwarding active" e-postası geldi). Premium gerekmez.
- [ ] **Supabase Auth**: Authentication > URL Configuration'da Site URL ve redirect URL'ler canlı alan adını (`https://www.siriusmenu.com`) içermeli; Resend SMTP'sini Supabase'e bağla (bkz. `docs/e-posta-marka-kurulum.md`).
- [ ] **Canlı ödeme testi**: küçük bir gerçek ödeme (örn. 400 TL görsel paketi), plan/kotanın değiştiğini ve Stripe'ta endpoint olayının "Succeeded" olduğunu doğrula, sonra iade et. Stripe Billing > Customer portal'ı canlı modda etkinleştir.
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

- [2026-10-19] Tek Seferlik (Ömür Boyu Menü) paketi landing ve panelden kaldırıldı; API/webhook/sözleşme metni müşteri talebi için canlı bırakıldı. Talep gelirse /api/stripe/checkout product=lifetime ile satılabilir.

## Güvenlik denetimi düzeltmeleri (2026-10-19)
- [x] **Migration `0015_rls_protect_billing_columns.sql` Supabase'e uygulanmalı** (SQL Editor veya `supabase db push`). Uygulanana kadar giriş yapmış kullanıcı doğrudan REST ile tier/plan/is_lifetime/image_quota/qr_token alanlarını değiştirebilir (ödeme duvarı atlatılır). Uyguladıktan sonra panelde menü kaydetme, yayınla/gizle, QR yenile, WhatsApp numara ekle/kaldır ve görsel iyileştirme akışlarını bir kez dene. (2026-10-19: async_payment_succeeded + async_payment_failed eklendi; failed olayı kodda işlenmeden 200 döner, zararsız.)
- [ ] **Stripe Dashboard > Webhooks**: endpoint'e `checkout.session.async_payment_succeeded` olayını ekle (gecikmeli ödeme yöntemleri için; mevcut olaylar korunur).
- [ ] **WhatsApp webhook secret**: kod artık `x-webhook-secret` başlığını tercih eder; `?secret=` query parametresi geriye dönük uyumluluk için hâlâ kabul edilir (Evolution global webhook'u özel başlık göndermiyorsa query ile devam et).
