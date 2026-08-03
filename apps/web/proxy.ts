import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, jwtVerify, SignJWT } from "jose";
import { ENCODED_KEY, API_URL } from "./lib/constants";
import type { Session } from "./lib/types";

const LOGIN_URL = "/auth/login";
const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

export async function proxy(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  let res = NextResponse.next();

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(LOGIN_URL, req.url));
  }

  try {
    const { payload } = await jwtVerify<Session>(sessionCookie, ENCODED_KEY, {
      algorithms: ["HS256"],
    });

    if (!payload?.accessToken || !payload.user) {
      const redirectRes = NextResponse.redirect(new URL(LOGIN_URL, req.url));
      redirectRes.cookies.delete("session");
      return redirectRes;
    }

    // The dashboard is admin-only. Non-admin (or legacy role-less) sessions go home.
    if (payload.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const decodedAccessToken = decodeJwt(payload.accessToken);
    const now = Date.now() / 1000;
    const isExpired = decodedAccessToken.exp ? decodedAccessToken.exp < now : true;

    if (isExpired) {
      if (!payload.refreshToken) {
        const redirectRes = NextResponse.redirect(new URL(LOGIN_URL, req.url));
        redirectRes.cookies.delete("session");
        return redirectRes;
      }

      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: payload.refreshToken }),
        });

        if (!refreshRes.ok) {
          const redirectRes = NextResponse.redirect(new URL(LOGIN_URL, req.url));
          redirectRes.cookies.delete("session");
          return redirectRes;
        }

        const { accessToken: newAccess, refreshToken: newRefresh } =
          await refreshRes.json();

        const newSessionPayload: Session = {
          user: payload.user,
          accessToken: newAccess,
          refreshToken: newRefresh,
        };

        const decodedRefresh = decodeJwt(newRefresh);
        const expiredAt = decodedRefresh.exp
          ? new Date(decodedRefresh.exp * 1000)
          : new Date(Date.now() + SEVEN_DAYS_MS);

        const newSession = await new SignJWT(newSessionPayload)
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime(expiredAt)
          .sign(ENCODED_KEY);

        req.cookies.set("session", newSession);
        res = NextResponse.next({ request: req });

        res.cookies.set("session", newSession, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: expiredAt,
          sameSite: "lax",
          path: "/",
        });
      } catch {
        const redirectRes = NextResponse.redirect(new URL(LOGIN_URL, req.url));
        redirectRes.cookies.delete("session");
        return redirectRes;
      }
    }
  } catch {
    const redirectRes = NextResponse.redirect(new URL(LOGIN_URL, req.url));
    redirectRes.cookies.delete("session");
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
