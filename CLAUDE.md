# Karemenü — kişiselleştirme rehberi
Sor: 1) Marka adı (vars. Karemenü). 2) Aksan renk (vars. amber #e0891b) → globals.css `--accent`. 3) Fiyat (vars. 149 TL/ay; landing app/page.tsx fiyat kartı). 4) Menü temaları / etiketler / para birimleri (isteğe bağlı; app/lib/menu.tsx `THEMES`, `TAGS`, `CURRENCIES`).
Kurallar: em dash yok; tek aksan (amber); "baskı yok / anlık güncelleme / işlem başına ücret yok" vaatleri korunur. Menü motoru (menu.tsx + MenuView.tsx) markalamada DEĞİŞTİRİLMEZ, sadece landing metni/renk/fiyat değişir. Not: burada iki "menü" var — ürünün SATTIĞI şey restoranın QR menüsü; işletmenin kendi markası üstteki "Karemenü" yazısıdır (rebrand edilir).

## Logo ekleme (kişiselleştirmenin parçası, marka adından hemen sonra sor)

"Logon var mı? Dosyayı (png/jpg/svg) bu klasöre bırakman yeterli, ben yerleştiririm."
- Dosya verirse: `public/logo.png` olarak kopyala. Üst bardaki "Karemenü" yazısının yanına koy (yükseklik ~28px); landing header'daki marka adının yanına da ekle.
- Aynı görseli `app/icon.png` olarak da kaydet; Next.js bunu otomatik favicon yapar.
- Logo yoksa: "Sorun değil, temiz marka adı yazısı yeter; logon hazır olunca dosyayı bırak" de.
- Logoyu yerleştirdikten sonra kullanıcıya ekranda nasıl göründüğünü kontrol ettir.
