import type { Metadata } from "next";
import { LegalLayout } from "../lib/legal/LegalLayout";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi — SiriusMenu" };

export default function MesafeliSatisSozlesmesi() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" updated="30 Temmuz 2026">
      <p>Bu sözleşme, SiriusMenu Pro aboneliğinin uzaktan iletişim araçları (web sitesi) kullanılarak satın alınması hâlinde satıcı ve alıcı arasındaki koşulları düzenler.</p>

      <h2>1. Taraflar</h2>
      <p><strong>Satıcı:</strong> BY Sirius Group AI and Technology Co. Ltd. — Companies House No: 17142392, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom — <a href="mailto:info@bysirius.com">info@bysirius.com</a></p>
      <p><strong>Alıcı:</strong> SiriusMenu platformunda hesap açarak Pro aboneliği satın alan gerçek veya tüzel kişi (&quot;Kullanıcı&quot;). Hizmet, işletmelerin ticari/mesleki faaliyetlerinde kullanılmak üzere sunulur.</p>

      <h2>2. Konu</h2>
      <p>İşbu sözleşmenin konusu, Kullanıcı&apos;nın SiriusMenu web sitesi üzerinden elektronik ortamda sipariş verdiği &quot;SiriusMenu Pro&quot; abonelik hizmetinin satışı ve ifasına ilişkin tarafların hak ve yükümlülüklerinin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri doğrultusunda belirlenmesidir.</p>

      <h2>3. Hizmetin Özellikleri ve Bedeli</h2>
      <ul>
        <li><strong>Hizmet:</strong> SiriusMenu Pro — geniş menülere uygun ürün/kategori desteği, tüm menü temaları, logo ekleme, anlık güncelleme, QR kod üretimi.</li>
        <li><strong>Bedel:</strong> Panelde/ödeme ekranında belirtilen aylık tutar (sözleşme tarihi itibarıyla 999 TL/ay), tüm vergiler dâhildir.</li>
        <li><strong>Fatura/Ödeme dönemi:</strong> Aylık, otomatik yenilenen abonelik.</li>
        <li><strong>Ödeme şekli:</strong> Kredi/banka kartı ile Stripe altyapısı üzerinden, tekrarlayan (recurring) tahsilat.</li>
      </ul>

      <h2>4. İfa Şekli ve Süresi</h2>
      <p>Hizmet, ödemenin onaylanmasının hemen ardından elektronik ortamda ve anında (Kullanıcı hesabında Pro özelliklerin aktifleşmesi suretiyle) ifa edilir. Hizmetin fiziksel bir teslimatı yoktur.</p>

      <h2>5. Cayma Hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ uyarınca; elektronik ortamda anında ifa edilen hizmetler ve
        tüketiciye anında teslim edilen gayrimaddi mallara (dijital hizmetlere) ilişkin sözleşmelerde, Kullanıcı&apos;nın
        onayı ile ifaya başlanmış olması hâlinde cayma hakkı kullanılamaz. SiriusMenu Pro aboneliği, satın alma anında
        etkinleştirildiğinden ve Kullanıcı bu ifaya açıkça onay verdiğinden, ödeme sonrası cayma hakkı bulunmamaktadır.
      </p>
      <p>Bununla birlikte, aboneliğini istediğin an panel üzerinden iptal edebilirsin (bkz. İade &amp; İptal Politikası); iptal, gelecek dönem tahsilatını durdurur.</p>

      <h2>6. Temerrüt ve Askıya Alma</h2>
      <p>Otomatik yenileme sırasında ödemenin alınamaması hâlinde, Kullanıcı bilgilendirilir ve makul bir süre sonunda Pro özellikleri askıya alınarak hesap Deneme plan koşullarına döner. Menü verileri silinmez.</p>

      <h2>7. Uyuşmazlıkların Çözümü</h2>
      <p>İşbu sözleşmeden doğan uyuşmazlıklarda, Kullanıcı&apos;nın tüketici sıfatını haiz olduğu hâllerde Ticaret Bakanlığı&apos;nca ilan edilen parasal sınırlar dâhilinde tüketici hakem heyetleri ve/veya tüketici mahkemeleri; diğer hâllerde İstanbul ve Antalya mahkemeleri ve icra daireleri yetkilidir.</p>

      <h2>8. Yürürlük</h2>
      <p>Kullanıcı, ödeme adımını tamamlayarak işbu sözleşmenin tüm hükümlerini okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
    </LegalLayout>
  );
}
