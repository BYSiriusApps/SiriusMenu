import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { createServiceClient } from "../../../lib/supabase/server";
import { PRICING } from "../../../lib/menu";

const QUOTA_BY_INTERVAL: Record<string, number> = {
  month: PRICING.monthly.imageQuota,
  year: PRICING.yearly.imageQuota,
};
const CREDITS_BY_PRODUCT: Record<string, number> = {
  image_pack: PRICING.imagePack.credits,
  bulk50: PRICING.bulk50.credits,
  bulk100: PRICING.bulk100.credits,
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook doğrulanamadı: ${(err as Error).message}` }, { status: 400 });
  }

  const supabase = createServiceClient();

  const upsertFromSubscription = async (subscription: Stripe.Subscription, restaurantId?: string) => {
    const rid = restaurantId ?? subscription.metadata?.restaurant_id;
    if (!rid) return;
    const periodEndUnix = subscription.items.data[0]?.current_period_end;
    const periodEndIso = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;
    const interval = subscription.metadata?.plan_interval || subscription.items.data[0]?.price?.recurring?.interval || "month";

    await supabase.from("subscriptions").update({
      stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      plan_interval: interval,
      current_period_end: periodEndIso,
    }).eq("restaurant_id", rid);

    if (subscription.status === "active" || subscription.status === "trialing") {
      await supabase.from("subscriptions").update({ setup_fee_paid: true }).eq("restaurant_id", rid);

      const { data: cur } = await supabase.from("restaurants")
        .select("image_quota_period_end").eq("id", rid).single();
      // Dönem ilerlediyse (ilk kez / yenileme) taban kotayı ve sayaçları sıfırla;
      // dönem içi güncellemelerde satın alınan ek paketleri koru.
      const advanced = !cur?.image_quota_period_end || (periodEndIso && periodEndIso > cur.image_quota_period_end);
      const base = QUOTA_BY_INTERVAL[interval] ?? PRICING.monthly.imageQuota;

      await supabase.from("restaurants").update({
        plan: interval === "year" ? "yearly" : "monthly",
        image_quota_period_end: periodEndIso,
        ...(advanced ? { image_quota: base, image_quota_used: 0 } : {}),
      }).eq("id", rid);
    }
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const rid = session.metadata?.restaurant_id ?? session.client_reference_id ?? undefined;
      if (!rid) break;

      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertFromSubscription(subscription, rid);
        await supabase.from("restaurants").update({ image_quota_used: 0 }).eq("id", rid);
      } else if (session.mode === "payment") {
        const product = session.metadata?.product ?? "";
        const credits = CREDITS_BY_PRODUCT[product] ?? 0;
        await supabase.from("usage_charges").insert({
          restaurant_id: rid, type: product || "overage", stripe_session_id: session.id,
          credits, amount: session.amount_total ?? null, status: "paid",
        });
        if (product === "image_pack" && credits) {
          const { data: r } = await supabase.from("restaurants").select("image_quota").eq("id", rid).single();
          await supabase.from("restaurants").update({ image_quota: (r?.image_quota ?? 0) + credits }).eq("id", rid);
        }
        if (product === "bulk50" || product === "bulk100") {
          await supabase.from("menu_images").update({ status: "processing" })
            .eq("restaurant_id", rid).eq("kind", "bulk").eq("status", "uploaded");
        }
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = (invoice as unknown as { subscription?: string }).subscription;
      if (!subId) break;
      const subscription = await stripe.subscriptions.retrieve(subId);
      const rid = subscription.metadata?.restaurant_id;
      if (rid) {
        const periodEnd = subscription.items.data[0]?.current_period_end;
        await supabase.from("restaurants").update({
          image_quota_used: 0,
          image_quota_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        }).eq("id", rid);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      await upsertFromSubscription(event.data.object as Stripe.Subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const rid = subscription.metadata?.restaurant_id;
      if (rid) {
        await supabase.from("subscriptions").update({ status: "canceled" }).eq("restaurant_id", rid);
        await supabase.from("restaurants").update({ plan: "trial", image_quota: 0 }).eq("id", rid);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
