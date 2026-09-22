# Markalı e-posta kurulumu (kayıt doğrulama, şifre sıfırlama)

Şu an kayıt/giriş e-postaları (doğrulama, şifre sıfırlama vb.) Supabase'in kendi paylaşımlı
gönderim altyapısından (`noreply@mail.app.supabase.io` benzeri) gidiyor ve varsayılan İngilizce
"Confirm your signup" şablonunu kullanıyor. Bunu SiriusMenu markasıyla tam uyumlu hale getirmek
iki ayrı adım gerektirir: **kendi SMTP'n** (gönderen adres) + **şablon metni** (görünüm/dil).

## 1. SMTP sağlayıcısı seç ve doğrula

Önerilen: **Resend** (resend.com), Supabase ile iyi çalışıyor, aylık 3.000 e-posta ücretsiz.

1. resend.com'da hesap aç, `siriusmenu.com` (veya kullandığın alan adı) domainini ekle.
2. Resend'in verdiği DNS kayıtlarını (SPF/DKIM, genelde 3 TXT/CNAME) domainin DNS yönetiminden
   (Cloudflare vb.) ekle. Doğrulama birkaç dakika–birkaç saat sürebilir.
3. Resend'de bir API key oluştur, SMTP kullanacağız: Resend dashboard'unda "SMTP" sekmesinden
   host/port/user/pass bilgisini al; user genelde `resend`, pass = oluşturduğun API key.

## 2. Supabase'e SMTP'yi bağla

Supabase Dashboard → ilgili proje → **Project Settings → Authentication → SMTP Settings**:

```
Enable Custom SMTP: ON
Sender email:  bildirim@siriusmenu.com   (doğruladığın domain altında bir adres)
Sender name:   SiriusMenu
Host:          smtp.resend.com
Port:          465 (SSL) veya 587 (STARTTLS)
Username:      resend
Password:      <Resend API key>
```

Kaydettikten sonra Supabase artık tüm auth e-postalarını (doğrulama, magic link, şifre sıfırlama,
e-posta değişikliği) bu adresten gönderir.

## 3. Şablon metnini markala

Supabase Dashboard → **Authentication → Email Templates**. En azından **Confirm signup** şablonunu
güncelle (diğerleri: Magic Link, Reset Password, Change Email, aynı mantıkla, ihtiyaç oldukça):

**Subject:**
```
SiriusMenu: e-posta adresini doğrula
```

**Body (HTML):**
```html
<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
  <div style="font-size:20px;font-weight:800;letter-spacing:-.02em">SiriusMenu</div>
  <h2 style="font-size:18px;margin:24px 0 8px">E-posta adresini doğrula</h2>
  <p style="color:#57534e;font-size:14px;line-height:1.6">
    Hesabını oluşturdun, son adım e-posta adresini doğrulamak. Aşağıdaki butona tıkla, panelin
    hazır olsun.
  </p>
  <a href="{{ .ConfirmationURL }}"
     style="display:inline-block;margin-top:20px;padding:12px 22px;background:#e0891b;color:#fff;
            text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">
    E-postamı doğrula
  </a>
  <p style="color:#a8a29e;font-size:12px;margin-top:28px">
    Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.
  </p>
</div>
```

Not: Supabase şablon değişkenleri (`{{ .ConfirmationURL }}` vb.) editördeki hazır listede var,
diğer şablonlar için de aynı isim/görünümü koru (buton rengi `#e0891b`, marka adı "SiriusMenu").

## Bilgi

- Bu iki adım tamamlanmadan da sistem çalışır; sadece e-posta "Supabase" markalı ve İngilizce görünür.
- SMTP olmadan sadece **şablon metnini** değiştirmek de mümkündür (adım 3 tek başına da uygulanabilir,
  gönderen adres yine Supabase kalır), hızlı ama yarım bir çözüm.
- Marka adı/renk değişirse (bkz. `CLAUDE.md`), bu şablonun metni ve `#e0891b` de elle güncellenmeli;
  otomatik değil.
