// Evolution API (self-hosted / Railway) sağlayıcısı.
import type { IncomingWhatsAppMessage, WhatsAppProvider } from "./types";

const URL_ = () => process.env.EVOLUTION_API_URL?.replace(/\/$/, "") || "";
const KEY = () => process.env.EVOLUTION_API_KEY || "";
const INSTANCE = () => process.env.EVOLUTION_INSTANCE || "siriusmenu";

/** "905321234567@s.whatsapp.net" -> "+905321234567" */
function jidToE164(jid: string): string {
  const digits = String(jid || "").split("@")[0].split(":")[0].replace(/[^\d]/g, "");
  return digits ? `+${digits}` : "";
}

function extractText(msg: Record<string, unknown> | undefined): string {
  if (!msg) return "";
  return (
    (msg.conversation as string) ||
    ((msg.extendedTextMessage as { text?: string })?.text) ||
    ((msg.imageMessage as { caption?: string })?.caption) ||
    ""
  ).trim();
}

async function instanceCall(path: string, body: unknown): Promise<Response> {
  return fetch(`${URL_()}/${path}/${INSTANCE()}`, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: KEY() },
    body: JSON.stringify(body),
  });
}

async function adminCall(path: string, method: "GET" | "POST" | "DELETE", body?: unknown): Promise<Response> {
  return fetch(`${URL_()}/${path}`, {
    method,
    headers: { "content-type": "application/json", apikey: KEY() },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export const evolutionProvider: WhatsAppProvider = {
  name: "evolution",

  isConfigured() {
    return Boolean(process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY);
  },

  async sendTextMessage(toE164, text) {
    if (!this.isConfigured()) return;
    const number = toE164.replace(/[^\d]/g, "");
    try {
      await instanceCall("message/sendText", { number, text });
    } catch {
      // yut — webhook yanıtını bloklama
    }
  },

  async sendImageMessage(toE164, imageUrl, caption) {
    if (!this.isConfigured()) return;
    const number = toE164.replace(/[^\d]/g, "");
    try {
      await instanceCall("message/sendMedia", { number, mediatype: "image", media: imageUrl, caption: caption || "" });
    } catch {
      // yut
    }
  },

  async sendAudioMessage(toE164, audioUrl) {
    if (!this.isConfigured()) return;
    const number = toE164.replace(/[^\d]/g, "");
    try {
      await instanceCall("message/sendWhatsAppAudio", { number, audio: audioUrl });
    } catch {
      // yut
    }
  },

  async sendDocument(toE164, url, filename) {
    if (!this.isConfigured()) return;
    const number = toE164.replace(/[^\d]/g, "");
    try {
      await instanceCall("message/sendMedia", { number, mediatype: "document", media: url, fileName: filename });
    } catch {
      // yut
    }
  },

  async getConnectionStatus() {
    if (!this.isConfigured()) return null;
    try {
      const r = await adminCall(`instance/connectionState/${INSTANCE()}`, "GET");
      if (!r.ok) return null;
      const d = await r.json();
      return { state: d?.instance?.state ?? d?.state ?? "unknown" };
    } catch {
      return null;
    }
  },

  async createInstance() {
    if (!this.isConfigured()) return;
    await adminCall("instance/create", "POST", {
      instanceName: INSTANCE(),
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
    });
  },

  async disconnectInstance() {
    if (!this.isConfigured()) return;
    await adminCall(`instance/logout/${INSTANCE()}`, "DELETE");
  },

  parseIncoming(payload) {
    const body = payload as { event?: string; data?: Record<string, unknown> } | null;
    const event = body?.event;
    const data = body?.data as { key?: { id?: string; remoteJid?: string; fromMe?: boolean }; message?: Record<string, unknown> } | undefined;
    if (event !== "messages.upsert" || !data || data.key?.fromMe) return null;

    const from = jidToE164(data.key?.remoteJid ?? "");
    if (!from) return null;

    return {
      waMessageId: data.key?.id || `${from}-${Date.now()}`,
      from,
      text: extractText(data.message),
      hasImage: Boolean(data.message?.imageMessage),
      raw: data,
    };
  },

  async fetchMedia(raw) {
    if (!this.isConfigured()) return null;
    const data = raw as { key?: unknown; message?: Record<string, unknown> } | undefined;
    const messageParam = data?.message ? { key: data.key, message: data.message } : data;
    try {
      const r = await instanceCall("chat/getBase64FromMediaMessage", { message: messageParam });
      if (!r.ok) return null;
      const d = await r.json();
      const base64 = d?.base64 ?? d?.media ?? null;
      if (!base64) return null;
      return { base64, mimetype: d?.mimetype || "image/jpeg" };
    } catch {
      return null;
    }
  },
};

export type { IncomingWhatsAppMessage };
