import type { Metadata } from "next";
import { LegalLayout } from "../lib/legal/LegalLayout";

export const metadata: Metadata = { title: "Çerez Politikası — SiriusMenu" };

export default function CerezPolitikasi() {
  return (
    <LegalLayout title="Çerez Politikası" updated="30 Temmuz 2026">
      <h2>1. Çerez Nedir</h2>
      <p>Çerezler, bir web sitesini ziyaret ettiğinde tarayıcına kaydedilen küçük metin dosyalarıdır. SiriusMenu, hizmetin çalışması için gerekli olan sınırlı sayıda çerez kullanır.</p>

      <h2>2. Kullandığımız Çerezler</h2>
      <table>
        <thead><tr><th>Çerez</th><th>Amaç</th><th>Süre</th></tr></thead>
        <tbody>
          <tr><td>Oturum çerezi (Supabase auth)</td><td>Giriş yapmış kullanıcının oturumunu güvenli şekilde tutmak, panele erişimi sağlamak</td><td>Oturum boyunca / uzun ömürlü oturum tercihine göre</td></tr>
          <tr><td>Stripe ödeme çerezleri</td><td>Ödeme/abonelik akışı sırasında Stripe tarafından, dolandırıcılık önleme ve ödeme oturumu için kullanılır</td><td>Stripe&apos;ın kendi politikasına göre</td></tr>
        </tbody>
      </table>
      <p>Bu çerezlerin dışında, şu an itibarıyla reklam veya üçüncü taraf takip (analytics) amaçlı çerez kullanılmamaktadır. Bu durum değişirse bu sayfa güncellenecektir.</p>

      <h2>3. Zorunlu Çerezler</h2>
      <p>Oturum çerezi, hizmetin temel işlevi (giriş yapma, panele erişim) için zorunludur; tarayıcı ayarlarından engellenirse panel ve giriş özellikleri çalışmaz. Menünün herkese açık görüntülenme sayfası (/m/[slug]) çerez gerektirmez.</p>

      <h2>4. Çerezleri Nasıl Yönetebilirsin</h2>
      <p>Çoğu tarayıcı, çerezleri kabul etme/reddetme veya silme imkânı sunar. Tarayıcı ayarlarından mevcut çerezleri silebilir ve yenilerinin kaydedilmesini engelleyebilirsin; ancak bu, oturum açma gibi işlevlerin çalışmamasına yol açabilir.</p>

      <h2>5. İletişim</h2>
      <p>Sorularınız için <a href="mailto:info@bysirius.com">info@bysirius.com</a> adresinden bize ulaşabilirsiniz.</p>
    </LegalLayout>
  );
}
