import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const qr_token = randomBytes(12).toString("hex");
  const { error } = await supabase.from("restaurants").update({ qr_token }).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "QR yenilenemedi" }, { status: 500 });

  return NextResponse.json({ qr_token });
}
