# Yasal Uyumluluk Rehberi (TR Mevzuatı)

SiriusMenu geliştirilirken dikkat edilmesi gereken Türkiye mevzuatı ve buna bağlı
yükümlülüklerin özeti. Bu dosya bir hukuki görüş değildir; geliştirme kararlarını
(checkbox, veri paylaşımı bildirimi, saklama süresi vb.) yönlendirmek için pratik bir
kontrol listesidir. Bağlayıcı metinler `app/kvkk-aydinlatma-metni`, `app/gizlilik-politikasi`
ve `app/kullanim-sartlari` sayfalarıdır — bu dosyadaki her kural değiştiğinde o sayfalar da
güncellenmelidir.

Veri sorumlusu **BY Sirius Group AI and Technology Co. Ltd.** (İngiltere merkezli) olup
Türkiye'de yerleşik kullanıcılara hizmet verdiği için hem **KVKK** hem de (İngiltere
merkezli olması sebebiyle) **UK GDPR** ilkeleri aynı anda uygulanır. KVKK, veri sorumlusunun
yurt dışında yerleşik olması yükümlülüğü ortadan kaldırmaz (KVKK m.3 "veri sorumlusu" tanımı
yerleşim yeri aramaz; ilgili kişi Türkiye'de ise kanun uygulanır).

## 1. KVKK (6698 sayılı Kanun)

- **Aydınlatma yükümlülüğü (m.10):** Veri işlenmeden önce kimlik, işleme amacı, kimlere
  aktarılacağı, toplama yöntemi/hukuki sebebi ve m.11 hakları bildirilmelidir.
  `app/kvkk-aydinlatma-metni` bunu karşılar, **ancak Faz-C ile eklenen Gemini (görsel
  iyileştirme + WhatsApp komut ayrıştırma) ve Evolution API (WhatsApp gateway) veri
  alıcıları olarak eksikti — bu conuşmada eklendi, madde 4'te "Google" ve "Evolution API /
  WhatsApp" olarak listeleniyor.** Yeni bir üçüncü taraf servis (ör. yeni bir AI sağlayıcı,
  analytics) eklendiğinde aydınlatma metnindeki alıcı listesi güncellenmeden prod'a
  çıkılmamalı.
- **Açık rıza vs. aydınlatma:** Hesap oluşturma/hizmet ifası (m.5/2-c), yasal yükümlülük
  (m.5/2-ç) ve meşru menfaat (m.5/2-f) hukuki sebepleri hesap/menü/ödeme verisi için
  yeterlidir — ayrı bir "açık rıza" checkbox'ı **gerekmez**. Açık rıza yalnızca **pazarlama
  amaçlı iletişim** (bkz. bölüm 2) için gerekir; hizmetin ifası açık rızaya bağlanamaz
  (bağlı onay/"bundling" yasaktır — Kurul kararları bu yönde istikrarlıdır).
- **VERBİS kaydı:** Veri Sorumluları Sicili kaydı, çalışan sayısı/yıllık mali bilanço
  eşiklerine ve yurt dışı yerleşiklik durumuna göre değişir; **yurt dışında yerleşik veri
  sorumluları için VERBİS kaydı istisnasız zorunludur** (eşik uygulanmaz). BY Sirius Group
  UK merkezli olduğundan VERBİS kaydının yapılmış olup olmadığı doğrulanmalı — kod
  tabanından tespit edilemez, muhasebe/hukuk danışmanıyla teyit edilmeli.
