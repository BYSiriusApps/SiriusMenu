// Provider seçimi — WHATSAPP_PROVIDER env değişkenine göre (varsayılan: evolution).
// İleride business bazlı seçim gerekirse (per-tenant provider) burada genişletilir.
import { evolutionProvider } from "./evolution-provider";
import { metaCloudProvider } from "./meta-provider";
import type { WhatsAppProvider } from "./types";

export function getWhatsAppProvider(): WhatsAppProvider {
  const name = process.env.WHATSAPP_PROVIDER || "evolution";
  if (name === "meta_cloud") return metaCloudProvider;
  return evolutionProvider;
}

export type { WhatsAppProvider, IncomingWhatsAppMessage } from "./types";
