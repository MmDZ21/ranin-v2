"use server";

import { jwtVerify, SignJWT, decodeJwt } from "jose";
import { Session } from "./types";
import { ENCODED_KEY } from "./constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSession(payload: Session) {
  console.log("[Session] Creating new session...");
  const decodedRefresh = decodeJwt(payload.refreshToken);
  const expiredAt = decodedRefresh.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  console.log(`[Session] Expiration set to: ${expiredAt.toISOString()}`);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiredAt)
    .sign(ENCODED_KEY);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
  console.log("[Session] Session cookie set successfully.");
}

export async function getSession() {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("session");
  if (!jwtToken) {
    console.log("[Session] No session cookie found in getSession.");
    return null;
  }
  try {
    const { payload } = await jwtVerify(jwtToken.value, ENCODED_KEY, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (error) {
    console.error("[Session] Error verifying session in getSession:", error);
    // Don't log sensitive token information
    redirect("/auth/login");
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  if (!cookie) return null;

  const { payload } = await jwtVerify<Session>(cookie, ENCODED_KEY, {
    algorithms: ["HS256"],
  });

  if (!payload) throw new Error("session not found");

  const newPayload : Session= {
    user : {
      ...payload.user,
    },
    accessToken,
    refreshToken
  }

  await createSession(newPayload);
}