- **Yurt dışına veri aktarımı (m.9, 7499 sayılı Kanun ile 01.06.2024'te güncellendi):**
  Supabase, Stripe, Vercel, Google (Gemini) altyapıları büyük ihtimalle veriyi Türkiye
  dışında (AB/ABD) işliyor. Aktarım için Kurul'un yeterlilik kararı verdiği ülke, Kurul
  onaylı "Bağlayıcı Şirket Kuralları" veya (en yaygın uygulanabilir yol) Kurul'un yayınladığı
  **standart sözleşme (SCC)** imzalanıp Kurum'a bildirilmesi gerekir. Bu, her sağlayıcı için
  tek tek kontrol edilmeli; SCC yoksa aktarım teknik olarak hukuka aykırı kalır.
- **Veri işleyen sözleşmeleri:** Supabase, Stripe, Google (Gemini), Evolution API'yi
  barındıran sunucu ile (kendi sunucunuzdaysa) veri işleyen/gizlilik sözleşmelerinin
  (DPA) mevcut olduğu teyit edilmeli. Google AI Studio'nun ücretsiz katmanı (bkz. bölüm 5)
  DPA kapsamına girmeyebilir.
- **Saklama ve imha:** Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale
  Getirilmesi Hakkında Yönetmelik gereği yazılı bir saklama/imha politikası (periyodik imha
  süresi azami 6 ay) olmalı. Şu an `gizlilik-politikasi` sayfasında "makul süre içinde silinir"
  ifadesi var; somut bir süre (ör. hesap kapatıldıktan sonra 30/90 gün) belirlenip hem
  metne hem de silme işini yapan koda (varsa bir cron/cleanup route) yansıtılmalı.
- **Veri ihlali bildirimi:** KVK Kurumu'na **72 saat içinde**, etkilenen kişilere ise
  gecikmeksizin bildirim yükümlülüğü vardır (Veri İhlali Bildirim Usul ve Esasları
  Tebliği). Bir olay müdahale planı (kim bildirir, hangi kanal) dokümante edilmeli.

## 2. Ticari Elektronik İleti (6563 sayılı Kanun + Yönetmelik + İYS)

- E-posta/SMS/WhatsApp yoluyla **tanıtım, kampanya, indirim** içerikli mesaj göndermek için
  alıcının **önceden, açık ve ayrı** onayı (opt-in) şarttır. Bu onay:
  - **Diğer sözleşme şartlarıyla (KVKK aydınlatma, kullanım şartları) birlikte tek bir
    "kabul ediyorum" kutucuğuna bağlanamaz** — ayrı bir checkbox olmalı ve **varsayılan
    olarak işaretsiz** gelmelidir (önceden işaretlenmiş kutucuk = geçersiz onay).
  - Reddedilebilir/geri alınabilir olmalı; her iletide kolay bir "ret" bağlantısı/talimatı
    bulunmalı.
  - **1.000'den fazla alıcıya** ticari elektronik ileti gönderen hizmet sağlayıcılar **İYS
    (İleti Yönetim Sistemi)**'ne kayıt olmak ve onay/ret kayıtlarını İYS üzerinden
    yönetmek zorundadır (iys.org.tr). Kullanıcı tabanı büyüdükçe bu eşik izlenmeli.
  - Bu, işletme sahiplerine (SiriusMenu müşterilerine) gönderilecek pazarlama e-postaları
    içindir; menüyü görüntüleyen son müşteriler SiriusMenu'ye veri vermediği için bu
    kapsam dışıdır.
- **Bu konuşmada uygulandı:** `app/kayit/page.tsx` kayıt formuna zorunlu (Kullanım
  Şartları + KVKK Aydınlatma Metni okundu) ve **ayrı, varsayılan işaretsiz, opsiyonel**
  bir "kampanya/duyuru e-postası almak istiyorum" kutucuğu eklendi; onay zamanı
  `restaurants` tablosuna yazılıyor (bkz. `supabase/migrations/0005_consents.sql`).
  Gerçek pazarlama e-postaları gönderilmeye başlanırsa (şu an gönderilmiyor) İYS kaydı
  değerlendirilmeli.

## 3. E-Ticaret ve Abonelik Satışı

- SiriusMenu bir B2B SaaS'tır (restoran/kafe **işletmesine** satılır); müşteriler çoğunlukla
  tacir/esnaf sıfatıyla hareket eder. Ancak tek kişilik/esnaf işletme sahibi bazı durumlarda
  **6502 sayılı Tüketicinin Korunması Hakkında Kanun** kapsamında tüketici sayılabilir —
  özellikle işiyle doğrudan ilgisi olmayan bir hizmet alıyorsa. Bu risk düşük ama sıfır
  değil; mesafeli sözleşme ön bilgilendirme formu ve cayma hakkı istisnası (dijital
  içerik/hizmetin ifasına onay verilmesi hâlinde cayma hakkının düştüğü) net şekilde
  belirtilmeli. `kullanim-sartlari` sayfasında bu ayrım şu an yok; abonelik başlarken
  (Stripe checkout öncesi) "hizmetin hemen ifasına onay veriyorum, cayma hakkımın
  düştüğünü biliyorum" ibaresi eklenmesi önerilir.
- **Fatura/e-Arşiv:** Türkiye'de yerleşik müşterilerden tahsil edilen abonelik bedelleri
  için fatura kesme yükümlülüğü olabilir (satıcı yurt dışında olsa da KDV ve dijital hizmet
  vergisi mevzuatı ayrıca incelenmeli — bu tamamen muhasebe/vergi danışmanlığı konusudur,
  koddan çözülemez).
- **Fiyat gösterimi:** Landing/panelde gösterilen fiyatların KDV dahil/hariç olduğu net
  belirtilmeli (`app/lib/menu.tsx PRICING` ve landing metni kontrol edilmeli).

## 4. Kayıt Formu — Checkbox Gereksinimleri (uygulandı)

`app/kayit/page.tsx` şu üç onayı ayrı ayrı topluyor:

1. **Zorunlu** — "Kullanım Şartları'nı okudum ve kabul ediyorum" (link: `/kullanim-sartlari`)
2. **Zorunlu** — "KVKK Aydınlatma Metni'ni okudum" (link: `/kvkk-aydinlatma-metni`)
3. **Opsiyonel, varsayılan işaretsiz** — "Kampanya, indirim ve duyurulardan haberdar olmak
   istiyorum (ticari elektronik ileti izni)"

1-2 işaretlenmeden "Hesap oluştur" butonu pasif kalır. Onay anı ve pazarlama izni
`supabase.auth.signUp` çağrısında `options.data` üzerinden `handle_new_user()` trigger'ına
taşınır ve `restaurants` tablosunda (`kvkk_onay_at`, `kullanim_sartlari_onay_at`,
`pazarlama_izni`, `pazarlama_izni_at`) kalıcı olarak saklanır — ileride bir denetimde
"kullanıcı ne zaman neyi onayladı" sorusuna kanıt olarak gösterilebilir.

## 5. Kullanılan Programların/Servislerin Ticari Kullanıma Uygunluğu

Kodda tespit edilemeyen, **hesap/plan seviyesinde manuel doğrulanması gereken** kalemler:

| Servis | Kullanım amacı | Ticari kullanım notu |
|---|---|---|
| **Google Gemini API** (`GEMINI_API_KEY`) | Görsel iyileştirme, WhatsApp komut ayrıştırma, fotoğraftan menü OCR | Google AI Studio'nun **ücretsiz katmanı**, girdi/çıktıları model iyileştirme amacıyla kullanabileceğini belirtir ve genelde üretim/ticari uygulamalar için önerilmez. Prod'da **ücretli (pay-as-you-go) Gemini API** planına geçilmiş olmalı; aksi halde hem veri gizliliği hem de kota/SLA riski var. `.env` içindeki anahtarın hangi plana bağlı olduğu Google AI Studio / Google Cloud konsolundan doğrulanmalı. |
| **Evolution API + WhatsApp** (`docs/evolution-api-kurulum.md`) | WhatsApp üzerinden AI menü düzenleme | Evolution API, WhatsApp'ın **resmi olmayan (unofficial) Web protokolü**nü kullanan açık kaynak bir gateway'dir. Bu, Meta'nın WhatsApp Kullanım Şartları'nı ihlal edebilir ve **numaranın askıya alınması riski** taşır. Ticari/ölçekli kullanım için Meta'nın **resmi WhatsApp Business Platform (Cloud API)**'a geçiş değerlendirilmeli; en azından bu risk kullanıcıya (işletme sahibine) açıkça bildirilmeli (`docs/evolution-api-kurulum.md` içinde bir uyarı satırı önerilir). |
| **Supabase** | Veritabanı, auth, storage | Ücretsiz (Free) plan; ticari/prod trafik ve KVKK'nın öngördüğü SLA/DPA garantileri için **Pro plan** (veya üzeri) ve Supabase'in Data Processing Addendum'unun imzalanmış olması önerilir. |
| **Stripe** | Ödeme/abonelik | Stripe hesabının **ticari (business) hesap** olarak doğrulanmış (KYB tamamlanmış) olması, canlı anahtarların (`sk_live_`) yalnızca doğrulama sonrası aktifleşeceği unutulmamalı. |
| **Vercel** | Barındırma | Hobby plan ticari proje için **Terms of Service gereği uygun değildir** — Vercel Hobby planı yalnızca kişisel/ticari olmayan projeler içindir. Prod'a çıkan bir SaaS için **Pro plan** zorunlu. |
| **Next.js / React / diğer npm paketleri** (`package.json`) | Uygulama çatısı | MIT lisanslı, ticari kullanıma serbest — ek aksiyon gerekmez. |
| **Google Fonts** (varsa) | Tipografi | Ücretsiz, ticari kullanıma açık (OFL/Apache lisansları) — ek aksiyon gerekmez. |
| **Anthropic API** (`ANTHROPIC_API_KEY`, "AI açıklama") | Ürün açıklaması üretimi | Anthropic API zaten ücretli/ticari kullanım içindir, ek aksiyon gerekmez; sadece aydınlatma metninde alıcı olarak zaten listeli. |

**Aksiyon:** Yukarıdaki tablodaki "Free/Hobby plan" ve "resmi olmayan API" satırları
(Gemini ücretsiz katman, Vercel Hobby, Evolution API/WhatsApp riski) prod'a çıkmadan önce
tek tek kapatılmalı; bu konuşma kapsamında yalnızca **kod ve hukuki metin tarafı**
(checkbox + aydınlatma metni güncellemesi) yapıldı, **hesap/plan doğrulaması kullanıcı
tarafından ayrıca yapılmalıdır.**

## 6. Çerezler (Cookies)

Şu an yalnızca Supabase auth oturum çerezi (kesinlikle gerekli/teknik çerez) kullanılıyor;
KVKK/e-Ticaret mevzuatında kesinlikle gerekli çerezler için ayrı bir "çerez onayı" banner'ı
gerekmez. **Eğer ileride Google Analytics, Meta Pixel vb. bir izleme/analitik aracı
eklenirse**, o an açık rıza tabanlı bir çerez onay banner'ı ve `app/gizlilik-politikasi`
sayfasına bir "Çerezler" bölümü eklenmesi zorunlu hale gelir — bu commit'te böyle bir araç
eklenmedi, bu yüzden banner eklenmedi.

## 7. Genel Kontrol Listesi (her yeni özellikte tekrar sorulacak sorular)

- [ ] Yeni bir üçüncü taraf servise veri gönderiliyor mu? → aydınlatma metni + gizlilik
      politikası "Kimlerle paylaşıyoruz" bölümü güncellenmeli.
- [ ] Yeni özellik pazarlama/tanıtım amaçlı mesaj gönderiyor mu? → ayrı, varsayılan
      işaretsiz açık rıza checkbox'ı olmadan gönderim yapılmamalı; İYS eşiği kontrol
      edilmeli.
- [ ] Yeni özellik yurt dışına veri aktarıyor mu? → SCC/yeterlilik kararı kapsamında mı,
      teyit edilmeli.
- [ ] Kullanılan yeni servisin ücretsiz/deneme planı ticari kullanımı yasaklıyor mu? →
      ToS kontrol edilmeli (bölüm 5'teki tablo gibi).
- [ ] Kişisel veri saklama süresi belirlendi mi, imha planına eklendi mi?
