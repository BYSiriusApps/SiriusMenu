import type { Metadata } from "next";
import { LegalLayout } from "@/app/lib/legal/LegalLayout";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi, SiriusMenu" };

export default function MesafeliSatisSozlesmesi() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" updated="13 Ekim 2026">
      <p>Bu sözleşme, SiriusMenu hizmetlerinin (abonelikler, tek seferlik Ömür Boyu Menü, anahtar teslim kurulum hizmeti, görsel paketleri ve toplu iyileştirme) uzaktan iletişim araçları (web sitesi) kullanılarak satın alınması hâlinde satıcı ve alıcı arasındaki koşulları düzenler. Ödeme adımından önce açılan onay penceresinde bu metni, ön bilgilendirme formunu ve iade politikasını onaylarsın; onayın sürüm, tarih ve IP bilgisiyle kayda alınır.</p>

      <h2 id="on-bilgilendirme">Ön Bilgilendirme Formu (Mesafeli Sözleşmeler Yönetmeliği m.5)</h2>
      <ul>
        <li><strong>Satıcı:</strong> BY Sirius Group AI and Technology Co. Ltd., 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom, <a href="mailto:info@bysirius.com">info@bysirius.com</a>.</li>
        <li><strong>Hizmetin temel nitelikleri:</strong> QR menü barındırma ve düzenleme paneli; seçtiğin pakete göre madde 3&apos;te listelenir.</li>
        <li><strong>Toplam bedel:</strong> Ödeme ekranında gösterilen tutardır (vergiler dâhil). İlk abonelikte tek seferlik kurulum bedeli ödeme ekranında ayrı kalem olarak yer alır.</li>
        <li><strong>Ödeme ve ifa:</strong> Kart ile Stripe üzerinden; hizmet ödeme onayı sonrası anında etkinleştirilir. Fiziksel teslimat yoktur.</li>
        <li><strong>Cayma hakkı:</strong> Anında ifa edilen dijital hizmetlerde, onayınla ifaya başlandığı için cayma hakkı yoktur (madde 5).</li>
        <li><strong>Şikâyet ve başvuru:</strong> <a href="mailto:info@bysirius.com">info@bysirius.com</a>; uyuşmazlıkta madde 7&apos;deki yetkili merciler.</li>
      </ul>

      <h2>1. Taraflar</h2>
      <p><strong>Satıcı:</strong> BY Sirius Group AI and Technology Co. Ltd., Companies House No: 17142392, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom, <a href="mailto:info@bysirius.com">info@bysirius.com</a></p>
      <p><strong>Alıcı:</strong> SiriusMenu platformunda hesap açarak abonelik veya hizmet satın alan gerçek veya tüzel kişi (&quot;Kullanıcı&quot;). Hizmet, işletmelerin ticari/mesleki faaliyetlerinde kullanılmak üzere sunulur.</p>

      <h2>2. Konu</h2>
      <p>İşbu sözleşmenin konusu, Kullanıcı&apos;nın SiriusMenu web sitesi üzerinden elektronik ortamda sipariş verdiği SiriusMenu abonelikleri ve satın alınan diğer hizmetlerin satışı ve ifasına ilişkin tarafların hak ve yükümlülüklerinin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri doğrultusunda belirlenmesidir.</p>

      <h2>3. Hizmetin Özellikleri ve Bedeli</h2>
      <ul>
        <li><strong>Abonelik (Temel / Full / Profesyonel, aylık veya yıllık):</strong> menü barındırma, temalar, logo, anlık güncelleme, QR kod üretimi. Temel plan yalnızca QR menü ve panel düzenlemesini içerir; WhatsApp ile güncelleme ve aylık AI görsel kotası Full ve Profesyonel planlara dâhildir. İlk abonelikte tek seferlik kurulum bedeli eklenir.</li>
        <li><strong>Anahtar teslim kurulum hizmeti (tek seferlik):</strong> menünün SiriusMenu tarafından hazırlanması. Bedel; ürün sayısına ve Kullanıcı&apos;nın sağladığı içeriğe göre (hazır menünün taşınması, fotoğraf iyileştirme, görsel üretimi veya sıfırdan hazırlık) ödeme ekranında gösterilir. Yapay zekâ ile üretilen görseller ürünü temsil eder ve menüde &quot;Görsel temsilidir&quot; etiketiyle gösterilir; Kullanıcı ilettiği fotoğraf, logo ve metinlerin kullanım hakkına sahip olduğunu beyan eder. Hizmet abonelik veya Ömür Boyu Menü yerine geçmez, bunlara ek olarak satın alınır.</li>
        <li><strong>Tek Seferlik (Ömür Boyu Menü):</strong> abonelik gerektirmeyen kalıcı düzenleme hakkı; belirtilen ürün adedini aşan menüler için ek blok bedeli uygulanır. WhatsApp otomasyonu ve AI görsel kotası dâhil değildir.</li>
        <li><strong>Görsel paketi / toplu iyileştirme:</strong> tek seferlik, satın alınan kredi adedi kadar AI görsel iyileştirme hakkı.</li>
        <li><strong>Bedel:</strong> Panelde ve ödeme ekranında belirtilen güncel tutarlar geçerlidir; ödeme ekranındaki toplam, sipariş anındaki bağlayıcı bedeldir.</li>
        <li><strong>Yenileme:</strong> Abonelikler seçilen dönemde otomatik yenilenir; istediğin an iptal edebilirsin, iptal sonraki dönem tahsilatını durdurur.</li>
        <li><strong>Ödeme şekli:</strong> Kredi/banka kartı ile Stripe altyapısı üzerinden; abonelikte tekrarlayan (recurring), diğer ürünlerde tek seferlik tahsilat.</li>
      </ul>

      <h2>4. İfa Şekli ve Süresi</h2>
      <p>Abonelik, Ömür Boyu Menü ve görsel paketleri ödemenin onaylanmasının hemen ardından elektronik ortamda ve anında (Kullanıcı hesabında ilgili özelliklerin aktifleşmesi suretiyle) ifa edilir. Anahtar teslim kurulum hizmeti anında ifa edilmez; içerik teslimine bağlı olarak makul bir sürede (hedef: 5 iş günü) hazırlanır ve Kullanıcı&apos;ya panelden teslim edilir. Hizmetin fiziksel bir teslimatı yoktur.</p>

      <h2>5. Cayma Hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ uyarınca; elektronik ortamda anında ifa edilen hizmetler ve
        tüketiciye anında teslim edilen gayrimaddi mallara (dijital hizmetlere) ilişkin sözleşmelerde, Kullanıcı&apos;nın
        onayı ile ifaya başlanmış olması hâlinde cayma hakkı kullanılamaz. Abonelik, Ömür Boyu Menü ve görsel paketleri satın alma anında
        etkinleştirildiğinden ve Kullanıcı bu ifaya açıkça onay verdiğinden, ödeme sonrası cayma hakkı bulunmamaktadır.
      </p>
      <p>Anahtar teslim kurulum hizmeti anında ifa edilmediğinden yukarıdaki istisna ona uygulanmaz: çalışma başlamadan önce yapılan iptal talebinde bedel tam iade edilir; çalışma başladıktan sonra, yapılan işin oranı düşülerek kalan bedel iade edilir.</p>
      <p>Bununla birlikte, aboneliğini istediğin an panel üzerinden iptal edebilirsin (bkz. İade &amp; İptal Politikası); iptal, gelecek dönem tahsilatını durdurur.</p>

      <h2>6. Temerrüt ve Askıya Alma</h2>
      <p>Otomatik yenileme sırasında ödemenin alınamaması hâlinde, Kullanıcı bilgilendirilir ve makul bir süre sonunda ücretli özellikler askıya alınarak hesap Deneme plan koşullarına döner. Menü verileri silinmez.</p>

      <h2>7. Uyuşmazlıkların Çözümü</h2>
      <p>İşbu sözleşmeden doğan uyuşmazlıklarda, Kullanıcı&apos;nın tüketici sıfatını haiz olduğu hâllerde Ticaret Bakanlığı&apos;nca ilan edilen parasal sınırlar dâhilinde tüketici hakem heyetleri ve/veya tüketici mahkemeleri; diğer hâllerde İstanbul ve Antalya mahkemeleri ve icra daireleri yetkilidir.</p>

      <h2>8. Yürürlük</h2>
      <p>Kullanıcı, ödeme öncesi onay penceresindeki kutucukları işaretleyerek ön bilgilendirme formunu okuduğunu, işbu sözleşmeyi kabul ettiğini ve hizmetin hemen ifasına onay verdiğini beyan eder. Onay kaydı (sürüm, zaman, IP) elektronik ortamda saklanır ve talep hâlinde sağlanır. Sözleşmenin kalıcı bir kopyasına bu sayfadan her zaman erişebilirsin.</p>
    </LegalLayout>
  );
}
