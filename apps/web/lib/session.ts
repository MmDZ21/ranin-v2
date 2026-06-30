"use server";

import { jwtVerify, SignJWT, decodeJwt } from "jose";
import { Session } from "./types";
import { ENCODED_KEY } from "./constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

export async function createSession(payload: Session) {
  const decodedRefresh = decodeJwt(payload.refreshToken);
  const expiredAt = decodedRefresh.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + SEVEN_DAYS_MS);

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
}

export async function getSession() {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("session");
  if (!jwtToken) {
    return null;
  }
  try {
    const { payload } = await jwtVerify<Session>(jwtToken.value, ENCODED_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
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

  const newPayload: Session = {
    user: { ...payload.user },
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
}
