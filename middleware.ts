import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isAdminEmail } from "@/lib/supabase/admin";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user || !isAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logos|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
