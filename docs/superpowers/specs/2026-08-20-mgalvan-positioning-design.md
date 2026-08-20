# mgalvan.dev positioning update design

**Date:** 2026-08-20

## Goal

Make the bilingual Home communicate Marco Galván's positioning as a Software Developer & Product Builder who works directly with clients from understanding the problem through delivery and evolution, while preserving the existing design, section order, work examples, and CV experience.

## Existing architecture

- Static Astro Home at `/` and `/es/`.
- Home copy is localized in `src/dictionaries/en.json` and `src/dictionaries/es.json`.
- `Layout.astro` owns Home title, description, Open Graph/Twitter metadata, and `ProfilePage`/`Person` JSON-LD.
- Header, Navbar, About (`ExperienceSummary`), footer, and process are existing focused Astro components.
- CV pages use the separate `CVLayout.astro` and `src/data/cv/` sources. Their routes and content are outside this change.
- The current Home passes locale-specific PDF paths through the header, About, and footer only to render CV links.

## Approved scope

### Positioning

Use these localized professional labels wherever the Home presents the professional identity:

- English: `Software Developer & Product Builder`
- Spanish: `Desarrollador de Software & Product Builder`

Update the Home hero eyebrow, header brand label, footer role, Open Graph image alt text, and Home JSON-LD. Leave README and all CV sources/content unchanged.

The hero title remains exactly:

- English: `I turn business problems into products and systems that work.`
- Spanish: `Convierto problemas de negocio en productos y sistemas que funcionan.`

The final CTA title and intent also remain unchanged.

### Direct collaboration

Append the direct-collaboration message to the existing About copy without adding a new section or component:

- English: `You work directly with me from understanding the problem to shipping and evolving the solution.`
- Spanish: `Trabajás directamente conmigo desde entender el problema hasta lanzar y evolucionar la solución.`

This keeps the independent developer advantage positive and concrete without introducing agency comparisons or unsupported claims.

### How I work

Keep the existing five-step process and numbering. Replace only the descriptions with short, outcome-oriented copy:

| Step | English | Spanish |
| --- | --- | --- |
| Understand | `I learn how the business works today, where the problem appears, and what outcome matters.` | `Entiendo cómo funciona hoy el negocio o proceso, dónde está el problema y qué resultado importa.` |
| Define | `I decide what is worth solving first and the smallest scope that can create value.` | `Determino qué vale la pena resolver primero y cuál es el alcance mínimo que genera valor.` |
| Design | `I design a simple solution around the real workflow.` | `Diseño una solución simple alrededor del flujo de trabajo real.` |
| Build | `I build and ship usable software, not just completed features.` | `Construyo y entrego software que se puede usar, no solo funcionalidades terminadas.` |
| Evolve | `I observe real usage, measure results, and improve where it makes sense.` | `Observo el uso real, mido resultados y mejoro donde tiene sentido.` |

### Selected work and hero

Keep the three existing work items, their contexts, truthful status, and current descriptions. Do not add metrics, testimonials, clients, or claims. Do not rewrite the hero title, final CTA, or introduce a redesign.

### CV separation

Remove CV access from the Home's main journey:

- Remove the CV link from `Navbar`.
- Remove the CV action from the About/`ExperienceSummary` section.
- Remove the CV link from the footer.
- Remove only the related Home `cvUrl` props and unused Home resume labels.

Keep `/cv/en/`, `/cv/es/`, the CV layouts, TypeScript sources, generated PDFs, and direct URL behavior untouched. The `CV_PATHS` constant may remain available for the CV ecosystem even if the Home no longer imports it.

## SEO and structured data

Keep the existing localized Home titles because they describe the offer and do not contain the stale professional label:

- `Digital Products, Automations & Integrations | Marco Galván`
- `Productos digitales, automatizaciones e integraciones | Marco Galván`

Update the localized Home descriptions so search and social previews include the new role and business-problem focus:

- English: `Software Developer & Product Builder helping businesses turn operational problems into digital products, automations, integrations and internal systems built to evolve.`
- Spanish: `Desarrollador de Software & Product Builder que ayuda a empresas a convertir problemas operativos en productos digitales, automatizaciones, integraciones y sistemas preparados para evolucionar.`

Update `ogImageAlt` with the localized professional label. Open Graph and Twitter descriptions/alt text continue to derive from the localized dictionary metadata. `Layout.astro` receives the localized Home role and uses it for the JSON-LD `ProfilePage.headline` and `Person.jobTitle`, preserving the existing schema shape and facts.

No CV metadata or CV JSON-LD is changed.

## Implementation boundaries

- Modify only Home dictionaries, Home-facing component props/templates/styles needed for removing the CV link, Home page wiring, the Home layout's role inputs/JSON-LD, and Home source-contract tests.
- Do not add dependencies, new sections, new visual components, or CSS redesign.
- Remove unused `.resume_link` selectors only if they are left without any Home markup after the navbar link is removed; this is cleanup of the deleted link, not a visual change.
- Preserve responsive behavior, accessibility semantics, and existing anchors.

## Validation strategy

- Update the Home source-contract tests to assert the new localized role, About sentence, process copy, metadata/JSON-LD wiring, and absence of CV links from Navbar/About/footer.
- Run `pnpm test`.
- Run `pnpm check` for Astro/TypeScript validation.
- Run `pnpm build` and inspect generated Home HTML for localized title, description, Open Graph/Twitter tags, JSON-LD role values, and no Home CV links.
- Confirm the build still emits `/cv/en/` and `/cv/es/` and that no CV source, layout, PDF, or README file changed.
