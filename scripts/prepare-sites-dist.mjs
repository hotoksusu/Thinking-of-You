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

writeFileSync(
  join(server, "index.js"),
  `const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || url.pathname.includes(".")) {
      return response;
    }

    const candidates = url.pathname === "/"
      ? ["/index.html"]
      : [\`\${url.pathname}.html\`, \`\${url.pathname}/index.html\`];

    for (const pathname of candidates) {
      response = await env.ASSETS.fetch(new Request(new URL(pathname, url), request));
      if (response.status !== 404) return response;
    }

    return response;
  },
};

export default worker;
`,
  "utf8",
);
