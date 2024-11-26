import NextAuth from "next-auth";

import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  PRIVATE_ROUTES,
  VERCEL_HEADERS,
} from "@/app-config";
import { authConfig } from "@/auth-config";
import { NextResponse, userAgent } from "next/server";
import type { DeviceType } from "./components/device-only/device-only-provider";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const {
    device: { type },
  } = userAgent(req);
  const deviceType: DeviceType =
    type === "mobile" ? "mobile" : type === "tablet" ? "tablet" : "desktop";

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(VERCEL_HEADERS.DEVICE_TYPE, deviceType);

  /* Save URL host visible to the user in Header */
  const nextUrlHost = req?.nextUrl?.host;
  requestHeaders.set(VERCEL_HEADERS.HOST, nextUrlHost);

  /* Save PathName in Header */
  const pathName = req?.nextUrl?.pathname;
  const url = req?.url;
  requestHeaders.set(VERCEL_HEADERS.PATHNAME, pathName);
  requestHeaders.set(VERCEL_HEADERS.URL, url);

  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPrivateRoute = PRIVATE_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }
  return NextResponse.next({
    headers: requestHeaders,
  });
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};
