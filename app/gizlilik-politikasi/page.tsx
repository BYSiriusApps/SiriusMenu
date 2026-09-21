import type { Metadata } from "next";
import { LegalLayout } from "../lib/legal/LegalLayout";

export const metadata: Metadata = { title: "Gizlilik Politikası — SiriusMenu" };

export default function GizlilikPolitikasi() {
  return (
    <LegalLayout title="Gizlilik Politikası" updated="21 Eylül 2026">
      <h2>1. Veri Sorumlusu</h2>
      <p>
        Bu gizlilik politikası, <strong>SiriusMenu</strong> (QR menü platformu) hizmetini yürüten{" "}
        <strong>BY Sirius Group AI and Technology Co. Ltd.</strong> (Companies House No: 17142392, 71-75 Shelton
        Street, Covent Garden, London, WC2H 9JQ, United Kingdom, &quot;SiriusMenu&quot;, &quot;biz&quot;) tarafından
        işletilen siriusmenu.com hizmeti ve alt sayfaları için geçerlidir. SiriusMenu, Türkiye&apos;de yerleşik
        kullanıcılara hizmet sunduğu için 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ile
        uyumlu şekilde, hizmetlerin genel işleyişi bakımından ise İngiltere mevzuatı ve GDPR ilkeleri çerçevesinde
        hareket eder.
      </p>

      <h2>2. Hangi Verileri Topluyoruz</h2>
      <ul>
        <li><strong>Hesap bilgileri:</strong> e-posta adresi, şifre (şifrelenmiş/hash olarak saklanır).</li>
        <li><strong>İşletme/menü bilgileri:</strong> restoran/kafe adı, alt başlık, logo görseli, menü kategorileri, ürün adı-fiyat-açıklama-etiket verileri.</li>
        <li><strong>Abonelik ve ödeme durumu:</strong> plan durumu (deneme/aktif), Stripe üzerinden oluşturulan müşteri ve abonelik kimlikleri. Kart numarası gibi ödeme bilgileri bizim sunucularımızda tutulmaz; doğrudan Stripe tarafından işlenir.</li>
        <li><strong>Teknik veriler:</strong> oturum çerezi, IP adresi, tarayıcı bilgisi (temel işlevsellik ve güvenlik için).</li>
        <li><strong>Opsiyonel AI açıklama isteği:</strong> &quot;AI açıklama&quot; özelliğini kullanırsan girdiğin ürün adı, açıklama üretimi için üçüncü taraf yapay zeka sağlayıcısına iletilir.</li>
        <li><strong>Ürün fotoğrafları:</strong> görsel iyileştirme veya fotoğraftan menü aktarma özelliklerini kullanırsan yüklediğin fotoğraflar işlenmek üzere Google (Gemini API) sağlayıcısına iletilir.</li>
        <li><strong>WhatsApp mesajları (opsiyonel):</strong> WhatsApp üzerinden AI ile menü düzenleme özelliğini bağlarsan, ilgili telefon numarası ve gönderdiğin mesaj içeriği, mesajları işleyen Evolution API (WhatsApp ağ geçidi) altyapısı ve komutu yorumlayan Google (Gemini API) ile paylaşılır.</li>
      </ul>
      <p>Menüye yüklediğin ürün/fiyat bilgileri, işletmenin herkese açık menü sayfasında (yayınladığın takdirde) ziyaretçiler tarafından görülebilir; bu içerik senin kontrolündedir.</p>

      <h2>3. Verileri Neden İşliyoruz</h2>
      <ul>
        <li>Hesabını oluşturmak, kimliğini doğrulamak ve panelini güvenli şekilde sunmak,</li>
        <li>QR menü hizmetini çalıştırmak (menü barındırma, herkese açık menü sayfası, QR üretimi),</li>
        <li>Abonelik ve ödeme süreçlerini Stripe üzerinden yönetmek,</li>
        <li>Destek taleplerine yanıt vermek ve hizmetle ilgili önemli bildirimleri iletmek,</li>
        <li>Hizmeti güvenli tutmak, kötüye kullanımı önlemek ve yasal yükümlülükleri yerine getirmek.</li>
      </ul>
      <p>Bu işlemlerin hukuki dayanağı; aramızdaki hizmet sözleşmesinin kurulması ve ifası, meşru menfaatlerimiz (güvenlik, hizmet iyileştirme) ve yasal yükümlülüklerimizdir.</p>

      <h2>4. Verileri Kimlerle Paylaşıyoruz</h2>
      <p>Verilerini pazarlama amacıyla satmıyor veya kiralamıyoruz. Hizmeti sunabilmek için aşağıdaki hizmet sağlayıcılarla (veri işleyen sıfatıyla) sınırlı ölçüde paylaşım yapılır:</p>
      <ul>
        <li><strong>Supabase</strong> — veritabanı, kimlik doğrulama ve dosya depolama altyapısı,</li>
        <li><strong>Stripe</strong> — abonelik ve ödeme işlemleri,</li>
        <li><strong>Vercel</strong> — uygulama barındırma altyapısı,</li>
        <li><strong>Anthropic</strong> — yalnızca &quot;AI açıklama&quot; özelliğini kullanırsan, ürün adı bazında,</li>
        <li><strong>Google (Gemini API)</strong> — ürün fotoğrafı iyileştirme, fotoğraftan menü aktarma ve WhatsApp komut yorumlama özelliklerini kullanırsan,</li>
        <li><strong>Evolution API</strong> — WhatsApp üzerinden AI menü düzenleme özelliğini bağlarsan, WhatsApp mesajlarının iletilmesi için.</li>
      </ul>
      <p>Bu sağlayıcılar verilerini yalnızca bizim adımıza, belirtilen amaçlarla işler; kendi pazarlama amaçları için kullanamaz.</p>

      <h2>5. Verileri Ne Kadar Süre Saklıyoruz</h2>
      <p>Hesabın aktif olduğu sürece verilerin saklanır. Hesabını sildiğinde işletme ve menü verilerin makul bir süre içinde silinir; yasal saklama yükümlülüğü bulunan kayıtlar (örn. fatura/ödeme kayıtları) ilgili mevzuatın öngördüğü süre boyunca Stripe nezdinde saklanabilir.</p>

      <h2>6. Haklarınız</h2>
      <p>KVKK m.11 kapsamında; verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme, yurt içi/dışı aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini isteme ve itiraz hakların bulunmaktadır.</p>
      <p>Bu haklarını kullanmak için <a href="mailto:info@bysirius.com">info@bysirius.com</a> adresine yazılı olarak başvurabilirsin. Taleplerin en geç 30 gün içinde sonuçlandırılır.</p>

      <h2>7. Değişiklikler</h2>
      <p>Bu politika zaman zaman güncellenebilir; önemli değişikliklerde panel üzerinden veya e-posta ile bilgilendirileceksin.</p>
    </LegalLayout>
  );
}
