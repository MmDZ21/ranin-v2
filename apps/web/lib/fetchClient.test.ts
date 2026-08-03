import { afterEach, describe, expect, it, vi } from "vitest";

const originalBackendUrl = process.env.BACKEND_URL;
const originalPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

afterEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();

  if (originalBackendUrl === undefined) {
    delete process.env.BACKEND_URL;
  } else {
    process.env.BACKEND_URL = originalBackendUrl;
  }

  if (originalPublicApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL;
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalPublicApiUrl;
  }
});

describe("fetchClient", () => {
  it("prefers the server-only backend URL over the public browser URL", async () => {
    process.env.BACKEND_URL = "http://api.internal:3333/api";
    process.env.NEXT_PUBLIC_API_URL = "https://public.example/api";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "product-1" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { fetchClient } = await import("./fetchClient");
    const result = await fetchClient("/products/product-1");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.internal:3333/api/products/product-1",
      undefined,
    );
    expect(result).toEqual({ id: "product-1" });
  });
});
