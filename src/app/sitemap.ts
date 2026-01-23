import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tractorinsurance.quest";

  // Static pages
  const staticPages = [
    "",
    "/tractor-insurance",
    "/best-tractor-insurance",
    "/cheap-tractor-insurance",
    "/tractor-insurance-cost",
    "/compare-tractor-insurance",
    "/utility-tractor-insurance",
    "/mini-tractor-insurance",
    "/compact-tractor-insurance",
    "/garden-tractor-insurance",
    "/ride-on-mower-insurance",
    "/vintage-tractor-insurance",
    "/farm-tractor-insurance",
    "/dashboard",
    "/terms-of-service",
    "/privacy-policy",
    "/cookie-policy",
    "/site-map",
  ];

  const routes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" as const : "weekly" as const,
    priority: route === "" ? 1 : route.includes("insurance") ? 0.9 : 0.7,
  }));

  return routes;
}
