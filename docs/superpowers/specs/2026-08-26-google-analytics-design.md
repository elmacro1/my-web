# Google Analytics 4 integration design

**Date:** 2026-08-26

## Goal

Add Google Analytics 4 to the static Astro site so page views are measured across the Home and CV routes, using GA4 as the only product-analytics provider and preserving Vercel Speed Insights for performance monitoring.

## Existing architecture

- Static Astro site deployed to Vercel at `https://mgalvan.dev`.
- Home routes `/` and `/es/` share `src/layouts/Layout.astro`.
- CV routes `/cv/en/` and `/cv/es/` share `src/layouts/CVLayout.astro`.
- The Home layout already mounts `@vercel/analytics/astro`, `@vercel/speed-insights/astro`, and `src/components/analytics/analytics-events.astro`.
- Home links use `data-analytics-event` for `contact_cta_clicked`, `linkedin_clicked`, `email_clicked`, `github_clicked`, `x_clicked`, and `language_changed`.
- No Google Tag Manager container is used.

## Approved scope

### Page measurement

Load the Google tag with the supplied GA4 Measurement ID `G-7Y7QZ4BZ5H` in both shared layouts. This covers page views for:

- `/`
- `/es/`
- `/cv/en/`
- `/cv/es/`

Use the Google tag's default `page_view` behavior. Because the site uses normal document navigation rather than a client-side router, each route load naturally produces one page view.

### Interaction events

Keep the existing delegated analytics listener, but make GA4 its only destination: each existing `data-analytics-event` trigger is sent to GA4 with the same event name. Do not add new event names or attach personal data or URL/query-string values to events.

Remove Vercel Analytics completely:

- Remove the `@vercel/analytics` dependency.
- Remove its Astro component from `Layout.astro`.
- Remove the Vercel `track` call from the delegated listener.
- Keep `@vercel/speed-insights` and its Astro component unchanged.

### Configuration

Keep the Measurement ID in a single exported site constant. It is intentionally public client-side configuration, not a secret, and this avoids a deployment silently omitting the tag when a Vercel environment variable has not been configured.

### Privacy boundary

Do not add a consent banner or Consent Mode implementation in this change. Do not send personally identifiable information to GA4. If the site later targets jurisdictions or audiences requiring consent-based analytics, add that as a separate privacy/consent project before loading the tag for those visitors.

## Architecture and data flow

Add a focused `GoogleAnalytics.astro` component that owns the Google tag bootstrap and receives the shared Measurement ID from `src/consts.ts`.

Mount the component once in `Layout.astro` and once in `CVLayout.astro`. Keep the Google tag bootstrap separate from the event listener, and leave Vercel Speed Insights independent because it measures performance rather than product analytics.

The browser flow is:

```text
document load
  -> Google tag initializes dataLayer and configures G-7Y7QZ4BZ5H
  -> GA4 receives page_view

click on [data-analytics-event]
  -> existing listener sends the event name to GA4 when gtag is available
```

The GA4 call is guarded so a blocked script or unavailable network does not break navigation or page interactions.

## Error handling and performance

- Load Google's script asynchronously.
- Define the local `gtag` queue before the external script resolves so early clicks are queued instead of lost.
- Treat analytics as best-effort: no navigation, rendering, or contact action depends on successful telemetry.
- Avoid loading Google Analytics more than once per document by mounting it once per layout.

## Implementation boundaries

- Add the Measurement ID constant and the dedicated Google Analytics component.
- Mount the component in both shared layouts.
- Update the existing event listener to forward approved event names to GA4.
- Remove the Vercel Analytics dependency and component while keeping Speed Insights.
- Update `README.md` so the documented analytics architecture matches the implementation.
- Do not introduce Google Tag Manager, new dependencies, consent UI, or unrelated event instrumentation.

## Validation strategy

- Run `pnpm test`.
- Run `pnpm check` for Astro and TypeScript validation.
- Run `pnpm build`.
- Inspect generated HTML for the GA4 script/configuration and the Measurement ID in both Home and CV output.
- Confirm existing event names remain in source, the event listener calls GA4, and no Vercel Analytics dependency/import remains.
- After deployment, use GA4 `Tiempo real` and Tag Assistant/browser network tools to confirm a page view arrives for the public site.
