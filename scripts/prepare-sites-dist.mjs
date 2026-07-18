import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const output = resolve("out");
const dist = resolve("dist");

if (!existsSync(output)) {
  throw new Error("Next static export output was not found at ./out");
}

rmSync(dist, { recursive: true, force: true });

function copyDirectory(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const source = join(from, entry);
    const target = join(to, entry);
    const stats = statSync(source);
    if (stats.isDirectory()) {
      copyDirectory(source, target);
      continue;
    }
    copyFileSync(source, target);
  }
}

copyDirectory(output, dist);
