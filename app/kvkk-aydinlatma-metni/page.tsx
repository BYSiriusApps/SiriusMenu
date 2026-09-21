import type { Metadata } from "next";
import { LegalLayout } from "../lib/legal/LegalLayout";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni — SiriusMenu" };

export default function KvkkAydinlatmaMetni() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" updated="30 Temmuz 2026">
      <p>
        Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) m.10 uyarınca, veri
        sorumlusu sıfatıyla <strong>BY Sirius Group AI and Technology Co. Ltd.</strong> (Companies House No: 17142392,
        71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom) tarafından işletilen{" "}
        <strong>SiriusMenu</strong> platformu kullanıcılarının bilgilendirilmesi amacıyla hazırlanmıştır.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        BY Sirius Group AI and Technology Co. Ltd. — <a href="mailto:info@bysirius.com">info@bysirius.com</a>
      </p>

      <h2>2. İşlenen Kişisel Veri Kategorileri</h2>
      <table>
        <thead>
          <tr><th>Kategori</th><th>Örnek Veriler</th></tr>
        </thead>
        <tbody>
          <tr><td>Kimlik ve iletişim</td><td>E-posta adresi</td></tr>
          <tr><td>Müşteri işlem</td><td>Abonelik durumu, Stripe müşteri/abonelik kimliği</td></tr>
          <tr><td>İşlem güvenliği</td><td>Şifre (hash), oturum çerezi, IP adresi</td></tr>
          <tr><td>Mesleki/işletme verisi</td><td>Restoran/kafe adı, logo, menü içeriği (kullanıcı tarafından girilir)</td></tr>
        </tbody>
      </table>
      <p>SiriusMenu, menüsünü hazırlayan işletme sahibinin (kullanıcının) hesap verilerini işler; menüyü görüntüleyen son müşterilerden ayrıca kişisel veri toplanmaz.</p>

      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Kullanıcı hesabının oluşturulması ve kimlik doğrulaması,</li>
        <li>SiriusMenu hizmetinin (menü barındırma, QR üretimi, herkese açık menü sayfası) sunulması,</li>
        <li>Abonelik ve ödeme süreçlerinin Stripe altyapısı üzerinden yürütülmesi,</li>
        <li>Talep ve şikâyetlerin yanıtlanması, müşteri desteği sağlanması,</li>
        <li>Hizmet güvenliğinin sağlanması ve kötüye kullanımın önlenmesi,</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
      </ul>

      <h2>4. Kişisel Verilerin Aktarılabileceği Taraflar ve Amaçları</h2>
      <p>Verilerin, yukarıdaki amaçlarla sınırlı olmak üzere hizmet sağlayıcılarımız Supabase (veritabanı/kimlik doğrulama), Stripe (ödeme işlemcisi) ve Vercel (barındırma) ile; &quot;AI açıklama&quot; özelliği kullanıldığında ise yalnızca ilgili ürün adı bakımından Anthropic ile paylaşılabilir. Bu aktarımlar KVKK m.8 ve m.9 kapsamında, hizmetin ifası için gerekli olan asgari veriyle sınırlıdır.</p>

      <h2>5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
      <p>Kişisel verilerin, SiriusMenu web/panel uygulaması üzerinden doğrudan senin tarafından girilmesi suretiyle, elektronik ortamda toplanır. Hukuki sebepleri: KVKK m.5/2-c (sözleşmenin kurulması/ifasıyla doğrudan ilgili olması), m.5/2-ç (hukuki yükümlülüğün yerine getirilmesi) ve m.5/2-f (meşru menfaat) hükümleridir.</p>

      <h2>6. KVKK m.11 Kapsamındaki Haklarınız</h2>
      <p>İlgili kişi sıfatıyla; kişisel verinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, KVKK ve ilgili mevzuat hükümlerine uygun olarak işlenmiş olmasına rağmen işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde silinmesini/yok edilmesini isteme, aktarıldığı üçüncü kişilere yukarıdaki değişikliklerin bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi sonucu aleyhine bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğraman hâlinde zararın giderilmesini talep etme haklarına sahipsin.</p>
      <p>Başvurularını <a href="mailto:info@bysirius.com">info@bysirius.com</a> adresine yazılı olarak iletebilirsin; talepler en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.</p>
    </LegalLayout>
  );
}
