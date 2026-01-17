import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://puppyinsurance.quest";

  // Static pages
  const staticPages = [
    "",
    "/puppy-insurance",
    "/best-puppy-insurance",
    "/cheap-puppy-insurance",
    "/puppy-insurance-cost",
    "/compare-pet-insurance",
    "/new-puppy-guide",
    "/jack-russell-insurance",
    "/pug-insurance",
    "/cockapoo-insurance",
    "/cavapoo-insurance",
    "/dachshund-insurance",
    "/french-bulldog-insurance",
    "/labrador-insurance",
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
