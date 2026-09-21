import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

function toE164(raw: string): string | null {
  const digits = String(raw || "").replace(/[^\d]/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith("90")) return `+${digits}`;
  if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
  return `+${digits}`;
}

async function myRestaurantId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("restaurants").select("id").eq("user_id", user.id).single();
  return data?.id ?? null;
}

// Yetkili WhatsApp numaraları listesi (panel)
export async function GET() {
  const supabase = await createClient();
  const rid = await myRestaurantId(supabase);
  if (!rid) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { data } = await supabase
    .from("whatsapp_authorized_numbers")
    .select("id, phone, role, verified, verify_code")
    .eq("restaurant_id", rid)
    .order("created_at", { ascending: true });

  return NextResponse.json({ numbers: data ?? [], businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "" });
}

// Yeni yetkili numara ekle: doğrulama kodu üret
export async function POST(req: Request) {
  const supabase = await createClient();
  const rid = await myRestaurantId(supabase);
  if (!rid) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { number, role } = await req.json().catch(() => ({}));
  const e164 = toE164(number);
  if (!e164) return NextResponse.json({ error: "Geçerli bir telefon numarası gir" }, { status: 400 });

  const code = String(Math.floor(100000 + Math.random() * 900000));

  const { data, error } = await supabase
    .from("whatsapp_authorized_numbers")
    .upsert(
      { restaurant_id: rid, phone: e164, role: role || "yetkili", verified: false, verify_code: code },
      { onConflict: "restaurant_id,phone" },
    )
    .select("id, phone, role, verified")
    .single();

  if (error) return NextResponse.json({ error: "Bu numara başka bir işletmede kayıtlı olabilir." }, { status: 409 });

  return NextResponse.json({ ...data, code, businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "" });
}

// Yetkili numarayı kaldır
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const rid = await myRestaurantId(supabase);
  if (!rid) return NextResponse.json({ error: "Giriş yapmalısın" }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });

  await supabase.from("whatsapp_authorized_numbers").delete().eq("id", id).eq("restaurant_id", rid);
  return NextResponse.json({ ok: true });
}
