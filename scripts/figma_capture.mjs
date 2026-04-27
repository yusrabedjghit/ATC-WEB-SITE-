import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const FIGMA_URL =
  process.argv[2] ??
  "https://www.figma.com/design/nNJnT0FIzXDPkZpaONbPUf/Untitled?node-id=0-1&p=f";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "_figma");

const UA_EDGE =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0";

function safeSlug(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function tryClick(locator) {
  try {
    if ((await locator.count()) === 0) return false;
    const first = locator.first();
    if (!(await first.isVisible())) return false;
    await first.click({ timeout: 1500 });
    return true;
  } catch {
    return false;
  }
}

async function pressShiftShortcut(page, key) {
  try {
    await page.keyboard.down("Shift");
    await page.keyboard.press(key);
  } finally {
    await page.keyboard.up("Shift");
  }
}

async function dismissOverlays(page) {
  // Best-effort: Figma can show cookie banners, login nags, etc.
  for (let i = 0; i < 6; i++) {
    try {
      await page.keyboard.press("Escape");
    } catch {
      // ignore
    }

    await tryClick(page.locator('button[aria-label="Close"]'));
    await tryClick(page.locator('button:has-text("Not now")'));
    await tryClick(page.locator('button:has-text("Maybe later")'));
    await tryClick(page.locator('button:has-text("Got it")'));
    await tryClick(page.locator('button:has-text("Accept all")'));
    await tryClick(page.locator('button:has-text("Accept")'));
    await tryClick(page.locator('button:has-text("Continue")'));

    await page.waitForTimeout(400);
  }
}

async function looksLikeCloudFront403(page) {
  try {
    const loc = page.locator("text=/\\b403\\s+ERROR\\b/i").first();
    return (await loc.count()) > 0 && (await loc.isVisible());
  } catch {
    return false;
  }
}

async function sniffLoginWall(page) {
  const hasEmailInput =
    (await page.locator('input[type="email"]').count()) > 0 ||
    (await page.locator('input[name*="email" i]').count()) > 0;
  const hasPasswordInput =
    (await page.locator('input[type="password"]').count()) > 0 ||
    (await page.locator('input[name*="password" i]').count()) > 0;

  const loginText = page.locator(
    'text=/\\b(log\\s*in|sign\\s*in)\\b/i'
  );
  const signUpText = page.locator('text=/\\b(sign\\s*up|create\\s*account)\\b/i');

  const hasLoginText = (await loginText.count()) > 0;
  const hasSignUpText = (await signUpText.count()) > 0;

  // Heuristic: login wall usually has inputs + login/signup prompts.
  const looksLikeWall =
    (hasEmailInput || hasPasswordInput) && (hasLoginText || hasSignUpText);

  return {
    looksLikeWall,
    signals: {
      hasEmailInput,
      hasPasswordInput,
      hasLoginText,
      hasSignUpText,
    },
  };
}

async function extractVisibleSizeTokens(page) {
  // Attempt to find a "1440 × 1024" style token in UI.
  const loc = page.locator("text=/\\b\\d{2,5}\\s*[×x]\\s*\\d{2,5}\\b/").first();
  try {
    if ((await loc.count()) === 0) return null;
    const raw = (await loc.innerText()).trim();
    const m = raw.match(/(\\d{2,5})\\s*[×x]\\s*(\\d{2,5})/);
    if (!m) return { raw };
    return { raw, width: Number(m[1]), height: Number(m[2]) };
  } catch {
    return null;
  }
}

async function extractInspectSnippets(page) {
  // If Inspect/Dev panel is available, it often contains code blocks with
  // font-family, color, gap, padding, etc. We capture a few short snippets.
  try {
    const pres = await page.locator("pre").allInnerTexts();
    const trimmed = pres
      .map((t) => t.trim())
      .filter(Boolean)
      .flatMap((t) => t.split("\n").slice(0, 60).join("\n"))
      .filter(Boolean);
    return trimmed.slice(0, 8);
  } catch {
    return [];
  }
}

function collectFramesFromJson(root) {
  const framesById = new Map();
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;

    if (
      cur.type === "FRAME" &&
      typeof cur.id === "string" &&
      cur.absoluteBoundingBox &&
      typeof cur.absoluteBoundingBox.width === "number" &&
      typeof cur.absoluteBoundingBox.height === "number"
    ) {
      framesById.set(cur.id, {
        id: cur.id,
        name: typeof cur.name === "string" ? cur.name : null,
        width: cur.absoluteBoundingBox.width,
        height: cur.absoluteBoundingBox.height,
      });
    }

    if (Array.isArray(cur)) {
      for (const v of cur) stack.push(v);
      continue;
    }

    for (const v of Object.values(cur)) stack.push(v);
  }

  return [...framesById.values()];
}

