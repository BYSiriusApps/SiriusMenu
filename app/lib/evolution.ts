// Evolution API (kendi barındırılan WhatsApp gateway) istemcisi.
const URL_ = () => process.env.EVOLUTION_API_URL?.replace(/\/$/, "") || "";
const KEY = () => process.env.EVOLUTION_API_KEY || "";
const INSTANCE = () => process.env.EVOLUTION_INSTANCE || "siriusmenu";

export function isEvolutionConfigured(): boolean {
  return Boolean(process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY);
}

/** "905321234567@s.whatsapp.net" -> "+905321234567" */
export function jidToE164(jid: string): string {
  const digits = String(jid || "").split("@")[0].split(":")[0].replace(/[^\d]/g, "");
  return digits ? `+${digits}` : "";
}

async function call(path: string, body: unknown): Promise<Response> {
  return fetch(`${URL_()}/${path}/${INSTANCE()}`, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: KEY() },
    body: JSON.stringify(body),
  });
}

export async function sendText(toE164: string, text: string): Promise<void> {
  if (!isEvolutionConfigured()) return;
  const number = toE164.replace(/[^\d]/g, "");
  try {
    await call("message/sendText", { number, text });
  } catch {
    // yut — webhook yanıtını bloklama
  }
}

/** Gelen medya mesajından base64 çeker. */
export async function mediaBase64(message: unknown): Promise<{ base64: string; mimetype: string } | null> {
  if (!isEvolutionConfigured()) return null;
  try {
    const r = await call("chat/getBase64FromMediaMessage", { message });
    if (!r.ok) return null;
    const d = await r.json();
    const base64 = d?.base64 ?? d?.media ?? null;
    if (!base64) return null;
    return { base64, mimetype: d?.mimetype || "image/jpeg" };
  } catch {
    return null;
  }
}

export function extractText(msg: Record<string, unknown> | undefined): string {
  if (!msg) return "";
  return (
    (msg.conversation as string) ||
    ((msg.extendedTextMessage as { text?: string })?.text) ||
    ((msg.imageMessage as { caption?: string })?.caption) ||
    ""
  ).trim();
}
