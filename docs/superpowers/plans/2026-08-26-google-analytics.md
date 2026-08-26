# Google Analytics 4 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox ("- [ ]") syntax for tracking.

**Goal:** Add GA4 page and interaction measurement to every HTML route in the Astro site, remove Vercel Analytics, and keep Vercel Speed Insights for performance monitoring.

**Architecture:** Add one focused 'GoogleAnalytics.astro' component that bootstraps the native Google tag from a single public Measurement ID constant. Mount it in the shared Home and CV layouts. Keep the existing delegated Home event listener, changing its only destination from Vercel Analytics to the GA4 'gtag' event API.

**Tech Stack:** Astro 7.2.4, TypeScript strict mode, static output, pnpm, native Google Analytics 4 'gtag.js', '@vercel/speed-insights'.

## Global Constraints

- Use the exact GA4 Measurement ID 'G-7Y7QZ4BZ5H'.
- Measure '/', '/es/', '/cv/en/', and '/cv/es/'.
- GA4 is the only product-analytics provider; remove '@vercel/analytics' completely.
- Keep '@vercel/speed-insights' and its existing Home-layout integration unchanged.
- Do not add Google Tag Manager, new dependencies, a consent UI, or Consent Mode in this change.
- Do not send personally identifiable information, URL query strings, or other user-entered values to GA4.
- Load Google asynchronously and make analytics failures harmless to navigation and page interactions.
- Keep the Measurement ID in one exported public site constant rather than requiring a deployment environment variable.

---

## File Map

- Modify: 'scripts/home-source.test.mjs' — update the existing Home analytics source contract from Vercel 'track' to GA4 'gtag'.
- Create: 'scripts/analytics-source.test.mjs' — assert the GA4 component, both layouts, provider removal, package metadata, and README documentation.
- Modify: 'src/consts.ts' — export 'GOOGLE_ANALYTICS_MEASUREMENT_ID'.
- Create: 'src/components/analytics/google-analytics.astro' — initialize 'dataLayer', 'gtag', and the external Google tag.
- Modify: 'src/components/analytics/analytics-events.astro' — forward existing named events to GA4 only.
- Modify: 'src/layouts/Layout.astro' — replace Vercel Analytics with the Google component in the Home layout.
- Modify: 'src/layouts/CVLayout.astro' — mount the Google component for both CV routes.
- Modify: 'package.json' and 'pnpm-lock.yaml' — remove '@vercel/analytics'; retain '@vercel/speed-insights'.
- Modify: 'README.md' — document GA4 and Speed Insights accurately.

## Task 1: Add failing source-contract tests

**Files:**
- Modify: 'scripts/home-source.test.mjs'
- Create: 'scripts/analytics-source.test.mjs'

**Interfaces:**
- Produces test contracts for 'GOOGLE_ANALYTICS_MEASUREMENT_ID', 'GoogleAnalytics.astro', both shared layouts, the GA4 event bridge, package removal, and README documentation.

- [ ] **Step 1: Replace the existing Vercel-specific Home analytics test**

Replace the final 'Home analytics uses one shared event listener and named events' test in 'scripts/home-source.test.mjs' with this GA4 contract:

