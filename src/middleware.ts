import { NextRequest, NextResponse, userAgent } from "next/server";
import createI18nMiddleware from "next-intl/middleware";

import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  PORTAL_ROUTES_PREFIX,
  PUBLIC_ROUTES,
  VERCEL_HEADERS,
} from "@/core/config/app-config";
import { auth } from "@/core/config/auth-config";
import { routing } from "./i18n/routing";
import type { DeviceType } from "./shared/components/layout/viewport-context/types";

const intlMiddleware = createI18nMiddleware(routing);

const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.includes(API_AUTH_PREFIX);
  const isPortalRoute = nextUrl.pathname.includes(PORTAL_ROUTES_PREFIX);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && isPortalRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  const requestHeaders = new Headers(req.headers);
  const portalEnabled =
    (requestHeaders.get(VERCEL_HEADERS.PORTAL_ENABLED) ?? "0") === "1";

  if (isPortalRoute && !portalEnabled) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return intlMiddleware(req);
});

export default function middleware(req: NextRequest) {
  const {
    device: { type },
  } = userAgent(req);
  const deviceType: DeviceType | "string" = (type as DeviceType) || "desktop";

  const nextUrlHost = req?.nextUrl?.host;
  const pathName = req?.nextUrl?.pathname;
  const url = req?.url;

  const requestHeaders = new Headers(req.headers);

  requestHeaders.set(VERCEL_HEADERS.DEVICE_TYPE, deviceType);
  requestHeaders.set(VERCEL_HEADERS.HOST, nextUrlHost);
  requestHeaders.set(VERCEL_HEADERS.PATHNAME, pathName);
  requestHeaders.set(VERCEL_HEADERS.URL, url);

  const serverAction = requestHeaders.get("next-action");

  const reqWithHeaders = new NextRequest(req.url, {
    headers: requestHeaders,
  });

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${PUBLIC_ROUTES.flatMap((p) =>
      p === "/" ? ["", "/"] : p,
    ).join("|")})/?$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage || serverAction) {
    return intlMiddleware(reqWithHeaders);
  }

  return (authMiddleware as any)(reqWithHeaders);
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|images|logos|public|manifest|sitemap).*)",
    },
  ],
};
