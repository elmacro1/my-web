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
  assert.match(component, /googletagmanager\.com\/gtag\/js\?id=/);
  assert.match(component, /gtag\(["']config["'],\s*measurementId\)/);
});

test("GA4 is wired into both shared layouts and replaces Vercel Analytics", async () => {
  const [homeLayout, cvLayout, packageSource, lockfile, readme] = await Promise.all([
    readSource("src/layouts/Layout.astro"),
    readSource("src/layouts/CVLayout.astro"),
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
  assert.doesNotMatch(homeLayout, /@vercel\/analytics|<Analytics\s*\/>/);

  assert.match(
    cvLayout,
    /import\s+GoogleAnalytics\s+from\s+["']\.\.\/components\/analytics\/google-analytics\.astro["'];/,
  );
  assert.match(cvLayout, /<GoogleAnalytics\s*\/>/);
  assert.doesNotMatch(cvLayout, /@vercel\/analytics|<Analytics\s*\/>/);

  assert.equal(packageJson.dependencies?.["@vercel/analytics"], undefined);
  assert.equal(typeof packageJson.dependencies?.["@vercel/speed-insights"], "string");
  assert.doesNotMatch(lockfile, /@vercel\/analytics/);
  assert.match(readme, /Google Analytics 4/);
  assert.match(readme, /@vercel\/speed-insights/);
  assert.doesNotMatch(readme, /@vercel\/analytics/);
});

test("GA4 event bridge forwards named events without Vercel Analytics", async () => {
  const [events, layout] = await Promise.all([
    readSource("src/components/analytics/analytics-events.astro"),
    readSource("src/layouts/Layout.astro"),
  ]);

  assert.match(layout, /<AnalyticsEvents\s*\/>/);
  assert.equal((events.match(/document\.addEventListener/g) ?? []).length, 1);
  assert.match(events, /analyticsWindow\.gtag\?\.\("event",\s*eventName\)/);
  assert.doesNotMatch(events, /@vercel\/analytics|track\s*\(/);
});
