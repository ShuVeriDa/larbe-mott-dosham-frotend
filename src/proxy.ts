import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/dictionaries";

function getPreferredLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language") ?? "";

  // Parse Accept-Language header: "ru-RU,ru;q=0.9,en;q=0.8,ce;q=0.7"
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());

  for (const lang of preferred) {
    if (LOCALES.includes(lang as Locale)) return lang as Locale;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path already starts with a supported locale
  const matchedLocale = LOCALES.find(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (matchedLocale) {
    // Pass x-locale header downstream so the root layout can set html[lang]
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", matchedLocale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Redirect to the locale-prefixed path
  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image|manifest|icon|apple-icon).*)",
  ],
};
