// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://mgalvan.dev",
  trailingSlash: "always",
  redirects: {
    "/en": "/",
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { es: "es", en: "en" },
      },
      changefreq: "monthly",
      priority: 0.7,
    }),
  ],
});
