# English CV Page and PDF Export Design

## Objective

Add a new English CV experience to the existing Astro portfolio at `/cv/en` and generate a matching, text-based PDF at `public/Marco-Galvan-CV-EN.pdf` through Playwright. The new implementation must be visually independent from the portfolio's dark shell while reusing its local Geist Sans font, package manager, existing GitHub URL, and branding context.

The existing PDF remains untouched until the new page has passed build, export, visual, content, link, and text-selectability checks.

## Context and constraints

- The project is Astro 6 with TypeScript strict mode, CSS Modules, pnpm, local `@fontsource/geist-sans`, and no existing Playwright or CV page implementation.
- The portfolio's global layout is intentionally dark and includes portfolio-specific analytics, metadata, and navigation. The CV must not inherit those global visual behaviors.
- The existing CV files are `public/Marco-Galvan-CV-EN.pdf` and `public/Marco-Galvan-CV-ES.pdf`.
- The real GitHub profile is `https://github.com/mgalvan-dev`, defined in `src/consts.ts`.
- The visual language is restrained: white page, near-black text, light gray rules, and a small accent derived from the existing green branding. The exact `#4ade80` token may be darkened for print-safe use if the bright value is visually excessive.
- No external font, image, icon, or runtime data request may be required by the CV page or export script.
- The CV content must not invent metrics, employers, dates, technologies, achievements, or a public URL for POS Despensa.
- Capsule Codes must render exactly `September 2025 – June 2026`.
- Dam Squad must render exactly `September 2025 – Present`.
- Body text in print must remain approximately 9.5–10pt or larger; legibility takes priority over forcing one page.

## Architecture

### Route and shell

Create `src/pages/cv/en.astro`, which renders a standalone `CVLayout.astro`. The CV layout owns the document metadata, local font imports, white print-safe document styles, and the A4 page wrapper. It must not use the existing `Layout.astro`, so the portfolio's dark `color-scheme`, analytics, social navigation, and animation rules cannot leak into the CV.

The page uses semantic HTML:

- one `h1` for Marco Galván;
- `header` for identity and contact links;
- `main` for the document body;
- one `section` per required CV section;
- `article` for each experience and project;
- real unordered lists for bullets;
- real anchors for all contact and website links.

### Data model

Create a reusable type contract in `src/data/cv/types.ts` and the English source in `src/data/cv/en.ts`. The page and components receive data through props and do not contain the CV copy inline.

The type contract must support:

- header identity, location, and contact links;
- a summary represented by paragraphs;
- experience entries with role, company, period, and bullet descriptions;
- projects with optional URL, description, highlights, and technologies;
- skill groups with category labels and skill names;
- spoken languages with proficiency labels.

The English data must be complete for all required sections. A future `src/data/cv/es.ts` can implement the same contract and be rendered by a future `src/pages/cv/es.astro` without changing the layout or component interfaces.

The data must use:

- the email `elmacro11@gmail.com`;
- the website `https://mgalvan.dev`;
- the LinkedIn URL `https://www.linkedin.com/in/mgalvan26`;
- the existing GitHub URL from `src/consts.ts`;
- no public URL for POS Despensa;
- the existing Invoice App URL only if it is represented as an already-known project link, never an invented URL.

### Components

Use only focused components that improve maintainability:

- `CVHeader.astro`: identity, role, location, and contact links;
- `CVSection.astro`: shared section heading and content wrapper;
- `ExperienceItem.astro`: one role, employer, period, and bullet list;
- `ProjectItem.astro`: one project description, optional highlights, and technologies;
- `SkillsGroup.astro`: one category label and a readable inline skill list.

The route owns the section ordering and passes the typed data to these components. No component may recreate or translate the content.

## Visual design

The browser view shows the A4 page centered on a very light neutral canvas so its boundaries are legible on screen. The document itself is white, with a constrained `210mm` width and `297mm` minimum height. Internal padding is generous enough for print margins while keeping the content dense enough to be practical.

The header creates the strongest hierarchy:

