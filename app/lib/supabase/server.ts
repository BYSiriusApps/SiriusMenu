import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server component'ten çağrılırsa cookie set edilemez; middleware halleder.
          }
        },
      },
    },
  );
}

// Panel layout + page (ve olası paralel segmentler) aynı navigasyonda ayrı ayrı
// auth.getUser() çağırırsa, ikisi de aynı anda süresi dolan token'ı yenilemeye
// çalışıp Supabase'in refresh token rotasyonunda birbirini geçersiz kılabilir
// (arka arkaya "oturum kapandı" hatası). React cache() ile bu istek başına
// tekilleştirilir: aynı request içinde kaç yerden çağrılırsa çağrılsın tek
// getUser() gider.
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

// Web (çerez oturumu) ve gelecekteki mobil app (Authorization: Bearer <access_token>)
// aynı route'ları kullanabilsin diye ortak kullanıcı çözümleyici.
export async function getRequestUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  req: Request,
) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.slice(7));
    return user;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
