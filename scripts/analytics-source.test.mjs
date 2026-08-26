import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const file = (path) => new URL(path, root);
const readSource = (path) => readFile(file(path), "utf8");

test("Google Analytics component uses the configured public Measurement ID", async () => {
  const [consts, component] = await Promise.all([
    readSource("src/consts.ts"),
    readSource("src/components/analytics/google-analytics.astro"),
  ]);

  assert.match(
    consts,
    /export const GOOGLE_ANALYTICS_MEASUREMENT_ID\s*=\s*["']G-7Y7QZ4BZ5H["'];/,
  );
  assert.match(
    component,
    /import\s+\{\s*GOOGLE_ANALYTICS_MEASUREMENT_ID\s*\}\s+from\s+["']\.\.\/\.\.\/consts["'];/,
  );
  assert.match(
    component,
    /measurementId\s*=\s*GOOGLE_ANALYTICS_MEASUREMENT_ID/,
  );
  assert.match(
    component,
    /googletagmanager\.com\/gtag\/js\?id=\$\{measurementId\}/,
  );
  assert.match(component, /gtag\(["']config["'],\s*measurementId\)/);
  assert.match(component, /<script[^>]+async[^>]+src=/);
  assert.match(component, /window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/);
  assert.match(component, /function\s+gtag\(\)\s*\{\s*dataLayer\.push\(arguments\)/s);
  assert.match(component, /dataLayer.*gtag.*config/s);
  assert.doesNotMatch(component, /GTM-[A-Z0-9]+/);
  assert.doesNotMatch(component, /consent|Consent|cookie|Cookie/);
  assert.doesNotMatch(component, /location\.search|URLSearchParams|input\.value/);
});

test("GA4 is wired into both shared layouts and replaces Vercel Analytics", async () => {
  const [homeLayout, cvLayout, indexRoute, spanishRoute, cvEnglish, cvSpanish, packageSource, lockfile, readme] = await Promise.all([
    readSource("src/layouts/Layout.astro"),
    readSource("src/layouts/CVLayout.astro"),
    readSource("src/pages/index.astro"),
    readSource("src/pages/es/index.astro"),
    readSource("src/pages/cv/en.astro"),
    readSource("src/pages/cv/es.astro"),
    readSource("package.json"),
    readSource("pnpm-lock.yaml"),
    readSource("README.md"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.match(
    homeLayout,
    /import\s+GoogleAnalytics\s+from\s+["']\.\.\/components\/analytics\/google-analytics\.astro["'];/,
  );
  assert.match(homeLayout, /<GoogleAnalytics\s*\/>/);
  assert.match(homeLayout, /<SpeedInsights\s*\/>/);
  assert.match(homeLayout, /import\s+SpeedInsights\s+from\s+["']@vercel\/speed-insights\/astro["'];/);
  assert.doesNotMatch(homeLayout, /@vercel\/analytics|<Analytics\s*\/>/);

  assert.match(
    cvLayout,
    /import\s+GoogleAnalytics\s+from\s+["']\.\.\/components\/analytics\/google-analytics\.astro["'];/,
  );
  assert.match(cvLayout, /<GoogleAnalytics\s*\/>/);
  assert.match(cvLayout, /import\s+SpeedInsights\s+from\s+["']@vercel\/speed-insights\/astro["'];/);
  assert.doesNotMatch(cvLayout, /@vercel\/analytics|<Analytics\s*\/>/);

  assert.match(indexRoute, /import\s+Layout\s+from\s+["']\.\.\/layouts\/Layout\.astro["'];/);
  assert.match(indexRoute, /<Layout\b/);
  assert.match(spanishRoute, /import\s+Layout\s+from\s+["']\.\.\/\.\.\/layouts\/Layout\.astro["'];/);
  assert.match(spanishRoute, /<Layout\b/);
  assert.match(cvEnglish, /import\s+CVLayout\s+from\s+["']\.\.\/\.\.\/layouts\/CVLayout\.astro["'];/);
  assert.match(cvEnglish, /<CVLayout\b/);
  assert.match(cvSpanish, /import\s+CVLayout\s+from\s+["']\.\.\/\.\.\/layouts\/CVLayout\.astro["'];/);
  assert.match(cvSpanish, /<CVLayout\b/);

  assert.equal(packageJson.dependencies?.["@vercel/analytics"], undefined);
  assert.equal(typeof packageJson.dependencies?.["@vercel/speed-insights"], "string");
  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), [
    "@astrojs/sitemap",
    "@fontsource/geist-sans",
    "@vercel/speed-insights",
    "astro",
  ]);
  assert.deepEqual(Object.keys(packageJson.devDependencies).sort(), [
    "@astrojs/check",
    "playwright",
    "typescript",
  ]);
  assert.doesNotMatch(lockfile, /@vercel\/analytics/);
  assert.doesNotMatch(lockfile, /GTM-[A-Z0-9]+|googletagmanager\.com\/gtm\.js/);
  assert.match(readme, /Google Analytics 4/);
  assert.match(readme, /@vercel\/speed-insights/);
  assert.doesNotMatch(readme, /@vercel\/analytics/);
  for (const source of [homeLayout, cvLayout, lockfile, readme]) {
    assert.doesNotMatch(source, /GTM-[A-Z0-9]+|googletagmanager\.com\/gtm\.js/);
    assert.doesNotMatch(source, /consent|Consent|cookie|Cookie/);
  }
});

test("GA4 event bridge forwards named events without Vercel Analytics", async () => {
  const [events, layout] = await Promise.all([
    readSource("src/components/analytics/analytics-events.astro"),
    readSource("src/layouts/Layout.astro"),
  ]);

  assert.match(layout, /<AnalyticsEvents\s*\/>/);
  assert.equal((events.match(/document\.addEventListener/g) ?? []).length, 1);
  assert.match(events, /analyticsWindow\.gtag\?\.\("event",\s*eventName\)/);
  assert.match(events, /if\s*\(eventName\).*analyticsWindow\.gtag\?\./s);
  assert.match(events, /try\s*\{[\s\S]*analyticsWindow\.gtag\?\.[\s\S]*\}\s*catch\s*\(/);
  assert.doesNotMatch(events, /analyticsWindow\.gtag\?\.\("event",\s*eventName\s*,/);
  assert.doesNotMatch(events, /@vercel\/analytics|track\s*\(/);
  assert.doesNotMatch(events, /GTM-[A-Z0-9]+|consent|Consent|cookie|Cookie/);
  assert.doesNotMatch(
    events,
    /event\.target\.value|FormData|event\.detail|location\.href|location\.search|URLSearchParams|innerText|textContent|input\.value|dataset\.[A-Za-z]+\s*\+/,
  );
  assert.doesNotMatch(events, /gtag\([^)]*(?:target|detail|location|search|URLSearchParams|innerText|textContent|value|FormData)/s);
});
