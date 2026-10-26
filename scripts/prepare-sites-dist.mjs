import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
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

const client = join(dist, "client");
const server = join(dist, "server");

copyDirectory(output, client);
mkdirSync(server, { recursive: true });

// Bundle the dependency-free Worker into one deployable ESM entrypoint.
const ts = await import("typescript");
const {readFileSync} = await import("node:fs");
const rule = ts.transpileModule(readFileSync(resolve("src/lib/status-rules.ts"),"utf8"),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const sms = readFileSync(resolve("server/care-sms.mjs"),"utf8");
const operations = readFileSync(resolve("server/care-operations.mjs"),"utf8").replace(/^import .*care-sms\.js.*;\s*/m,"");
const api = readFileSync(resolve("server/care-api.mjs"),"utf8").replace(/^import .*care-sms\.js.*;\s*/m,"").replace(/^import .*care-operations\.js.*;\s*/m,"").replace(/^import .*status-rules\.js.*;\s*/m,"");
const worker = readFileSync(resolve("server/worker.mjs"),"utf8").replace(/^import .*care-api\.js.*;\s*/m,"");
writeFileSync(join(server,"index.js"),rule+"\n"+sms+"\n"+operations+"\n"+api+"\n"+worker,"utf8");