~~~js
test("Home analytics uses one shared GA4 event listener and named events", async () => {
  const sources = await Promise.all([
    readSource("src/layouts/Layout.astro"),
    readSource("src/components/navbar/navbar.astro"),
    readSource("src/components/contact-cta/contact-cta.astro"),
    readSource("src/components/footer/footer.astro"),
    readSource("src/components/experience-summary/experience-summary.astro"),
    readSource("src/components/hero/hero.astro"),
  ]);
  const [layout, ...components] = sources;
  const source = components.join("\n");
  const analytics = await readSource("src/components/analytics/analytics-events.astro");

  assert.match(layout, /AnalyticsEvents/);
  assert.match(analytics, /gtag/);
  assert.doesNotMatch(analytics, /@vercel\/analytics|track\s*\(/);
  assert.equal((analytics.match(/document\.addEventListener/g) ?? []).length, 1);
  for (const eventName of [
    "contact_cta_clicked",
    "email_clicked",
    "linkedin_clicked",
    "github_clicked",
    "x_clicked",
    "language_changed",
  ]) {
    assert.match(source, new RegExp(eventName));
  }
});
~~~

- [ ] **Step 2: Add focused GA4 integration contracts**

Create 'scripts/analytics-source.test.mjs' with the following complete contents:

~~~js
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
~~~

- [ ] **Step 3: Run the new contracts and confirm they fail for the missing implementation**

Run:

~~~bash
pnpm test
~~~

Expected: FAIL because 'google-analytics.astro' does not exist yet, the layouts still use Vercel Analytics, and the event listener still imports 'track'. Existing unrelated tests should remain green.

- [ ] **Step 4: Commit the failing tests**

~~~bash
git add scripts/home-source.test.mjs scripts/analytics-source.test.mjs
git commit -m "test: define Google Analytics integration contracts"
~~~

## Task 2: Add the GA4 bootstrap component

**Files:**
- Modify: 'src/consts.ts'
- Create: 'src/components/analytics/google-analytics.astro'

**Interfaces:**
- Consumes: no earlier implementation; uses the existing site constants module.
- Produces: 'GOOGLE_ANALYTICS_MEASUREMENT_ID' and a 'GoogleAnalytics.astro' component that defines 'window.gtag' before the asynchronous Google script resolves.

- [ ] **Step 1: Add the single public Measurement ID constant**

Append this export to 'src/consts.ts':

~~~ts
export const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-7Y7QZ4BZ5H";
~~~

- [ ] **Step 2: Create the Google tag component**

Create 'src/components/analytics/google-analytics.astro' with this complete implementation:

~~~astro
---
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from "../../consts";

const measurementId = GOOGLE_ANALYTICS_MEASUREMENT_ID;
---

<script
    async
    src={"https://www.googletagmanager.com/gtag/js?id=" + measurementId}
></script>
<script define:vars={{ measurementId }}>
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
</script>
~~~

The first script is asynchronous. The second script runs immediately and creates the queue, so page views and early events are queued until Google's script is ready.

- [ ] **Step 3: Run the component contract only**

Run:

~~~bash
node --test --test-name-pattern="Google Analytics component" scripts/analytics-source.test.mjs
~~~

Expected: PASS for the component contract. The layout and event contracts remain red until Task 3.

- [ ] **Step 4: Run formatting checks and commit the bootstrap**

Run:

~~~bash
git diff --check
~~~

Expected: no output and exit code 0.

Commit:

~~~bash
git add src/consts.ts src/components/analytics/google-analytics.astro
git commit -m "feat: add Google Analytics bootstrap"
~~~

## Task 3: Wire GA4 into both layouts and remove Vercel Analytics

**Files:**
- Modify: 'src/layouts/Layout.astro'
- Modify: 'src/layouts/CVLayout.astro'
- Modify: 'src/components/analytics/analytics-events.astro'
- Modify: 'package.json'
- Modify: 'pnpm-lock.yaml'
- Modify: 'README.md'

**Interfaces:**
- Consumes: 'GoogleAnalytics.astro' and 'GOOGLE_ANALYTICS_MEASUREMENT_ID' from Task 2.
- Produces: page views on all four route families and GA4-only named interaction events on Home.

- [ ] **Step 1: Replace the Home layout provider**

In 'src/layouts/Layout.astro', remove:

~~~astro
import Analytics from "@vercel/analytics/astro";
~~~

Add:

~~~astro
import GoogleAnalytics from "../components/analytics/google-analytics.astro";
~~~

Replace the analytics mounts:

~~~astro
<Analytics />
<SpeedInsights />
<AnalyticsEvents />
~~~

with:

~~~astro
<GoogleAnalytics />
<SpeedInsights />
<AnalyticsEvents />
~~~

- [ ] **Step 2: Mount GA4 in the CV layout**

In 'src/layouts/CVLayout.astro', add this import with the other component imports:

~~~astro
import GoogleAnalytics from "../components/analytics/google-analytics.astro";
~~~

Inside the existing '<head>', add:

~~~astro
<GoogleAnalytics />
~~~

Do not add Vercel Analytics or Speed Insights to the CV layout; the approved scope adds Google page measurement while leaving the existing Speed Insights Home integration unchanged.

- [ ] **Step 3: Make the delegated listener GA4-only**

Replace the complete contents of 'src/components/analytics/analytics-events.astro' with:

~~~astro
---
---

<script>
    type AnalyticsWindow = Window & {
        gtag?: (command: "event", eventName: string) => void;
    };

    const analyticsWindow = window as AnalyticsWindow;

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;

        const trigger = event.target.closest<HTMLElement>(
            "[data-analytics-event]",
        );
        const eventName = trigger?.dataset.analyticsEvent;

        if (eventName) analyticsWindow.gtag?.("event", eventName);
    });