function collectImageMapFromJson(root) {
  const images = new Map();
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;

    if (
      cur.images &&
      typeof cur.images === "object" &&
      !Array.isArray(cur.images)
    ) {
      for (const [k, v] of Object.entries(cur.images)) {
        if (typeof v === "string" && /^https?:\/\//.test(v)) images.set(k, v);
      }
    }

    if (Array.isArray(cur)) {
      for (const v of cur) stack.push(v);
      continue;
    }
    for (const v of Object.values(cur)) stack.push(v);
  }
  return images;
}

async function extractNextDataJson(page) {
  try {
    const loc = page.locator("#__NEXT_DATA__").first();
    if ((await loc.count()) === 0) return null;
    const txt = await loc.innerText();
    if (!txt || txt.length < 10) return null;
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const report = {
    url: FIGMA_URL,
    generatedAt: new Date().toISOString(),
    publicViewableWithoutLogin: null,
    loginWall: null,
    frames: [],
    frameScreenshots: [],
    inspectSnippets: [],
    screenshots: [],
    notes: [],
  };

  let browser;
  try {
    // Prefer system-installed Edge/Chrome to avoid downloading browser runtimes.
    browser = await chromium.launch({
      headless: true,
      channel: "msedge",
      args: ["--disable-blink-features=AutomationControlled"],
    });
    report.notes.push("Launched using system Microsoft Edge channel.");
  } catch {
    try {
      browser = await chromium.launch({
        headless: true,
        channel: "chrome",
        args: ["--disable-blink-features=AutomationControlled"],
      });
      report.notes.push("Launched using system Google Chrome channel.");
    } catch {
      browser = await chromium.launch({
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"],
      });
      report.notes.push(
        "Launched using bundled Chromium (may require Playwright browser install)."
      );
    }
  }

  const context = await browser.newContext({
    viewport: { width: 2400, height: 1800 },
    deviceScaleFactor: 1,
    userAgent: UA_EDGE,
    locale: "en-US",
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(120000);

  try {
    const capturedJson = [];
    page.on("response", async (res) => {
      try {
        const url = res.url();
        if (!/figma\.com\//i.test(url)) return;
        const ct = (res.headers()["content-type"] ?? "").toLowerCase();
        if (!ct.includes("application/json")) return;
        const txt = await res.text();
        if (txt.length > 5_000_000) return;
        capturedJson.push({ url, txt });
      } catch {
        // ignore
      }
    });

    await page.addInitScript(() => {
      // Best-effort bot-signal reduction; may not bypass WAF.
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });

    await page.goto(FIGMA_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(4000);
    await dismissOverlays(page);

    // Let the viewer fetch metadata we can parse for frame sizes.
    await page.waitForTimeout(6000);

    const initialPath = path.join(outDir, "00-initial.png");
    await page.screenshot({ path: initialPath, fullPage: true });
    report.screenshots.push({ name: "initial", path: initialPath });

    // If we hit a WAF/CloudFront block, try the embed viewer as a fallback.
    if (await looksLikeCloudFront403(page)) {
      report.notes.push(
        "Blocked by CloudFront/WAF (403) on main Figma URL; trying embed viewer."
      );
      const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
        FIGMA_URL
      )}`;
      await page.goto(embedUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(4000);
      await dismissOverlays(page);

      const embedPath = path.join(outDir, "00-embed.png");
      await page.screenshot({ path: embedPath, fullPage: true });
      report.screenshots.push({ name: "embed", path: embedPath });

      if (await looksLikeCloudFront403(page)) {
        report.publicViewableWithoutLogin = null;
        report.loginWall = null;
        report.notes.push(
          "Still blocked by CloudFront/WAF (403) after trying embed viewer; cannot verify public access or inspect frames from this environment."
        );
        const reportPath = path.join(outDir, "report.json");
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
        return;
      }
    }

    const login = await sniffLoginWall(page);
    report.loginWall = login;
    report.publicViewableWithoutLogin = !login.looksLikeWall;

    // First try: parse Next.js bootstrapped data (Figma site often ships this).
    {
      const nextData = await extractNextDataJson(page);
      if (nextData) {
        const frames = collectFramesFromJson(nextData)
          .filter((f) => f.width >= 300 && f.height >= 500)
          .sort((a, b) => b.height * b.width - a.height * a.width)
          .slice(0, 40);
        if (frames.length > 0) {
          report.frames = frames.map((f) => ({
            id: f.id,
            name: f.name,
            breakpoint:
              typeof f.name === "string" && /android|mobile/i.test(f.name)
                ? "mobile"
                : typeof f.name === "string" && /tablet/i.test(f.name)
                  ? "tablet"
                  : typeof f.name === "string" && /desktop/i.test(f.name)
                    ? "desktop"
                    : null,
            width: f.width,
            height: f.height,
            imageUrl: null,
            screenshot: null,
          }));
          report.notes.push("Extracted frame sizes from __NEXT_DATA__.");
        }
      }
    }

    // Try to extract frame metadata (names + w/h) from captured JSON responses.
    // This is best-effort and depends on what the public viewer requests.
    try {
      let frames = [];
      const imageMap = new Map();

      for (const item of capturedJson) {
        try {
          const obj = JSON.parse(item.txt);
          frames = frames.concat(collectFramesFromJson(obj));
          for (const [k, v] of collectImageMapFromJson(obj).entries()) imageMap.set(k, v);
        } catch {
          // ignore parse errors
        }
      }

      const byId = new Map(frames.map((f) => [f.id, f]));
      frames = [...byId.values()];

      const bigFrames = frames
        .filter((f) => f.width >= 300 && f.height >= 500)
        .sort((a, b) => b.height * b.width - a.height * a.width);

      // Only overwrite if we didn't already populate frames via __NEXT_DATA__.
      if (report.frames.length === 0) {
        report.frames = bigFrames.slice(0, 40).map((f) => ({
        id: f.id,
        name: f.name,
        breakpoint:
          typeof f.name === "string" && /android|mobile/i.test(f.name)
            ? "mobile"
            : typeof f.name === "string" && /tablet/i.test(f.name)
              ? "tablet"
              : typeof f.name === "string" && /desktop/i.test(f.name)
                ? "desktop"
                : null,
        width: f.width,
        height: f.height,
        imageUrl: imageMap.get(f.id) ?? null,
        screenshot: null,
        }));
      }

      // If the viewer provided direct render URLs, download a few "main" frames.
      const preferred = report.frames.filter((f) =>
        typeof f.name === "string"
          ? /(landing|desktop|tablet|mobile|android|home)/i.test(f.name)
          : false
      );
      const targets = [...preferred, ...report.frames]
        .filter((f) => typeof f.imageUrl === "string" && f.imageUrl.length > 0)
        .slice(0, 12);

      for (const f of targets) {
        try {
          const resp = await context.request.get(f.imageUrl);
          if (!resp.ok()) continue;
          const body = await resp.body();
          const ct = (resp.headers()["content-type"] ?? "").toLowerCase();
          const ext = ct.includes("png")
            ? "png"
            : ct.includes("jpeg") || ct.includes("jpg")
              ? "jpg"
              : ct.includes("webp")
                ? "webp"
                : "bin";
          const base = safeSlug(f.name ?? `frame-${f.id}`);
          const filePath = path.join(outDir, `${base}-${Math.round(f.width)}x${Math.round(f.height)}.${ext}`);
          await fs.writeFile(filePath, body);
          f.screenshot = filePath;
          report.screenshots.push({ name: f.name ?? f.id, path: filePath });
        } catch {
          // ignore download errors
        }
      }
    } catch (e) {
      report.notes.push(`Frame metadata parse failed: ${String(e)}`);
    }

    // Try to open Inspect/Dev if present (may not exist in view-only mode).
    await tryClick(page.getByRole("button", { name: /inspect/i }));
    await tryClick(page.getByRole("button", { name: /dev mode/i }));
    await page.waitForTimeout(1200);

    // Try to click the visible frame labels shown above frames on the canvas.
    // In this file we can visually see labels like "landing page", "example", "Android".
    const frameLabelTargets = [
      { breakpoint: "desktop", label: /landing page/i },
      { breakpoint: "desktop", label: /example/i },
      { breakpoint: "mobile", label: /^android$/i },
    ];

    for (const t of frameLabelTargets) {
      const clicked = await tryClick(page.getByText(t.label).first());
      if (!clicked) continue;

      await page.waitForTimeout(800);
      // Shift+0 in Figma is commonly "Zoom to 100%".
      await pressShiftShortcut(page, "0");
      await page.waitForTimeout(1200);
      await dismissOverlays(page);

      const sizeToken = await extractVisibleSizeTokens(page);
      const screenshotName = `frame-${t.breakpoint}-${safeSlug(String(t.label))}.png`;
      const screenshotPath = path.join(outDir, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      report.frameScreenshots.push({
        name: String(t.label),
        breakpoint: t.breakpoint,
        sizeToken,
        screenshot: screenshotPath,
        urlAfterClick: page.url(),
      });
      report.screenshots.push({ name: `frame-${t.breakpoint}`, path: screenshotPath });
    }

    report.inspectSnippets = await extractInspectSnippets(page);

    if (report.frameScreenshots.length === 0) {
      report.notes.push(
        "Could not locate 'Desktop/Tablet/Mobile' frame labels in the DOM; Figma canvas content may not be discoverable without interactive UI access."
      );
    }

    // Always take a large viewport shot as a fallback.
    const fallbackPath = path.join(outDir, "01-viewport.png");
    await page.screenshot({ path: fallbackPath, fullPage: false });
    report.screenshots.push({ name: "viewport", path: fallbackPath });

    const sizeToken = await extractVisibleSizeTokens(page);
    if (sizeToken) report.notes.push(`Visible size token: ${sizeToken.raw}`);

    const reportPath = path.join(outDir, "report.json");
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

await main();

