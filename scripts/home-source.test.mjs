import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const file = (path) => new URL(path, root);

const readJson = async (path) =>
  JSON.parse(await readFile(file(path), "utf8"));

const readSource = async (path) => readFile(file(path), "utf8");

test("Home routes use the commercial Product Builder section order", async () => {
  const routes = await Promise.all([
    readSource("src/pages/index.astro"),
    readSource("src/pages/es/index.astro"),
  ]);

  for (const route of routes) {
    for (const component of [
      "Layout",
      "Header",
      "Hero",
      "Capabilities",
      "Process",
      "Featured",
      "ExperienceSummary",
      "ContactCta",
      "Footer",
    ]) {
      assert.match(route, new RegExp(`<${component}\\b`));
    }

    const order = [
      "<Header",
      "<Hero",
      "<Capabilities",
      "<Process",
      "<Featured",
      "<ExperienceSummary",
      "<ContactCta",
      "<Footer",
    ].map((marker) => route.indexOf(marker));

    assert.ok(order.every((index) => index >= 0));
    assert.deepEqual([...order].sort((a, b) => a - b), order);
    assert.doesNotMatch(route, /<Journal\b|<Projects\b|<Experience\b/);
  }
});

test("Home dictionaries contain the bilingual Product Builder offer", async () => {
  const [english, spanish] = await Promise.all([
    readJson("src/dictionaries/en.json"),
    readJson("src/dictionaries/es.json"),
  ]);

  assert.deepEqual(Object.keys(english), Object.keys(spanish));
  assert.deepEqual(Object.keys(english.navigation), Object.keys(spanish.navigation));
  assert.deepEqual(Object.keys(english.capabilities), Object.keys(spanish.capabilities));
  assert.deepEqual(Object.keys(english.process), Object.keys(spanish.process));
  assert.deepEqual(Object.keys(english.selectedWork), Object.keys(spanish.selectedWork));
  assert.deepEqual(
    Object.keys(english.experienceSummary),
    Object.keys(spanish.experienceSummary),
  );

  assert.equal(english.hero.eyebrow, "Marco Galván · Product Builder");
  assert.equal(
    english.hero.title,
    "I turn business problems into products and systems that work.",
  );
  assert.equal(
    spanish.hero.title,
    "Convierto problemas de negocio en productos y sistemas que funcionan.",
  );
  assert.equal(english.capabilities.items.length, 3);
  assert.equal(spanish.capabilities.items.length, 3);
  assert.equal(english.process.steps.length, 5);
  assert.equal(spanish.process.steps.length, 5);
  assert.equal(english.selectedWork.items.length, 3);
  assert.equal(spanish.selectedWork.items.length, 3);

  for (const dictionary of [english, spanish]) {
    const serializedHero = JSON.stringify(dictionary.hero);
    assert.doesNotMatch(serializedHero, /React|Next\.js|React Native|TypeScript|n8n/i);
    assert.doesNotMatch(JSON.stringify(dictionary), /Open to remote opportunities|Abierto a oportunidades remotas/);
    assert.equal("journal" in dictionary, false);
  }

  assert.deepEqual(
    english.selectedWork.items.map(({ name }) => name),
    ["POS for retailers", "Amparo Seguros", "Helmcode Cloud Products"],
  );
  assert.deepEqual(
    spanish.selectedWork.items.map(({ name }) => name),
    ["POS para comercios", "Amparo Seguros", "Helmcode Cloud Products"],
  );
});

test("Home routes use centralized locale-specific CV paths", async () => {
  const [englishRoute, spanishRoute, consts] = await Promise.all([
    readSource("src/pages/index.astro"),
    readSource("src/pages/es/index.astro"),
    readSource("src/consts.ts"),
  ]);

  assert.match(englishRoute, /CV_PATHS/);
  assert.match(spanishRoute, /CV_PATHS/);
  assert.ok(consts.includes('en: "/Marco-Galvan-CV-EN.pdf"'));
  assert.ok(consts.includes('es: "/Marco-Galvan-CV-ES.pdf"'));
});

test("Home routes consume localized commercial SEO metadata", async () => {
  const [english, spanish, englishRoute, spanishRoute] = await Promise.all([
    readJson("src/dictionaries/en.json"),
    readJson("src/dictionaries/es.json"),
    readSource("src/pages/index.astro"),
    readSource("src/pages/es/index.astro"),
  ]);

  assert.match(englishRoute, /metadata: dictionary\.metadata/);
  assert.match(spanishRoute, /metadata: dictionary\.metadata/);
  assert.equal(english.metadata.title, "Digital Products, Automations & Integrations | Marco Galván");
  assert.equal(spanish.metadata.title, "Productos digitales, automatizaciones e integraciones | Marco Galván");
  assert.match(english.metadata.description, /operational problems into digital products/);
  assert.match(spanish.metadata.description, /problemas operativos en productos digitales/);
});

test("Home navigation and sections expose stable anchors without social navigation", async () => {
  const [header, navbar, capabilities, process, featured, experience, contact, footer] =
    await Promise.all([
      readSource("src/components/header/header.astro"),
      readSource("src/components/navbar/navbar.astro"),
      readSource("src/components/capabilities/capabilities.astro"),
      readSource("src/components/process/process.astro"),
      readSource("src/components/featured/featured.astro"),
      readSource("src/components/experience-summary/experience-summary.astro"),
      readSource("src/components/contact-cta/contact-cta.astro"),
      readSource("src/components/footer/footer.astro"),
    ]);

  for (const id of ["top", "services", "process", "work", "about", "contact"]) {
    const source = [header, capabilities, process, featured, experience, contact].join("\n");
    assert.match(source, new RegExp(`id=["']${id}["']`));
  }

  assert.match(header, /homeHref/);
  assert.match(footer, /homeHref/);
  for (const anchor of ["#work", "#process", "#about", "#contact"]) {
    assert.match(navbar, new RegExp(`href=["']${anchor}["']`));
  }

  assert.match(navbar, /cvUrl/);
  assert.doesNotMatch(navbar, /SOCIAL_LINKS/);
  assert.match(footer, /SOCIAL_LINKS/);
});

