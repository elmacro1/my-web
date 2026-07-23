import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const file = (path) => new URL(path, root);

const count = (source, pattern) => source.match(pattern)?.length ?? 0;

test("Spanish CV preserves the English structure and localizes content", async () => {
  const english = await readFile(file("src/data/cv/en.ts"), "utf8");
  const spanish = await readFile(file("src/data/cv/es.ts"), "utf8");

  assert.match(spanish, /name: "Marco Antonio Galván Fernandez"/);
  assert.match(spanish, /role: "Desarrollador de Software"/);
  assert.match(spanish, /specialty: "Web • Mobile • SaaS • IA"/);
  assert.match(spanish, /Desarrollador de Software con casi cinco años de experiencia/);
  assert.match(spanish, /Septiembre de 2025 – Junio de 2026/);
  assert.match(spanish, /Septiembre de 2025 – Actualidad/);
  assert.match(spanish, /role: "Ingeniero Full Stack"/);
  assert.match(spanish, /role: "Desarrollador Frontend \(Web y Mobile\)"/);
  assert.match(spanish, /role: "Desarrollador Full Stack"/);
  assert.match(spanish, /Perfil Profesional/);
  assert.match(spanish, /Experiencia Profesional/);
  assert.match(spanish, /Proyectos Seleccionados/);
  assert.match(spanish, /Habilidades Técnicas/);
  assert.match(spanish, /technologies: "Tecnologías"/);
  assert.match(spanish, /Competencia profesional de trabajo/);
  assert.match(spanish, /https:\/\/mgalvan\.dev\/cv\/es/);
  assert.match(spanish, /hreflang: "en"/);
  assert.match(spanish, /mailto:elmacro11@gmail\.com/);
  assert.match(spanish, /SOCIAL_LINKS\.github/);

  assert.equal(count(english, /company:/g), 5);
  assert.equal(count(spanish, /company:/g), 5);
  assert.equal(count(english, /name: "Invoice App"/g), 1);
  assert.equal(count(spanish, /name: "Invoice App"/g), 1);
  assert.equal(count(english, /name: "Estudialo AI"/g), 1);
  assert.equal(count(spanish, /name: "Estudialo AI"/g), 1);
  assert.doesNotMatch(spanish, /posdespensa|POS Despensa/i);
});

test("Both CV routes use shared components and data-driven localization", async () => {
  const english = await readFile(file("src/pages/cv/en.astro"), "utf8");
  const spanish = await readFile(file("src/pages/cv/es.astro"), "utf8");

  for (const route of [english, spanish]) {
    assert.match(route, /CVLayout/);
    assert.match(route, /CVHeader/);
    assert.match(route, /CVSection/);
    assert.match(route, /ExperienceItem/);
    assert.match(route, /ProjectItem/);
    assert.match(route, /SkillsGroup/);
    assert.match(route, /cvData\.labels/);
    assert.match(route, /cvData\.labels\.technologies/);
    assert.match(route, /cvData\.metadata/);
    assert.doesNotMatch(route, /layouts\/Layout/);
  }

  assert.match(spanish, /data\/cv\/es/);
  assert.doesNotMatch(spanish, /Professional Summary|Professional Experience|Featured Projects|Core Technologies/);
});

test("CV metadata and exporter support reciprocal locales", async () => {
  const layout = await readFile(file("src/layouts/CVLayout.astro"), "utf8");
  const exporter = await readFile(file("scripts/export-cv.mjs"), "utf8");
  const packageJson = JSON.parse(await readFile(file("package.json"), "utf8"));

  assert.match(layout, /rel="canonical"/);
  assert.match(layout, /hreflang/);
  assert.match(layout, /metadata\.lang/);
  assert.match(layout, /metadata\.alternates/);
  assert.match(exporter, /const targets =/);
  assert.match(exporter, /targets\.en/);
  assert.match(exporter, /targets\.es/);
  assert.match(exporter, /Marco-Galvan-CV-EN-v2\.pdf/);
  assert.match(exporter, /Marco-Galvan-CV-ES-v2\.pdf/);
  assert.match(exporter, /document\.fonts\.ready/);
  assert.equal(packageJson.scripts["export:cv:en"], "node scripts/export-cv.mjs en");
  assert.equal(packageJson.scripts["export:cv:es"], "node scripts/export-cv.mjs es");
  assert.equal(packageJson.scripts["export:cv"], "node scripts/export-cv.mjs");
});

test("Localized experience periods fit in the shared print layout", async () => {
  const styles = await readFile(file("src/layouts/CVLayout.module.css"), "utf8");

  assert.match(styles, /\.itemPeriod\s*\{[\s\S]*white-space:\s*normal;/);
  assert.match(styles, /\.itemPeriod\s*\{[\s\S]*max-width:\s*68mm;/);
});
