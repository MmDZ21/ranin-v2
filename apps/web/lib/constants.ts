// Server-only configuration. These values must never be exposed to the client
// (no NEXT_PUBLIC_*). Imported exclusively by server actions, the session
// helpers, and the proxy (middleware).

const apiUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error(
    "BACKEND_URL (or NEXT_PUBLIC_API_URL) is not set. See apps/web/.env.example.",
  );
}

const sessionSecret = process.env.SESSION_SECRET_KEY;
if (!sessionSecret || sessionSecret.length < 16) {
  throw new Error(
    "SESSION_SECRET_KEY must be set and at least 16 characters. See apps/web/.env.example.",
  );
}

export const API_URL = apiUrl;
export const SESSION_SECRET = sessionSecret;
export const ENCODED_KEY = new TextEncoder().encode(sessionSecret);
