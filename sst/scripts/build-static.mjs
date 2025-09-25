import { cpSync, mkdirSync, rmSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..", "..");
const outDir = join(projectRoot, "dist");
const sources = ["index.html", "assets", "data"];

function ensureSource(path) {
  try {
    statSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

console.log("[build-static] Creating dist directory...");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const name of sources) {
  const srcPath = join(projectRoot, name);
  if (!ensureSource(srcPath)) {
    console.warn(`[build-static] Skipping missing source: ${name}`);
    continue;
  }

  const destPath = join(outDir, name);
  console.log(`[build-static] Copying ${name} -> dist/${name}`);
  cpSync(srcPath, destPath, { recursive: true });
}

console.log("[build-static] Build complete. Output: dist/");
