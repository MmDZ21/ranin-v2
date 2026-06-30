import type { MetadataRoute } from "next";
import { getAllProducts } from "@/actions/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/products", "/about", "/contact"].map(
    (route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await getAllProducts();
    if (result.success && result.data) {
      productRoutes = result.data.map((product) => ({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // API unavailable at build time — ship the static routes only.
  }

  return [...staticRoutes, ...productRoutes];
}
