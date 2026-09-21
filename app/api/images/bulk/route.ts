import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { createClient, createServiceClient } from "../../../lib/supabase/server";

const PACK_PRICE: Record<string, string | undefined> = {
  bulk50: process.env.STRIPE_PRICE_ID_BULK50,
  bulk100: process.env.STRIPE_PRICE_ID_BULK100,
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { items, pack } = await req.json().catch(() => ({}));
  const price = PACK_PRICE[pack as string];
  if (!Array.isArray(items) || items.length === 0 || !price) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }

  const { data: restaurant } = await supabase
    .from("restaurants").select("id").eq("user_id", user.id).single();
  if (!restaurant) return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });

  const svc = createServiceClient();
  const rows = items
    .filter((it: { itemKey?: string; originalPath?: string }) => it.itemKey && it.originalPath?.startsWith(`${restaurant.id}/`))
    .map((it: { itemKey: string; originalPath: string }) => ({
      restaurant_id: restaurant.id, item_key: it.itemKey, original_path: it.originalPath,
      status: "uploaded", kind: "bulk",
    }));
  if (rows.length === 0) return NextResponse.json({ error: "Geçerli görsel yok" }, { status: 400 });
  await svc.from("menu_images").insert(rows);

  const { data: sub } = await supabase
    .from("subscriptions").select("stripe_customer_id").eq("restaurant_id", restaurant.id).single();
  const origin = new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    customer: sub?.stripe_customer_id ?? undefined,
    customer_email: sub?.stripe_customer_id ? undefined : user.email,
    client_reference_id: restaurant.id,
    metadata: { restaurant_id: restaurant.id, product: String(pack) },
    success_url: `${origin}/panel?purchase=success`,
    cancel_url: `${origin}/panel?purchase=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
