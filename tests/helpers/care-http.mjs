import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const mediaTypes = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css',
  '.txt':'text/plain', '.json':'application/json', '.svg':'image/svg+xml',
  '.webp':'image/webp', '.woff2':'font/woff2', '.png':'image/png', '.ico':'image/x-icon',
  '.webmanifest':'application/manifest+json',
};

export async function serveCare(api, env, options = {}) {
  let simulateFailure = false;
  const root = path.resolve(options.root || process.env.TEST_CARE_STATIC_ROOT || 'out');
  const host = options.host || 'localhost';
  const server = createServer(async (req, res) => {
    try {
      const base = 'http://' + host + ':' + server.address().port;
      const url = new URL(req.url, base);
      if (url.origin !== base) { res.writeHead(400).end(); return; }
      const redirect = options.redirects?.[url.pathname];
      if (redirect && req.method === 'GET') {
        res.writeHead(303, { Location: typeof redirect === 'function' ? redirect(url) : redirect, 'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer' }).end();
        return;
      }
      if (url.pathname.startsWith('/api/care/')) {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (value && !key.startsWith('oai-authenticated-')) headers.set(key, Array.isArray(value) ? value.join(',') : value);
        }
        for (const [key, value] of Object.entries(options.staffHeaders || {})) headers.set(key, value);
        const request = new Request(url, {method:req.method, headers, body:['GET','HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)});
        let useEnv = env;
        if (simulateFailure && url.pathname === '/api/care/checkins') {
          simulateFailure = false;
          useEnv = {...env, DB:{...env.DB, batch:async()=>{throw Error('test storage outage');}}};
        }
        const response = await api(request, useEnv);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
        return;
      }
      const target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (!target.startsWith(root + path.sep) && target !== root) { res.writeHead(403).end(); return; }
      let file;
      for (const candidate of [target, target + '.html', path.join(target, 'index.html')]) {
        try { if ((await stat(candidate)).isFile()) { file = candidate; break; } } catch {}
      }
      if (!file) { res.writeHead(404).end(); return; }
      const data = await readFile(file);
      res.writeHead(200, {
        'Content-Type':mediaTypes[path.extname(file)] || 'application/octet-stream',
        'Cache-Control':'no-store', 'Referrer-Policy':'no-referrer',
      });
      res.end(data);
    } catch {
      res.writeHead(500).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port || 0, options.host, resolve);
  });
  return {
    base:'http://' + host + ':' + server.address().port,
    failNextSave:()=>{simulateFailure = true;},
    close:()=>new Promise(resolve=>server.close(resolve)),
  };
}
