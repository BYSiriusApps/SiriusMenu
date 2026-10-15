# SiriusMenu — Yapılacaklar

- [ ] **Stripe fiyat ID'lerini ekle** (12 adet, `.env.local.example` şablonuna bak; anahtar teslim kurulum için price gerekmez, `price_data` kullanır) — Stripe panelinden her ürün için ayrı price oluşturup ID'lerini `.env.local` (yerel) ve Vercel proje ayarlarına (production) ekle: `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`, `STRIPE_PRICE_ID_MONTHLY_BASIC` (499 TL), `STRIPE_PRICE_ID_YEARLY_BASIC` (4.990 TL), `STRIPE_PRICE_ID_MONTHLY_PRO`, `STRIPE_PRICE_ID_YEARLY_PRO`, `STRIPE_PRICE_ID_LIFETIME`, `STRIPE_PRICE_ID_LIFETIME_EXTRA_BLOCK`, `STRIPE_PRICE_ID_SETUP`, `STRIPE_PRICE_ID_IMAGE_PACK`, `STRIPE_PRICE_ID_BULK50`, `STRIPE_PRICE_ID_BULK100`. Eksik oldukları sürece ilgili panel butonları ("Plana geç", "+paket", "Toplu iyileştir") "Geçersiz ürün" hatası verir (bkz. `app/api/stripe/checkout/route.ts`).
- [ ] **Avukat teyidi** — güncellenen mesafeli satış sözleşmesi, iade/iptal politikası ve yapay zekâ görseli/telif metinleri (`docs/yasal-uyumluluk.md` 6b) yayına almadan önce hukuki olarak kontrol ettirilmeli (`LEGAL_DOC_VERSION` 2026-10-13).
- [ ] **Temel plan canlı testi** — Stripe test modunda Temel aylık/yıllık satın alma, panelde WhatsApp kartındaki uyarı ve WhatsApp mesajına verilen "Temel planda yok" yanıtı denenmeli.
- [ ] **Anahtar teslim kurulum canlı testi** — Stripe test modunda sipariş, `service_orders` kaydı, teslimatta ürünlerde "Görsel temsilidir" kutusunun işaretlenmesi.

## Fiyat/Stripe kontrolü (2026-10-13)
- [ ] **Stripe price ID'lerini `.env.local` ve Vercel'e gir** (12 adet, bkz. `.env.local.example`), Vercel'de redeploy et. Canlı mod ID'leri test mod ID'leriyle karışmasın; canlı mod `STRIPE_SECRET_KEY` ve `STRIPE_WEBHOOK_SECRET` de eşleşmeli.
- [ ] **Stripe'ta kurulum hizmeti ürünleri** (3.500/5.500/7.500/2.000 TL) açıldı ama kod bunları kullanmıyor (tutarı sunucu `price_data` ile hesaplıyor). Elle fatura/ödeme linki için kullanılacaksa kalsın, değilse arşivle.
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
