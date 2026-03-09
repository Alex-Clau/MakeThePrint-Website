import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Allow public access to product pages, about, cart, etc.
  // Only protect account-related routes
  const publicPaths = [
    "/",
    "/products",
    "/collections",
    "/about",
    "/cart",
    "/checkout",
  ];
  
  const pathname = request.nextUrl.pathname;

  const isPublicPath =
    // marketing/public pages
    publicPaths.some(
      (path) =>
        pathname === path || pathname.startsWith(path + "/"),
    ) ||
    // auth pages & flows
    pathname.startsWith("/auth") ||
    // all API routes are public; individual handlers enforce auth as needed
    pathname.startsWith("/api") ||
    // explicit webhook path (kept for clarity)
    pathname === "/api/stripe/webhook";

  if (!isPublicPath && !user) {
    // Redirect to login only for protected routes
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
