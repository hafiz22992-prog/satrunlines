import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "public", "images", "landing");
const USER_AGENT = "SaturnLines/1.0 (landing-photo-cache; GitHub Actions)";
const TIMEOUT_MS = 45000;

const assets = [
  { file: "hero-bus.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Coach_bus_in_Lefkada%2C_Bova%2C_Hermes_Tours.JPG", credit: "Alf van Beem — Wikimedia Commons — CC0" },
  { file: "hero-road.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Desert_road.JPG", credit: "MEga SPeed — Wikimedia Commons — CC BY 3.0" },
  { file: "riyadh.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Riyadh_Skyline.jpg", credit: "Wikimedia Commons — CC BY-SA 4.0" },
  { file: "jeddah.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeddah_Corniche_Photo.jpg", credit: "Wikimedia Commons — CC0" },
  { file: "makkah.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaaba_(1)_Makkah_(Mecca).jpg", credit: "Wikimedia Commons — CC BY-SA 3.0" },
  { file: "sanaa.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Old_City_of_Sana%27a-111119.jpg", credit: "Wikimedia Commons — CC BY-SA 3.0 IGO" },
  { file: "aden.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Port_Of_Aden_Yemen.jpg", credit: "Wikimedia Commons — CC BY-SA 3.0" },
  { file: "hadhramaut.jpg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Shibam_Hadramaut_1.jpg", credit: "Wikimedia Commons — CC BY-SA 4.0" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadWithRetry(asset, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(asset.source, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "image/jpeg,image/*,*/*;q=0.8" },
      });
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      if (![408, 425, 429, 500, 502, 503, 504].includes(response.status) || attempt === attempts) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.warn(`${asset.file}: HTTP ${response.status}; retrying`);
    } catch (error) {
      if (attempt === attempts) {
        const reason = error?.name === "AbortError" ? `timeout after ${TIMEOUT_MS}ms` : error?.message || String(error);
        throw new Error(`Failed to download ${asset.file}: ${reason}`);
      }
      console.warn(`${asset.file}: ${error?.message || String(error)}; retrying`);
    } finally {
      clearTimeout(timer);
    }
    await sleep(Math.min(20000, 2500 * 2 ** (attempt - 1)));
  }
}

await mkdir(outputDir, { recursive: true });
for (const asset of assets) {
  const buffer = await downloadWithRetry(asset);
  if (buffer.length < 20000) throw new Error(`Downloaded file is unexpectedly small: ${asset.file}`);
  await writeFile(path.join(outputDir, asset.file), buffer);
  console.log(`Downloaded ${asset.file} (${buffer.length} bytes)`);
  await sleep(1000);
}
await writeFile(path.join(outputDir, "credits.json"), JSON.stringify({ source: "Wikimedia Commons", assets }, null, 2) + "\n", "utf8");