</script>
~~~

This preserves one delegated listener and the existing 'data-analytics-event' names without importing a second analytics SDK or sending event parameters.

- [ ] **Step 4: Remove the Vercel Analytics package**

Run:

~~~bash
pnpm remove @vercel/analytics
~~~

Expected: 'package.json' no longer lists '@vercel/analytics', 'pnpm-lock.yaml' no longer contains its importer or package entries, and '@vercel/speed-insights' remains installed.

- [ ] **Step 5: Update the README analytics description**

In 'README.md', replace:

~~~md
- `@vercel/analytics` and `@vercel/speed-insights` in the shared Home layout.
- A small delegated Analytics listener tracks the approved Home interactions without framework hydration.
~~~

with:

~~~md
- Google Analytics 4 in the shared Home and CV layouts, and `@vercel/speed-insights` in the shared Home layout.
- A small delegated Analytics listener sends the approved Home interactions to Google Analytics 4 without framework hydration.
~~~

- [ ] **Step 6: Run all source contracts**

Run:

~~~bash
pnpm test
~~~

Expected: PASS with all existing Home, CV, localization, and analytics contracts green.

- [ ] **Step 7: Verify the provider removal and commit the integration**

Run:

~~~bash
if rg -n "@vercel/analytics" src package.json pnpm-lock.yaml README.md; then
  exit 1
fi
~~~

Expected: no output and exit code 0. References in the design/specification documents are allowed because they explain the removed provider.

Commit:

~~~bash
git add src/layouts/Layout.astro src/layouts/CVLayout.astro src/components/analytics/analytics-events.astro package.json pnpm-lock.yaml README.md
git commit -m "feat: use GA4 as the site analytics provider"
~~~

## Task 4: Run full validation and inspect generated routes

**Files:**
- Inspect only: 'dist/index.html', 'dist/es/index.html', 'dist/cv/en/index.html', 'dist/cv/es/index.html'

**Interfaces:**
- Consumes: the completed GA4 integration from Tasks 1–3.
- Produces: verified static HTML containing one Google tag configuration per route family and no Vercel Analytics dependency/import.

- [ ] **Step 1: Run Astro type and template checks**

Run:

~~~bash
pnpm check
~~~

Expected: Astro check completes with zero errors.

- [ ] **Step 2: Build the static site**

Run:

~~~bash
pnpm build
~~~

Expected: Astro generates the four HTML routes and exits successfully.

- [ ] **Step 3: Confirm the Google tag is present in all four HTML outputs**

Run:

~~~bash
rg -n "googletagmanager\.com/gtag/js|G-7Y7QZ4BZ5H|gtag\(\"config\"" \
  dist/index.html \
  dist/es/index.html \
  dist/cv/en/index.html \
  dist/cv/es/index.html
~~~

Expected: each file contains the asynchronous Google tag URL and the exact Measurement ID/configuration. The generated output must contain no more than one Google tag bootstrap per HTML document.

- [ ] **Step 4: Run the complete test suite once more**

Run:

~~~bash
pnpm test
~~~

Expected: PASS.

- [ ] **Step 5: Check the final diff**

Run:

~~~bash
git diff --check
git status --short
~~~

Expected: no whitespace errors. 'dist/' remains ignored and no unrelated files are modified.

## Post-deployment verification

After deploying the commit to Vercel:

1. Open 'https://mgalvan.dev/' in a clean browser session.
2. In GA4, open 'Informes → Tiempo real' and confirm a 'page_view' appears.
3. Visit '/es/' and one '/cv/...' route and confirm their page paths appear in real-time data.
4. Click the contact CTA and confirm 'contact_cta_clicked' appears as an event.
5. Confirm the data-stream warning disappears after GA4 receives data. Browser ad blockers can prevent this check, so use an unblocked session if needed.
