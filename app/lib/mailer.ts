// Resend REST API ile işlem e-postaları (bağımlılık eklemeden). Env: RESEND_API_KEY, RESEND_FROM.
// Anahtar tanımsızsa sessizce atlanır; ödeme akışı e-posta hatasından asla etkilenmez.
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.RESEND_FROM || "SiriusMenu <info@bysirius.com>", to, subject, html, reply_to: "info@bysirius.com" }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

// Mesafeli Sözleşmeler Yönetmeliği m.6/ç: sözleşme onayının kalıcı veri saklayıcısıyla (e-posta) teyidi.
export function sendPurchaseConsentMail(opts: { to: string; origin: string; productLabel: string; docVersion: string; at: Date }) {
  const base = opts.origin.replace(/\/$/, "");
  const link = (path: string, label: string) => `<li><a href="${base}${path}">${label}</a></li>`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;line-height:1.55;color:#222">
  <h2>Satın alma onayın alındı</h2>
  <p>SiriusMenu ödeme adımından önce aşağıdaki belgeleri onayladığını teyit ederiz. Bu e-posta sözleşmenin kalıcı kopyası yerine geçen bilgilendirmedir.</p>
  <ul>
    <li><b>Ürün:</b> ${esc(opts.productLabel)}</li>
    <li><b>Onay zamanı:</b> ${opts.at.toISOString()}</li>
    <li><b>Belge sürümü:</b> ${esc(opts.docVersion)}</li>
    <li><b>Onaylananlar:</b> Ön Bilgilendirme Formu, Mesafeli Satış Sözleşmesi, hizmetin hemen ifasına onay (cayma hakkı istisnası)</li>
  </ul>
  <p>Belgelerin tam metni:</p>
  <ul>
    ${link("/mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu")}
    ${link("/iade-iptal-politikasi", "İade &amp; İptal Politikası")}
    ${link("/kvkk-aydinlatma-metni", "KVKK Aydınlatma Metni")}
  </ul>
  <p style="color:#666;font-size:13px">Sorular için info@bysirius.com adresine yazabilirsin. BY Sirius Group AI and Technology Co. Ltd.</p>
</div>`;
  return sendMail(opts.to, "SiriusMenu satın alma onayın ve sözleşme bilgilendirmesi", html);
}
