import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const outputPath = fileURLToPath(
  new URL("../public/Marco-Galvan-CV-EN-v2.pdf", import.meta.url),
);
const retryDelayMs = 250;
const readinessAttempts = 40;

let browser;
let activeProcess;
let previewProcess;
let cleanupPromise;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findAvailablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  server.close();
  await once(server, "close");
  return port;
}

function waitForExit(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }

  return once(child, "exit").then(() => undefined);
}

async function terminate(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  const exited = waitForExit(child);
  child.kill("SIGTERM");
  await Promise.race([exited, wait(5_000)]);

  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await exited;
  }
}

async function cleanup() {
  if (!cleanupPromise) {
    cleanupPromise = (async () => {
      try {
        await browser?.close();
      } finally {
        browser = undefined;
        try {
          await terminate(previewProcess);
        } finally {
          previewProcess = undefined;
          await terminate(activeProcess);
          activeProcess = undefined;
        }
      }
    })();
  }

  return cleanupPromise;
}

function installSignalCleanup(signal) {
  process.once(signal, () => {
    void cleanup().finally(() => {
      process.exit(signal === "SIGINT" ? 130 : 143);
    });
  });
}

function runPnpm(args, label) {
  console.log(`Running ${label}`);
  const child = spawn("pnpm", args, {
    cwd: projectRoot,
    stdio: "inherit",
  });
  activeProcess = child;

  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code, signal) => {
      activeProcess = undefined;
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with ${signal ?? `exit code ${code}`}.`));
    });
  });
}

async function waitForPreview(cvUrl) {
  let lastError;

  for (let attempt = 1; attempt <= readinessAttempts; attempt += 1) {
    try {
      const response = await fetch(cvUrl);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Preview returned HTTP ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    await wait(retryDelayMs);
  }

  throw new Error(
    `Preview did not become reachable at ${cvUrl}: ${lastError?.message ?? "unknown error"}`,
  );
}

async function waitForStableLayout(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;

    const getDimensions = () => [
      document.documentElement.scrollWidth,
      document.documentElement.scrollHeight,
      document.body.scrollWidth,
      document.body.scrollHeight,
    ];
    const nextFrame = () => new Promise(requestAnimationFrame);

    await nextFrame();
    let previousFrame = getDimensions();
    for (let frame = 0; frame < 10; frame += 1) {
      await nextFrame();
      const currentFrame = getDimensions();
      if (previousFrame.every((dimension, index) => dimension === currentFrame[index])) {
        return;
      }
      previousFrame = currentFrame;
    }

    throw new Error("CV layout did not stabilize before export.");
  });
}

async function main() {
  const port = await findAvailablePort();
  const cvUrl = `http://127.0.0.1:${port}/cv/en`;

  await runPnpm(["build"], "pnpm build");

  console.log("Running pnpm preview");
  previewProcess = spawn(
    "pnpm",
    ["preview", "--host", "127.0.0.1", "--port", String(port)],
    { cwd: projectRoot, stdio: "ignore" },
  );
  previewProcess.once("error", (error) => {
    console.error(`pnpm preview failed to start: ${error.message}`);
  });

  await waitForPreview(cvUrl);

  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(cvUrl);
  await waitForStableLayout(page);
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  console.log(`Wrote ${outputPath}`);
}

installSignalCleanup("SIGINT");
installSignalCleanup("SIGTERM");

try {
  await main();
} finally {
  await cleanup();
}
