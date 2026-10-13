# Evolution API kurulumu (WhatsApp gateway)

SiriusMenu, WhatsApp mesajlarını almak/göndermek için kendi barındırdığın bir **Evolution API** örneğini kullanır.
Vercel'deki uygulama sadece webhook alır ve mesaj gönderme API'lerini çağırır (`app/lib/whatsapp/evolution-provider.ts`);
WhatsApp bağlantısını Evolution tutar. Tüm işletmeler **tek bir paylaşılan Sirius WhatsApp numarasına**
yazar; hangi restoran olduğu gönderen numaranın panelde tanımlı/doğrulanmış olup olmadığına göre çözülür
(bkz. `whatsapp_authorized_numbers` tablosu). Bu yüzden tek bir Evolution instance'ı yeterlidir.

## 1. Sunucu — Railway (önerilen)

Railway'in resmi Evolution API şablonu Postgres + Redis + Evolution API'yi tek seferde kurar:

1. Railway'de yeni proje: şablon galerisinden **"Evolution API"** (evoapicloud) şablonunu seç ve deploy et.
   Bu, `Postgres`, `Redis` ve `evolution-api` servislerini otomatik oluşturur; veritabanı/redis bağlantı
   URL'lerini Railway'in kendi reference variable mekanizmasıyla birbirine bağlar (elle yazman gerekmez).
2. `evolution-api` servisine Railway üzerinden **public domain** ata (Settings → Networking → Generate Domain,
   ya da kendi subdomain'in, örn. `evo.siriusmenu.com`, custom domain olarak). Railway HTTPS'i otomatik sağlar.
3. Servisin Variables sekmesinden şunları kontrol et / ekle:
   - `AUTHENTICATION_API_KEY` — şablon otomatik üretir, buradan kopyala.
   - `SERVER_URL` — atadığın public domain (`https://evo.siriusmenu.com`).
   - `WEBHOOK_GLOBAL_ENABLED=true`
   - `WEBHOOK_GLOBAL_URL=https://APP-DOMAIN/api/whatsapp/webhook?secret=WHATSAPP_WEBHOOK_SECRET`
   - `WEBHOOK_EVENTS_MESSAGES_UPSERT=true`
4. Deploy sonrası aşağıdaki "2. Instance + WhatsApp bağlama" adımına geç (aynı curl komutları, sadece
   `EVO-DOMAIN` yerine Railway domain'ini kullan).

Restart/deploy sonrası instance verisi kaybolmaz: şablon Postgres + Redis kalıcı volume kullanır, Evolution
Baileys oturumu veritabanında saklanır ve tekrar QR okutmaya gerek kalmadan bağlanır.

Güncel image adı ve env değişken isimleri zaman zaman değişebiliyor (resmi org `evoapicloud/evolution-api`
oldu, eski `atendai/evolution-api` adının yerini aldı) — kurulumdan hemen önce Railway şablonunun ve
`docs.evolutionfoundation.com.br` sitesinin güncel halini kontrol et, buradaki adları körü körüne kopyalama.

## 1b. Alternatif: kendi VPS'in (Hetzner / DigitalOcean, ~4€/ay) — Docker Compose

```yaml
services:
  evolution-api:
    image: evoapicloud/evolution-api:v2.3.7   # güncel sürümü resmi dokümantasyondan kontrol et
    ports: ["8080:8080"]
    environment:
      - AUTHENTICATION_API_KEY=uzun-rastgele-bir-anahtar
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://evo:evo@postgres:5432/evolution
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_GLOBAL_URL=https://APP-DOMAIN/api/whatsapp/webhook?secret=WHATSAPP_WEBHOOK_SECRET
      - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
    depends_on: [postgres, redis]
  postgres:
    image: postgres:16
    environment: [POSTGRES_USER=evo, POSTGRES_PASSWORD=evo, POSTGRES_DB=evolution]
    volumes: ["evo_pg:/var/lib/postgresql/data"]
  redis:
    image: redis:7
volumes: { evo_pg: {} }
```

## 2. Instance + WhatsApp bağlama

```bash
# instance oluştur
curl -X POST https://EVO-DOMAIN/instance/create \
  -H "apikey: $AUTHENTICATION_API_KEY" -H "content-type: application/json" \
  -d '{"instanceName":"siriusmenu","integration":"WHATSAPP-BAILEYS"}'

# QR al (dön: base64 QR) — SiriusMenu işletme telefonundan WhatsApp > Bağlı Cihazlar ile okut
curl https://EVO-DOMAIN/instance/connect/siriusmenu -H "apikey: $AUTHENTICATION_API_KEY"
```

Bağlanan numara = işletmelerin menü güncellemek için yazacağı numara.

## 3. Vercel env

```
EVOLUTION_API_URL=https://EVO-DOMAIN
EVOLUTION_API_KEY=uzun-rastgele-bir-anahtar        # = AUTHENTICATION_API_KEY
EVOLUTION_INSTANCE=siriusmenu
WHATSAPP_BUSINESS_NUMBER=+90XXXXXXXXXX             # bağlanan numara
WHATSAPP_WEBHOOK_SECRET=webhook-url-indeki-secret
```

## 4. Test

1. Panelde "WhatsApp bağla" → numara gir → 6 haneli kod al.
2. O numaradan `WHATSAPP_BUSINESS_NUMBER`'a kodu yaz → "✅ WhatsApp bağlandı" yanıtı gelir.
3. "Latte fiyatını 120 yap" → menü güncellenir, `/m/<slug>` anında yansıtır.
4. "geri" → son değişiklik geri alınır.

## Notlar

- Evolution, resmi olmayan (Baileys / WhatsApp Web) bir köprüdür. Kişisel/işletme numarası kullan, spam gönderme.
- Resmi API'ye (Meta Cloud API) geçiş: `app/lib/whatsapp/` altında `WhatsAppProvider` arayüzü var
  (`evolution-provider.ts`, iskelet `meta-provider.ts`). Meta bağlanınca `meta-provider.ts` doldurulur ve
  `WHATSAPP_PROVIDER=meta_cloud` yapılır; webhook route'u ve menü mantığı değişmeden çalışır.
- Aboneliği pasif olan işletmeler için WhatsApp otomasyonu webhook'ta otomatik durur
  (`subscriptions.status` `trialing`/`active` değilse), menü verisi silinmez.
