import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const file = (path) => new URL(path, root);
const readSource = (path) => readFile(file(path), "utf8");
const readProductionSources = async (directory = file("src/")) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const sources = await Promise.all(
    entries.map(async (entry) => {
      const path = new URL(entry.name, directory);
      if (entry.isDirectory()) return readProductionSources(new URL(`${entry.name}/`, directory));
      if (entry.isFile()) {
        return [{ path: path.href, source: await readFile(path, "utf8") }];
      }
      return [];
    }),
  );
  return sources.flat();
};

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
  assert.match(component, /window\.gtag\(\s*["']config["']\s*,\s*measurementId\s*\)/);
  assert.doesNotMatch(component, /window\.gtag\(\s*["']config["']\s*,\s*measurementId\s*,/);
  assert.doesNotMatch(
    component,
    /(?:email|phone|name|address|user[_-]?id|client[_-]?id|customer[_-]?id|\bip\b|user[_-]?data)/i,
  );
  assert.match(component, /<script[^>]+async[^>]+src=/);
  assert.match(component, /window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/);
  assert.match(component, /function\s+gtag\(\)\s*\{\s*(?:window\.)?dataLayer\.push\(arguments\)/s);
  assert.match(component, /dataLayer.*gtag.*config/s);
  assert.doesNotMatch(component, /GTM-[A-Z0-9]+/);
  assert.doesNotMatch(component, /(?:gtag\s*\(\s*["']consent|Consent Mode|consent_mode|cookieconsent|Cookiebot|OneTrust)/);
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
  assert.doesNotMatch(cvLayout, /@vercel\/speed-insights\/astro|<SpeedInsights\s*\/>/);
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
    assert.doesNotMatch(source, /(?:gtag\s*\(\s*["']consent|Consent Mode|consent_mode|cookieconsent|Cookiebot|OneTrust)/);
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
  assert.match(events, /try\s*\{[\s\S]*analyticsWindow\.gtag\?\.[\s\S]*\}\s*catch(?:\s*\([^)]*\))?\s*\{/);
  assert.doesNotMatch(events, /analyticsWindow\.gtag\?\.\("event",\s*eventName\s*,/);
  assert.doesNotMatch(events, /@vercel\/analytics|track\s*\(/);
  assert.doesNotMatch(events, /GTM-[A-Z0-9]+|(?:gtag\s*\(\s*["']consent|Consent Mode|consent_mode|cookieconsent|Cookiebot|OneTrust)/);
  assert.doesNotMatch(
    events,
    /event\.target\.value|FormData|event\.detail|location\.href|location\.search|URLSearchParams|innerText|textContent|input\.value|dataset\.[A-Za-z]+\s*\+/,
  );
  assert.doesNotMatch(events, /gtag\?\.\([^)]*(?:target|detail|location|search|URLSearchParams|innerText|textContent|value|FormData)/s);
});

test("Production source tree contains no disallowed analytics integrations or payloads", async () => {
  const sources = await readProductionSources();
  const measurementIdDeclarations = sources.reduce(
    (count, { source }) => count + (source.match(/export\s+const\s+GOOGLE_ANALYTICS_MEASUREMENT_ID\s*=/g) ?? []).length,
    0,
  );
  const consts = sources.find(({ path }) => path.endsWith("/src/consts.ts"));
  assert.equal(measurementIdDeclarations, 1);
  assert.match(consts?.source ?? "", /export\s+const\s+GOOGLE_ANALYTICS_MEASUREMENT_ID\s*=\s*["']G-7Y7QZ4BZ5H["'];/);
  assert.equal((consts?.source.match(/G-7Y7QZ4BZ5H/g) ?? []).length, 1);

  for (const { path, source } of sources) {
    assert.doesNotMatch(source, /@vercel\/analytics/, path);
    assert.doesNotMatch(source, /GTM-[A-Z0-9]+|googletagmanager\.com\/gtm\.js/, path);
    assert.doesNotMatch(source, /(?:GOOGLE_ANALYTICS|GA4|MEASUREMENT_ID)[^\n]*(?:import\.meta\.env|process\.env)|(?:import\.meta\.env|process\.env)[^\n]*(?:GOOGLE_ANALYTICS|GA4|MEASUREMENT_ID)/i, path);
    assert.doesNotMatch(source, /gtag\?\.?(?:\s*)\([^)]*,[^)]*,/s, path);
    assert.doesNotMatch(
      source,
      /event\.target\.value|FormData|event\.detail|location\.href|location\.search|URLSearchParams|innerText|textContent|input\.value|gtag(?:\?\.)?\s*\([^)]*(?:target|detail|location|search|URLSearchParams|innerText|textContent|value|FormData)/is,
      path,
    );
  }

  const scriptTags = sources.flatMap(({ source }) =>
    [...source.matchAll(/<script\b[^>]*\bsrc\s*=\s*(?:(["'])([^"']+)\1|\{([\s\S]*?)\})[^>]*>/gi)].map(
      ([tag, , quoted, expression]) => ({ tag, src: quoted ?? expression }),
    ),
  );
  const externalScriptTags = scriptTags.filter(({ src }) => /https?:\/\//i.test(src));
  assert.equal(externalScriptTags.length, 1);
  assert.match(externalScriptTags[0].src, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/i);
  assert.match(externalScriptTags[0].tag, /\basync\b/i);
});
