import type { Metadata } from "next";
import { LegalLayout } from "@/app/lib/legal/LegalLayout";

export const metadata: Metadata = { title: "İade & İptal Politikası — SiriusMenu" };

export default function IadeIptalPolitikasi() {
  return (
    <LegalLayout title="İade & İptal Politikası" updated="30 Temmuz 2026">
      <h2>1. Deneme Planı</h2>
      <p>Deneme planı tamamen ücretsizdir; kredi kartı bilgisi istenmez. Menünü oluşturup önizleyebilir, QR kodunu indirebilirsin. Ücretsiz plandan herhangi bir ücret tahsil edilmediği için iade söz konusu değildir.</p>

      <h2>2. Pro Plan İptali</h2>
      <ul>
        <li>Pro aboneliğini panel üzerinden (Stripe müşteri portalı) istediğin an, herhangi bir gerekçe göstermeden iptal edebilirsin.</li>
        <li>İptal ettiğinde, halihazırda ödediğin dönemin sonuna kadar Pro özelliklerini kullanmaya devam edersin; sonraki dönem için tekrar ücret tahsil edilmez.</li>
        <li>İptal sonrası hesabın otomatik olarak Deneme plan koşullarına döner; menü verilerin silinmez.</li>
      </ul>

      <h2>3. Ücret İadesi</h2>
      <p>
        SiriusMenu Pro, elektronik ortamda anında ifa edilen bir dijital hizmettir ve ödeme onaylandığı anda
        etkinleştirilir. Bu nedenle, <strong>kullanılmış olan mevcut abonelik dönemi için ücret iadesi yapılmaz</strong>{" "}
        (bkz. Mesafeli Satış Sözleşmesi m.5 — cayma hakkı istisnası). Yanlışlıkla yapılan çift tahsilat veya teknik
        bir hata sonucu oluşan hatalı ödemeler, tarafımıza bildirilmesi hâlinde incelenir ve haklı bulunması durumunda
        iade edilir.
      </p>

      <h2>4. Hizmet Kaynaklı Sorunlar</h2>
      <p>SiriusMenu&apos;den kaynaklanan uzun süreli bir hizmet kesintisi veya ciddi bir teknik arıza yaşanması hâlinde, etkilenen süreye orantılı bir ücret iadesi veya sonraki döneme mahsup talebini değerlendiririz. Bu tür durumlar için <a href="mailto:info@bysirius.com">info@bysirius.com</a> adresine yazabilirsin.</p>

      <h2>5. İptal/İade Talebi Nasıl Yapılır</h2>
      <p>Abonelik iptali panelindeki &quot;Aboneliği Yönet&quot; bağlantısından Stripe müşteri portalına yönlenerek anında yapılabilir. İade talepleri için <a href="mailto:info@bysirius.com">info@bysirius.com</a> adresine, hesabına bağlı e-posta adresinden yazman yeterlidir; talepler en geç 14 gün içinde yanıtlanır.</p>
    </LegalLayout>
  );
}
