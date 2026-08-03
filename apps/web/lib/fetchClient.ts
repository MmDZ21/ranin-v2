export const API_URL =
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;

const DEFAULT_DELAY_MS = Number(process.env.NEXT_PUBLIC_API_DELAY_MS || 0);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const fetchClient = async (
  url: string,
  options?: RequestInit,
  delayMs: number = DEFAULT_DELAY_MS
) => {
  if (delayMs > 0) {
    await sleep(delayMs);
  }

  const base = API_URL ? (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL) : '';
  const path = url.startsWith('/') ? url : `/${url}`;

  const response = await fetch(base + path, options);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed: ${response.status}`);
  }

  return response.json();
};
