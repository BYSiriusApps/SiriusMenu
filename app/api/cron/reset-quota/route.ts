import { NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase/server";

function authed(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}` || new URL(req.url).searchParams.get("secret") === secret;
}

async function run(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const svc = createServiceClient();

  // Dönem sonu geçmiş aktif planların sayaçlarını sıfırla (Stripe invoice.paid yedeği).
  const { data, error } = await svc
    .from("restaurants")
    .update({ image_quota_used: 0 })
    .lt("image_quota_period_end", new Date().toISOString())
    .neq("plan", "trial")
    .gt("image_quota_used", 0)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reset: data?.length ?? 0 });
}

export const GET = run;
export const POST = run;
