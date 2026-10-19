import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "../../../lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const qr_token = randomBytes(12).toString("hex");
  // qr_token korumalı bir sütundur (bkz. migration 0015); yalnızca sunucu service role ile yazar.
  const { data, error } = await createServiceClient().from("restaurants").update({ qr_token }).eq("user_id", user.id).select("id");
  if (error || !data?.length) return NextResponse.json({ error: "QR yenilenemedi" }, { status: 500 });

  return NextResponse.json({ qr_token });
}
