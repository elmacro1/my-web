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

test("Home metadata uses the commercial SEO descriptions", async () => {
  const [englishRoute, spanishRoute, layout] = await Promise.all([
    readSource("src/pages/index.astro"),
    readSource("src/pages/es/index.astro"),
    readSource("src/layouts/Layout.astro"),
  ]);

  assert.match(englishRoute, /Product Builder designing and building digital products/);
  assert.match(englishRoute, /founders, businesses, and product teams/);
  assert.match(spanishRoute, /Product Builder que diseña y construye productos digitales/);
  assert.match(spanishRoute, /founders, empresas y equipos de producto/);
  assert.match(layout, /Product Builder designing and building digital products/);
  assert.match(layout, /Product Builder que diseña y construye productos digitales/);
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
