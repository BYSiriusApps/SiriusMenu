import { NextResponse } from "next/server";
import { processImageQueue } from "../../../lib/image-queue";

export const maxDuration = 60;

function authed(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // Prod'da secret tanımsızsa reddet: aksi halde bu uç nokta herkese açık kalır ve
  // Gemini API bütçesini tüketen kuyruk işlemeyi dışarıdan tetikleyebilir.
  if (!secret) return process.env.NODE_ENV !== "production";
  return req.headers.get("authorization") === `Bearer ${secret}` || new URL(req.url).searchParams.get("secret") === secret;
}

async function run(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await processImageQueue();
  return NextResponse.json(result);
}

export const GET = run;
export const POST = run;
