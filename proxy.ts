import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

function getLocaleAndRest(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0]; // e.g. "en"
  const rest = "/" + segments.slice(1).join("/"); // e.g. "/login"
  return { locale, rest };
}

function isPublicPath(pathname: string) {
  // Allow next internals, static files, and API
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon.ico")) return true;
  if (pathname.startsWith("/api")) return true;
  if (PUBLIC_FILE.test(pathname)) return true;

  const { locale, rest } = getLocaleAndRest(pathname);
  if (!locale) return false;

  // Only this route is public
  if (rest === "/login") return true;

  return false;
}

// 1) next-intl middleware
const intlMiddleware = createMiddleware(routing);

// 2) auth middleware
function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths pass
  if (isPublicPath(pathname)) return NextResponse.next();

  const { locale, rest } = getLocaleAndRest(pathname);
  const resolvedLocale = locale ?? routing.defaultLocale ?? "en";

  const access = req.cookies.get("sa_access_token")?.value;
  const refresh = req.cookies.get("sa_refresh_token")?.value;

  // If no tokens -> redirect to /[locale]/login
  if (!access && !refresh) {
    const url = req.nextUrl.clone();
    url.pathname = `/${resolvedLocale}/login`;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Optional: if user hits /[locale]/login while having tokens, redirect away
  // Note: login is public, so this only matters if you want to enforce it.
  // We'll handle it here anyway.
  if (rest === "/login" && (access || refresh)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${resolvedLocale}/`;
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 3) compose them
export default function proxy(req: NextRequest) {
  // Run auth first: it may redirect quickly.
  const authResult = authMiddleware(req);
  if (authResult.status !== 200) return authResult;

  // Then run intl middleware (adds/normalizes locale routing)
  return intlMiddleware(req);
}

export const config = {
  // Keep next-intl recommended matcher but also include locale routes
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
