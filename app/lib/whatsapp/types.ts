// WhatsApp sağlayıcı soyutlaması. İş mantığı (webhook, menu-ops) bu arayüze
// karşı yazılır; hangi sağlayıcının (Evolution, ileride Meta Cloud) kullanıldığını bilmez.

export type IncomingWhatsAppMessage = {
  waMessageId: string;
  /** E.164, örn. +905321234567 */
  from: string;
  text: string;
  hasImage: boolean;
  /** Sağlayıcıya özgü ham mesaj — sadece fetchMedia'ya geri vermek için taşınır. */
  raw: unknown;
};

export interface WhatsAppProvider {
  readonly name: string;
  isConfigured(): boolean;

  sendTextMessage(toE164: string, text: string): Promise<void>;
  sendImageMessage(toE164: string, imageUrl: string, caption?: string): Promise<void>;
  sendAudioMessage(toE164: string, audioUrl: string): Promise<void>;
  sendDocument(toE164: string, url: string, filename: string): Promise<void>;

  /** Instance/numara bağlantı durumu — ops/tanılama amaçlı. */
  getConnectionStatus(): Promise<{ state: string } | null>;
  createInstance(): Promise<void>;
  disconnectInstance(): Promise<void>;

  /** Ham webhook payload'ını normalize eder. İlgisiz event/kendi mesajımızsa null döner. */
  parseIncoming(payload: unknown): IncomingWhatsAppMessage | null;
  /** parseIncoming'in döndürdüğü raw mesajdan medya çeker (görsel/ses vb.). */
  fetchMedia(raw: unknown): Promise<{ base64: string; mimetype: string } | null>;
}
