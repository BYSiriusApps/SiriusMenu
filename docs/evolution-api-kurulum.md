# Evolution API kurulumu (WhatsApp gateway)

SiriusMenu, WhatsApp mesajlarını almak/göndermek için kendi barındırdığın bir **Evolution API** örneğini kullanır.
Vercel'deki uygulama sadece webhook alır ve `POST /message/sendText` çağırır; WhatsApp bağlantısını Evolution tutar.

## 1. Sunucu

Bir VPS (Hetzner / DigitalOcean, ~4€/ay) ya da Railway/Coolify. Docker Compose:

```yaml
services:
  evolution-api:
    image: atendai/evolution-api:v2.1.1
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
- Resmi API'ye (Meta Cloud API) geçmek istenirse `app/lib/evolution.ts` yerine yeni bir adapter yazılır; webhook mantığı aynı kalır.
