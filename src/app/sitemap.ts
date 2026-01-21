import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://arcticprohvac.com";

  const routes = [
    "",
    "/services",
    "/service-areas",
    "/financing",
    "/about",
    "/contact",
    "/book",
  ];

  const serviceRoutes = services.map((service) => `/services/${service.slug}`);

  const allRoutes = [...routes, ...serviceRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