test("Responsive navigation synchronizes its initial state with the viewport", async () => {
  const navbar = await readSource("src/components/navbar/navbar.astro");

  assert.match(navbar, /<details[^>]*\sopen(?:\s|>)/);
  assert.match(navbar, /data-navigation-menu/);
  assert.match(navbar, /matchMedia\("\(width <= 880px\)"\)/);
  assert.match(navbar, /menu\.open = !mobileViewport\.matches/);
  assert.match(navbar, /mobileViewport\.addEventListener\("change", syncMenuState\)/);
});

test("Selected work exposes truthful localized contexts without invented client claims", async () => {
  const [english, spanish] = await Promise.all([
    readJson("src/dictionaries/en.json"),
    readJson("src/dictionaries/es.json"),
  ]);

  assert.equal(english.selectedWork.title, "Selected products & professional work");
  assert.equal(spanish.selectedWork.title, "Productos y experiencia seleccionada");
  assert.deepEqual(
    english.selectedWork.items.map(({ context, status, url }) => ({ context, status, url })),
    [
      { context: "own-product", status: "in-validation", url: undefined },
      { context: "dam-squad", status: undefined, url: undefined },
      { context: "professional-experience", status: undefined, url: undefined },
    ],
  );
  assert.deepEqual(
    spanish.selectedWork.items.map(({ context, status, url }) => ({ context, status, url })),
    [
      { context: "own-product", status: "in-validation", url: undefined },
      { context: "dam-squad", status: undefined, url: undefined },
      { context: "professional-experience", status: undefined, url: undefined },
    ],
  );
  assert.deepEqual(Object.keys(english.selectedWork.labels.contexts).sort(), [
    "dam-squad",
    "own-product",
    "professional-experience",
  ]);
  assert.equal(english.selectedWork.labels.statuses["in-validation"], "In validation");
  assert.equal(spanish.selectedWork.labels.statuses["in-validation"], "En validación");
  assert.doesNotMatch(JSON.stringify(english), /UR POV/i);
  assert.doesNotMatch(JSON.stringify(spanish), /UR POV/i);
});

test("Home dictionaries contain the approved localized metadata and CTA copy", async () => {
  const [english, spanish] = await Promise.all([
    readJson("src/dictionaries/en.json"),
    readJson("src/dictionaries/es.json"),
  ]);

  assert.equal(
    english.metadata.title,
    "Digital Products, Automations & Integrations | Marco Galván",
  );
  assert.equal(
    spanish.metadata.title,
    "Productos digitales, automatizaciones e integraciones | Marco Galván",
  );
  assert.match(english.metadata.description, /operational problems into digital products/);
  assert.match(spanish.metadata.description, /problemas operativos en productos digitales/);
  assert.match(
    english.hero.description,
    /from understanding the problem to launching and evolving/,
  );
  assert.match(english.process.steps[0].description, /current operations/);
  assert.match(english.capabilities.items[0].description, /test with real users and evolve/);
  assert.equal(
    english.contact.text,
    "Tell me about the problem, how things work today and what you have already tried. You do not need to have the solution defined.",
  );
  assert.equal(
    spanish.contact.text,
    "Contame el problema, cómo funciona hoy y qué ya intentaron. No hace falta que tengas definida la solución.",
  );
  assert.equal(english.contact.contactLabel, "Tell me what you're trying to solve");
  assert.equal(spanish.contact.contactLabel, "Contame qué estás intentando resolver");
});

test("Selected work cards retain semantic static fallbacks", async () => {
  const [productCard, featured] = await Promise.all([
    readSource("src/components/product-card/product-card.astro"),
    readSource("src/components/featured/featured.astro"),
  ]);

  assert.match(productCard, /<article/);
  assert.doesNotMatch(productCard, /role=["']link["']/);
  assert.match(featured, /contextLabel/);
  assert.match(featured, /statusLabel/);
});

test("Home pages consume localized metadata and preserve page-family alternates", async () => {
  const [englishRoute, spanishRoute, layout, cvLayout] = await Promise.all([
    readSource("src/pages/index.astro"),
    readSource("src/pages/es/index.astro"),
    readSource("src/layouts/Layout.astro"),
    readSource("src/layouts/CVLayout.astro"),
  ]);

  assert.match(englishRoute, /metadata:\s*dictionary\.metadata/);
  assert.match(spanishRoute, /metadata:\s*dictionary\.metadata/);
  assert.match(layout, /og:locale:alternate/);
  assert.match(layout, /alternate\.lang !== lang/);
  assert.match(cvLayout, /metadata\.alternates/);
  assert.match(cvLayout, /metadata\.canonical/);
});

test("Home analytics uses one shared event listener and named events", async () => {
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
  assert.match(analytics, /track/);
  assert.equal((analytics.match(/document\.addEventListener/g) ?? []).length, 1);
  for (const eventName of [
    "contact_cta_clicked",
    "email_clicked",
    "linkedin_clicked",
    "github_clicked",
    "x_clicked",
    "cv_clicked",
    "language_changed",
  ]) {
    assert.match(source, new RegExp(eventName));
  }
});
