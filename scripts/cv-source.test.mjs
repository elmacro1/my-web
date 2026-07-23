import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const file = (path) => new URL(path, root);

test("CV source files and route exist", async () => {
  const paths = [
    "src/pages/cv/en.astro",
    "src/layouts/CVLayout.astro",
    "src/data/cv/types.ts",
    "src/data/cv/en.ts",
    "src/components/cv/CVHeader.astro",
    "src/components/cv/CVSection.astro",
    "src/components/cv/ExperienceItem.astro",
    "src/components/cv/ProjectItem.astro",
    "src/components/cv/SkillsGroup.astro",
    "scripts/export-cv.mjs",
  ];

  await Promise.all(paths.map((path) => access(file(path))));
});

test("CV route is standalone and data preserves required content", async () => {
  const route = await readFile(file("src/pages/cv/en.astro"), "utf8");
  const data = await readFile(file("src/data/cv/en.ts"), "utf8");

  assert.match(
    route,
    /import\s+CVLayout\s+from\s+["']\.\.\/\.\.\/layouts\/CVLayout\.astro["']/,
  );
  assert.match(route, /<CVLayout\b[\s\S]*<\/CVLayout>/);
  assert.doesNotMatch(route, /layouts\/Layout/);
  for (const tag of ["header", "main", "section", "article", "ul", "a"]) {
    assert.match(route, new RegExp(`<${tag}\\b`));
  }
  assert.match(data, /September 2025 – June 2026/);
  assert.match(data, /September 2025 – Present/);
  assert.match(data, /name:\s+"Marco Galván"/);
  assert.match(data, /elmacro11@gmail\.com/);
  assert.match(data, /https:\/\/mgalvan\.dev/);
  assert.match(data, /href:\s+"https:\/\/www\.linkedin\.com\/in\/mgalvan26"/);
  assert.doesNotMatch(data, /href:\s+"https:\/\/www\.linkedin\.com\/in\/mgalvan26\//);
  assert.match(data, /SOCIAL_LINKS\.github/);
  assert.doesNotMatch(data, /posdespensa|POS Despensa/i);

  const summary = data.match(/summary:\s*\[\s*"([^"]+)"/);
  assert.ok(summary, "English CV must contain a summary paragraph");
  assert.ok(
    summary[1].split(/\s+/).length <= 45,
    "Professional Summary should stay concise enough for approximately 3–4 lines",
  );
});

test("CV print contract and export target are explicit", async () => {
  const layout = await readFile(file("src/layouts/CVLayout.astro"), "utf8");
  const exporter = await readFile(file("scripts/export-cv.mjs"), "utf8");
  const packageJson = JSON.parse(await readFile(file("package.json"), "utf8"));

  assert.match(layout, /@page\s*\{[\s\S]*size:\s*A4;[\s\S]*margin:\s*0;/);
  assert.match(layout, /-webkit-print-color-adjust:\s*exact/);
  assert.match(layout, /break-inside:\s*avoid/);
  assert.match(exporter, /\bpnpm\s+build\b/);
  assert.match(exporter, /\bpnpm\s+preview\b/);
  assert.match(exporter, /const\s+cvUrl\s*=\s*[^;\n]*\/cv\/en[^;\n]*;/);
  assert.match(exporter, /page\.goto\(\s*cvUrl\s*\)/);
  assert.match(exporter, /Marco-Galvan-CV-EN-v2\.pdf/);
  assert.match(exporter, /document\.fonts\.ready/);
  assert.equal(packageJson.scripts["export:cv"], "node scripts/export-cv.mjs");
});
