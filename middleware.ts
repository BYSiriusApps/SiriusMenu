import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./app/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run Supabase auth middleware
  const response = await updateSession(request);
  
  // If it's an API route or static asset, just return the supabase response
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return response;
  }

  // 2. Run next-intl middleware
  const intlResponse = intlMiddleware(request);
  
  // Merge headers/cookies if necessary, or just return intlResponse
  // Since updateSession modifies headers/cookies on its own response, we should ideally merge them.
  // For simplicity in Next.js, we can just let intlMiddleware handle routing. 
  // Wait, updateSession might set auth cookies. 
  // We need to apply auth cookies to intlResponse.
  
  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });
  
  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
