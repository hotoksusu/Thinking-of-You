import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const output = resolve(process.env.CARE_EXPORT_PROFILE === 'legacy-qa' ? 'outputs/legacy-site' : 'out');
const dist = resolve(process.env.CARE_EXPORT_PROFILE === 'legacy-qa' ? 'outputs/legacy-package' : 'dist');

if (!existsSync(output)) {
  throw new Error('Next static export output was not found at ' + output);
}

const index = readFileSync(join(output, 'index.html'), 'utf8');
const demo = readFileSync(join(output, 'demo.html'), 'utf8');
if (process.env.NEXT_PUBLIC_CARE_DEMO === 'local' || index.includes('data-care-demo="local"') || demo.includes('/__demo/')) {
  throw new Error('The local demo export cannot be packaged for deployment.');
}
const isDanyeon = index.includes('data-care-brand="danyeon"');
if (!isDanyeon && process.env.CARE_EXPORT_PROFILE !== 'legacy-qa') {
  throw new Error('The production package must be built with the DANYEON brand.');
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
if (isDanyeon) copyFileSync(join(client, 'manifest.webmanifest'), join(client, 'manifest.json'));
mkdirSync(server, { recursive: true });

// Bundle the dependency-free Worker into one deployable ESM entrypoint.
const ts = await import("typescript");
const rule = ts.transpileModule(readFileSync(resolve("src/lib/status-rules.ts"),"utf8"),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const program = ts.transpileModule(readFileSync(resolve("src/lib/recovery-program.ts"),"utf8"),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const programServer = readFileSync(resolve("server/care-programs.mjs"),"utf8").replace(/^import .*recovery-program\.js.*;\s*/m,"");
const sms = readFileSync(resolve("server/care-sms.mjs"),"utf8");
const operations = readFileSync(resolve("server/care-operations.mjs"),"utf8").replace(/^import .*(?:care-sms|recovery-program|care-programs)\.js.*;\s*/gm,"");
const api = readFileSync(resolve("server/care-api.mjs"),"utf8").replace(/^import .*care-sms\.js.*;\s*/m,"").replace(/^import .*care-operations\.js.*;\s*/m,"").replace(/^import .*(?:status-rules|recovery-program|care-programs)\.js.*;\s*/gm,"");
const worker = readFileSync(resolve("server/worker.mjs"),"utf8").replace(/^import .*care-api\.js.*;\s*/m,"");
writeFileSync(join(server,"index.js"),rule+"\n"+program+"\n"+programServer+"\n"+sms+"\n"+operations+"\n"+api+"\n"+worker,"utf8");
