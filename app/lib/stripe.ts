import Stripe from "stripe";

let cached: Stripe | null = null;

function getStripe(): Stripe {
  if (!cached) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY tanımlı değil");
    }
    cached = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return cached;
}

// Next.js build sırasında route modüllerini import edip inceler (page data collection);
// STRIPE_SECRET_KEY o an set değilse modül yüklenirken çökmesin diye istemci tembel (lazy)
// oluşturulur — gerçek Stripe çağrısı yapılana kadar anahtar aranmaz.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver);
  },
});
