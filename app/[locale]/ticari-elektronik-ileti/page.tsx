import type { Metadata } from "next";
import { LegalLayout } from "@/app/lib/legal/LegalLayout";

export const metadata: Metadata = { title: "Ticari Elektronik İleti Onay Metni — SiriusMenu" };

export default function TicariElektronikIleti() {
  return (
    <LegalLayout title="Ticari Elektronik İleti Onay Metni" updated="1 Ekim 2026">
      <p>
        Bu metin, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve Ticari İletişim ve Ticari Elektronik
        İletiler Hakkında Yönetmelik kapsamında, <strong>BY Sirius Group AI and Technology Co. Ltd.</strong> (SiriusMenu)
        tarafından gönderilecek ticari elektronik iletilere ilişkin bilgilendirme ve onay koşullarını içerir.
      </p>

      <h2>1. Onay Kapsamı</h2>
      <p>Kayıt sırasında işaretlediğin isteğe bağlı kutucukla; e-posta adresine kampanya, indirim, yeni özellik ve duyuru içerikli ticari elektronik iletiler gönderilmesine onay vermiş olursun. Bu onay hizmeti kullanmanın şartı değildir; işaretlemeden de tüm hizmetlerden yararlanabilirsin.</p>

      <h2>2. Onayı Geri Alma (Ret)</h2>
      <p>Onayını istediğin zaman, hiçbir gerekçe göstermeden ve ücretsiz geri alabilirsin: gönderilen her iletideki ret bağlantısıyla veya <a href="mailto:info@bysirius.com">info@bysirius.com</a> adresine yazarak. Ret talebin en geç 3 iş günü içinde uygulanır.</p>

      <h2>3. Hizmet Mesajları</h2>
      <p>Hesap doğrulama, ödeme/fatura bildirimi ve hizmet kesintisi gibi hizmete ilişkin zorunlu bilgilendirmeler ticari elektronik ileti sayılmaz ve onaya bağlı değildir.</p>

      <h2>4. Kayıt ve Veri</h2>
      <p>Onayının verildiği tarih ve saat hesabınla ilişkilendirilerek saklanır. Kişisel verilerin işlenmesi hakkında ayrıntı için <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>&apos;ne bakabilirsin.</p>
    </LegalLayout>
  );
}
