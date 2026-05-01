import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lixor-restaurant.vercel.app";
  
  const routes = [
    "",
    "/about",
    "/menu",
    "/book",
    "/gallery",
    "/blog",
    "/chef",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
