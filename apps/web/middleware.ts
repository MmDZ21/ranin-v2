import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, jwtVerify, SignJWT } from "jose";
import { ENCODED_KEY } from "./lib/constants";
import { API_URL } from "./lib/constants";
import type { Session } from "./lib/types";

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const res = NextResponse.next();

  // No session cookie - redirect to login
  if (!sessionCookie) {
    console.log("[Middleware] No session cookie found. Redirecting to login.");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    // Decode session to get accessToken and refreshToken
    const { payload } = await jwtVerify<Session>(sessionCookie, ENCODED_KEY, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.accessToken || !payload.user) {
      console.log("[Middleware] Invalid session structure. Clearing cookie and redirecting.");
      res.cookies.delete("session");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Decode access token to check expiration
    const decodedAccessToken = decodeJwt(payload.accessToken);
    const now = Date.now() / 1000;

    // Only refresh if token is actually expired
    const isExpired = decodedAccessToken.exp && decodedAccessToken.exp < now;
    
    console.log(`[Middleware] Checking Token Expiration:
      - Now: ${new Date(now * 1000).toISOString()}
      - Exp: ${decodedAccessToken.exp ? new Date(decodedAccessToken.exp * 1000).toISOString() : "No Exp"}
      - Is Expired: ${isExpired}
    `);

    if (isExpired) {
      console.log("[Middleware] Access token expired. Attempting refresh...");
      if (!payload.refreshToken) {
        console.log("[Middleware] No refresh token available. Redirecting.");
        res.cookies.delete("session");
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      try {
        console.log("[Middleware] Calling refresh endpoint...");
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: payload.refreshToken }),
        });

        if (refreshRes.ok) {
          const { accessToken: newAccess, refreshToken: newRefresh } =
            await refreshRes.json();
          
          console.log("[Middleware] Refresh successful. Updating session.");

          // Create new session with updated tokens
          const newSessionPayload: Session = {
            user: payload.user,
            accessToken: newAccess,
            refreshToken: newRefresh,
          };

          // Sign new session JWT
          const decodedRefresh = decodeJwt(newRefresh);
          const expiredAt = decodedRefresh.exp
            ? new Date(decodedRefresh.exp * 1000)
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

          const newSession = await new SignJWT(newSessionPayload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiredAt)
            .sign(ENCODED_KEY);

          // Update session cookie
          res.cookies.set("session", newSession, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: expiredAt,
            sameSite: "lax",
            path: "/",
          });
        } else {
          console.log(`[Middleware] Refresh failed with status: ${refreshRes.status}`);
          // Refresh failed → clear cookies and redirect
          res.cookies.delete("session");
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
      } catch (error) {
        console.error("[Middleware] Refresh request error:", error);
        // Refresh request failed → clear cookies and redirect
        res.cookies.delete("session");
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  } catch (error) {
    console.error("[Middleware] Session verification failed:", error);
    // Invalid session token → redirect to login
    res.cookies.delete("session");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};