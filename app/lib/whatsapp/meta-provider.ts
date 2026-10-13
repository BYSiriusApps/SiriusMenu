// Meta WhatsApp Cloud API sağlayıcısı — iskelet.
// Henüz bağlanmadı; ileride business.provider = "meta_cloud" olduğunda doldurulacak.
// Webhook/mesaj payload şekli Evolution'dan tamamen farklıdır (Meta Graph API formatı),
// bu yüzden parseIncoming/fetchMedia burada Meta'nın kendi formatına göre yazılmalı.
import type { WhatsAppProvider } from "./types";

const notConfigured = new Error("Meta Cloud API sağlayıcısı henüz yapılandırılmadı.");

export const metaCloudProvider: WhatsAppProvider = {
  name: "meta_cloud",

  isConfigured() {
    return false;
  },

  async sendTextMessage() {
    throw notConfigured;
  },
  async sendImageMessage() {
    throw notConfigured;
  },
  async sendAudioMessage() {
    throw notConfigured;
  },
  async sendDocument() {
    throw notConfigured;
  },
  async getConnectionStatus() {
    return null;
  },
  async createInstance() {
    throw notConfigured;
  },
  async disconnectInstance() {
    throw notConfigured;
  },
  parseIncoming() {
    return null;
  },
  async fetchMedia() {
    return null;
  },
};