- name as the primary heading;
- role directly below it;
- location and contact links in a compact, wrapping row;
- no profile photo or decorative iconography.

Section headings use uppercase or small-caps-like letter spacing only when it improves scanning, with a subtle rule or accent marker. The accent is used sparingly for section rules or a small header detail; all substantive text remains grayscale. The layout does not use cards, sidebars, progress bars, timelines, charts, tables, or decorative graphics.

Experience and project items keep their title, company/project name, date, and first content block together whenever possible. Date text is visually secondary but remains normal selectable text. Skills are grouped as labeled lines rather than a visual table, preserving ATS parsing and compactness.

Responsive behavior applies only to the browser view: on narrow screens the page becomes fluid with reduced outer framing, while print retains the A4 geometry. No animation is used by the CV page, including in print.

## Print and export behavior

The CV stylesheet must include:

```css
@page {
  size: A4;
  margin: 0;
}
```

It must also set `-webkit-print-color-adjust: exact` and `print-color-adjust: exact` where background or accent colors are intentional. The print document must use explicit black/gray text colors, a white page background, and controlled overflow.

Experience and project blocks use `break-inside: avoid`, `page-break-inside: avoid`, and related section rules where supported. The implementation should first target one A4 page with readable 10pt body copy. If the complete content does not fit without compromising readability, a clean second page is acceptable; clipping, overlapping, or tiny text is not.

Add `scripts/export-cv.mjs`. It must:

1. start the existing Astro site locally using the project's pnpm workflow;
2. wait until `/cv/en` is reachable;
3. open that URL with Playwright;
4. wait for `document.fonts.ready` and a stable layout;
5. call `page.pdf` with A4 output, `printBackground: true`, and no browser header/footer;
6. write `public/Marco-Galvan-CV-EN.pdf`.

The script must cleanly stop the local server on success or failure and use only the project's actual package manager. The required package script is:

```json
{
  "export:cv": "node scripts/export-cv.mjs"
}
```

Playwright is the only new runtime/build dependency allowed unless the existing project setup proves another dependency is necessary.

## Validation strategy

Validation is divided into source, build, export, and artifact checks:

### Source and build

- Run the project's configured formatter, if present.
- Run the project's configured lint command, if present.
- Run Astro/TypeScript type checking using the project's available tooling.
- Run `pnpm build`.
- Confirm existing `/` and `/es` pages still build.

### Export and PDF structure

- Run `pnpm export:cv` after a successful build or local dev startup.
- Confirm `public/Marco-Galvan-CV-EN.pdf` is newly generated and the prior PDF was not removed before validation.
- Inspect page count and page dimensions with a PDF parser or `pdfinfo`.
- Extract text and verify that the PDF contains the required headings, both date strings, and the expected contact URLs.
- Confirm extracted content is normal text rather than an image.
- Inspect PDF link annotations and confirm the email, website, LinkedIn, and GitHub links are clickable.

### Visual review

- Capture `/cv/en` at desktop and narrow viewport sizes.
- Render the generated PDF page(s) to an image for visual inspection.
- Check that no block is clipped, no text overlaps, rules remain subtle, the hierarchy is legible, and the accent does not dominate.
- Confirm the output remains a single clean A4 page when it fits naturally; otherwise confirm the second page begins at a deliberate section boundary.

### Content and ATS review

- Confirm all six requested sections appear in the requested order.
- Confirm Capsule Codes is `September 2025 – June 2026`.
- Confirm Dam Squad is `September 2025 – Present`.
- Confirm no education, certifications, awards, metrics, invented URL, or other unrequested section was added.
- Confirm headings and bullets are represented by semantic text elements and the document remains selectable and parsable.

## Out of scope

- Replacing the Spanish PDF.
- Removing or changing the existing portfolio PDF until the new output has passed all checks.
- Adding `/cv/es` in this iteration.
- Changing the global portfolio layout, theme, navigation, i18n dictionaries, or existing project/experience components.
- Adding analytics, tracking, animation, images, or external content dependencies to the CV.
