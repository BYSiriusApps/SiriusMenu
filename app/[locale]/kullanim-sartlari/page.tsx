import type { Metadata } from "next";
import { LegalLayout } from "@/app/lib/legal/LegalLayout";

export const metadata: Metadata = { title: "Kullanım Şartları — SiriusMenu" };

export default function KullanimSartlari() {
  return (
    <LegalLayout title="Kullanım Şartları" updated="30 Temmuz 2026">
      <p>
        Bu Kullanım Şartları, <strong>BY Sirius Group AI and Technology Co. Ltd.</strong> (Companies House No:
        17142392, Londra, İngiltere, &quot;SiriusMenu&quot;) tarafından işletilen SiriusMenu platformunun kullanımına
        ilişkin koşulları düzenler. Hesap oluşturarak veya hizmeti kullanarak bu şartları kabul etmiş olursun.
      </p>

      <h2>1. Hizmetin Tanımı</h2>
      <p>SiriusMenu; kafe, restoran ve benzeri işletmelerin menülerini dijital ortamda oluşturup QR kod aracılığıyla müşterilerine sunmasını sağlayan bir SaaS (yazılım hizmeti) platformudur. Hizmet, ücretsiz Deneme planı ve ücretli Pro plan olmak üzere iki şekilde sunulur.</p>

      <h2>2. Hesap Oluşturma ve Güvenlik</h2>
      <ul>
        <li>Hesap açmak için doğru ve güncel bir e-posta adresi vermelisin.</li>
        <li>Hesabına ait şifre ve erişim bilgilerinin gizliliğinden sen sorumlusun.</li>
        <li>Hesabın üzerinden gerçekleşen tüm işlemlerden hesap sahibi sorumludur.</li>
      </ul>

      <h2>3. Kullanıcı İçeriği ve Yükümlülükleri</h2>
      <p>Menüne eklediğin ürün adı, açıklama, fiyat, logo gibi tüm içerikler (&quot;Kullanıcı İçeriği&quot;) sana aittir ve senin sorumluluğundadır. Kullanıcı İçeriği&apos;nin:</p>
      <ul>
        <li>Doğru ve güncel olmasından,</li>
        <li>Üçüncü kişilerin fikri mülkiyet haklarını ihlal etmemesinden,</li>
        <li>Yasa dışı, yanıltıcı veya hakaret içeren nitelikte olmamasından</li>
      </ul>
      <p>sen sorumlusun. Bu kurallara aykırı içerik tespit edilirse ilgili içeriği kaldırma veya hesabı askıya alma hakkımız saklıdır.</p>

      <h2>4. Abonelik, Ücretlendirme ve Ödeme</h2>
      <ul>
        <li>Pro plan, aylık 999 TL&apos;den başlayan (veya panelde belirtilen güncel tutar) karşılığında, Stripe altyapısı üzerinden otomatik yenilenen bir abonelik olarak sunulur.</li>
        <li>Ödeme bilgilerin (kart numarası vb.) bizim sunucularımızda tutulmaz; doğrudan Stripe tarafından işlenir.</li>
        <li>Aboneliğini panel üzerinden (Stripe müşteri portalı aracılığıyla) istediğin zaman iptal edebilirsin; iptal, mevcut ödenmiş dönemin sonunda yürürlüğe girer.</li>
        <li>Fiyatlar önceden haber verilerek güncellenebilir; mevcut abonelik döneminde fiyat değişikliği geriye dönük uygulanmaz.</li>
      </ul>

      <h2>5. Fikri Mülkiyet</h2>
      <p>SiriusMenu yazılımı, tasarımı, marka ve logosu BY Sirius Group AI and Technology Co. Ltd.&apos;ye aittir ve izinsiz kopyalanamaz, çoğaltılamaz veya tersine mühendisliğe tabi tutulamaz. Kullanıcı İçeriği üzerindeki haklar kullanıcıda kalır; sen bize yalnızca hizmeti sunabilmemiz için gerekli ölçüde (barındırma, görüntüleme) kullanım izni vermiş olursun.</p>

      <h2>6. Hizmetin Kapsamı ve Garantiler</h2>
      <p>Hizmet &quot;olduğu gibi&quot; sunulur. Kesintisiz veya hatasız çalışacağına dair açık bir garanti verilmez; ancak makul özen ve süreklilik için gerekli çabayı gösteririz. Planlı bakım veya öngörülemeyen teknik sorunlar nedeniyle geçici kesintiler yaşanabilir.</p>

      <h2>7. Sorumluluğun Sınırlandırılması</h2>
      <p>Yürürlükteki mevzuatın izin verdiği azami ölçüde; hizmetin kullanımından veya kullanılamamasından doğan dolaylı, arızi veya sonuç niteliğindeki zararlardan (kâr kaybı, veri kaybı dâhil) sorumlu tutulamayız. Sorumluluğumuz, varsa, son 12 ayda ödediğin abonelik bedeli ile sınırlıdır.</p>

      <h2>8. Fesih</h2>
      <p>Hesabını istediğin zaman kapatabilirsin. Bu şartlara aykırı kullanım tespit edilmesi hâlinde, önceden bildirimde bulunarak veya bulunmaksızın hesabını askıya alma veya kapatma hakkımız saklıdır.</p>

      <h2>9. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
      <p>Türkiye&apos;de yerleşik kullanıcılar bakımından bu şartlar Türk hukukuna tabidir; uyuşmazlıklarda İstanbul ve Antalya mahkemeleri ile icra daireleri yetkilidir. Türkiye dışındaki kullanıcılar bakımından İngiltere hukuku uygulanır.</p>

      <h2>10. Değişiklikler</h2>
      <p>Bu şartları zaman zaman güncelleyebiliriz. Önemli değişikliklerde panel veya e-posta yoluyla bilgilendirme yapılır.</p>

      <h2>11. İletişim</h2>
      <p><a href="mailto:info@bysirius.com">info@bysirius.com</a></p>
    </LegalLayout>
  );
}
