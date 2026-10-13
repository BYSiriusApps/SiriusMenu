import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { createClient, createServiceClient } from "../../../lib/supabase/server";

// KVKK m.11 silme hakkı: aktif abonelikleri iptal eder, hesabı ve bağlı tüm verileri siler.
// Fatura/ödeme ve sözleşme onay kayıtları yasal saklama için purchase_consents / Stripe'ta kalır.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const svc = createServiceClient();
  const { data: restaurant } = await svc.from("restaurants").select("id").eq("user_id", user.id).maybeSingle();

  if (restaurant) {
    const { data: sub } = await svc
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("restaurant_id", restaurant.id)
      .maybeSingle();
    if (sub?.stripe_customer_id) {
      try {
        const subs = await stripe.subscriptions.list({ customer: sub.stripe_customer_id, status: "active" });
        for (const s of subs.data) await stripe.subscriptions.cancel(s.id);
      } catch {
        return NextResponse.json({ error: "Abonelik iptal edilemedi, hesap silinmedi. Lütfen destekle iletişime geç." }, { status: 502 });
      }
    }
  }

  const { error } = await svc.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Hesap silinemedi" }, { status: 500 });
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
