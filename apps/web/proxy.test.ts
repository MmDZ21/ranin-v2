// Tests for the RBAC gate in proxy.ts (Next 16's renamed middleware.ts).
//
// `lib/constants.ts` fail-fasts at import time if SESSION_SECRET_KEY /
// BACKEND_URL aren't set, so we set them before the *first* (dynamic) import
// of "./proxy" rather than relying on a static import, which ESM hoists
// above any same-file env assignment.
process.env.SESSION_SECRET_KEY = "test-session-secret-key-1234567890";
process.env.BACKEND_URL = "http://localhost:3333/api";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3333/api";

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import type { Session } from "./lib/types";

type NextRequestInit = NonNullable<ConstructorParameters<typeof NextRequest>[1]>;

const TEST_ENCODED_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET_KEY,
);
const REFRESH_URL = `${process.env.BACKEND_URL}/auth/refresh`;

let proxy: typeof import("./proxy").proxy;

beforeAll(async () => {
  ({ proxy } = await import("./proxy"));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

async function signInnerToken(expSeconds: number) {
  return new SignJWT({ sub: "user-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(TEST_ENCODED_KEY);
}

async function signSession(
  payload: Session,
  expSeconds = nowSeconds() + 7 * 24 * 60 * 60,
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(TEST_ENCODED_KEY);
}

function buildRequest(cookieValue?: string): NextRequest {
  const init: NextRequestInit = {};
  if (cookieValue !== undefined) {
    init.headers = { cookie: `session=${cookieValue}` };
  }
  return new NextRequest("http://localhost:3000/dashboard", init);
}

const ADMIN_USER: Session["user"] = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Admin",
  role: "ADMIN",
};

const REGULAR_USER: Session["user"] = {
  id: "user-1",
  email: "user@example.com",
  name: "Regular",
  role: "USER",
};

describe("proxy", () => {
  it("redirects to /auth/login when there is no session cookie", async () => {
    const req = buildRequest();

    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/auth/login");
  });

  it("redirects to /auth/login and clears the cookie for a tampered/invalid session value", async () => {
    const req = buildRequest("this-is-not-a-valid-jwt");

    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/auth/login");

    const cleared = res.cookies.get("session");
    expect(cleared?.value).toBe("");
    expect(cleared?.expires && new Date(cleared.expires).getTime()).toBe(0);
  });

  it("redirects non-admin users to / without deleting the session cookie", async () => {
    const accessToken = await signInnerToken(nowSeconds() + 3600);
    const refreshToken = await signInnerToken(nowSeconds() + 7 * 24 * 60 * 60);
    const session = await signSession({
      user: REGULAR_USER,
      accessToken,
      refreshToken,
    });
    const req = buildRequest(session);

    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("lets admin users through with a non-expired access token (no cookie mutation)", async () => {
    const accessToken = await signInnerToken(nowSeconds() + 3600);
    const refreshToken = await signInnerToken(nowSeconds() + 7 * 24 * 60 * 60);
    const session = await signSession({
      user: ADMIN_USER,
      accessToken,
      refreshToken,
    });
    const req = buildRequest(session);

    const res = await proxy(req);

    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(res.headers.get("x-middleware-override-headers")).toBeNull();
  });

  it("refreshes an expired access token, sets a new session cookie, and forwards the refreshed cookie on the request", async () => {
    const expiredAccessToken = await signInnerToken(nowSeconds() - 3600);
    const refreshToken = await signInnerToken(nowSeconds() + 7 * 24 * 60 * 60);
    const session = await signSession({
      user: ADMIN_USER,
      accessToken: expiredAccessToken,
      refreshToken,
    });
    const req = buildRequest(session);

    const newAccessToken = await signInnerToken(nowSeconds() + 900);
    const newRefreshToken = await signInnerToken(nowSeconds() + 7 * 24 * 60 * 60);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ accessToken: newAccessToken, refreshToken: newRefreshToken }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await proxy(req);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      REFRESH_URL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      }),
    );

    // A fresh, validly-signed session cookie is set on the response.
    const setCookie = res.cookies.get("session");
    expect(setCookie?.value).toBeTruthy();
    const { payload: newSessionPayload } = await jwtVerify<Session>(
      setCookie!.value,
      TEST_ENCODED_KEY,
      { algorithms: ["HS256"] },
    );
    expect(newSessionPayload.accessToken).toBe(newAccessToken);
    expect(newSessionPayload.refreshToken).toBe(newRefreshToken);
    expect(newSessionPayload.user).toEqual(ADMIN_USER);

    // Per the cookie-propagation fix, NextResponse.next({ request: req }) is
    // used so the downstream request also observes the refreshed cookie
    // rather than the stale one that was on the inbound request.
    expect(res.headers.get("x-middleware-next")).toBe("1");
    const overrideHeaders = res.headers.get("x-middleware-override-headers");
    expect(overrideHeaders).toContain("cookie");
    expect(res.headers.get("x-middleware-request-cookie")).toBe(
      `session=${setCookie!.value}`,
    );
  });

  it("redirects to /auth/login and clears the cookie when the refresh request is not ok", async () => {
    const expiredAccessToken = await signInnerToken(nowSeconds() - 3600);
    const refreshToken = await signInnerToken(nowSeconds() + 7 * 24 * 60 * 60);
    const session = await signSession({
      user: ADMIN_USER,
      accessToken: expiredAccessToken,
      refreshToken,
    });
    const req = buildRequest(session);

    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await proxy(req);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/auth/login");
    const cleared = res.cookies.get("session");
    expect(cleared?.value).toBe("");
    expect(cleared?.expires && new Date(cleared.expires).getTime()).toBe(0);
  });

  it("redirects to /auth/login and clears the cookie when there is no refresh token, without calling fetch", async () => {
    const expiredAccessToken = await signInnerToken(nowSeconds() - 3600);
    const session = await signSession({
      user: ADMIN_USER,
      accessToken: expiredAccessToken,
      refreshToken: "",
    });
    const req = buildRequest(session);

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await proxy(req);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/auth/login");
    const cleared = res.cookies.get("session");
    expect(cleared?.value).toBe("");
    expect(cleared?.expires && new Date(cleared.expires).getTime()).toBe(0);
  });
});
