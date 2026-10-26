import { careApi } from './care-api.js';
export default { async fetch(request, env, context) { const api = await careApi(request, env, context); if (api)
        return api; const url = new URL(request.url); let response = await env.ASSETS.fetch(request); if (response.status === 404 && !url.pathname.includes('.')) {
        for (const suffix of ['.html', '/index.html']) {
            const asset = new URL(url);
            asset.pathname = url.pathname === '/' ? '/index.html' : url.pathname + suffix;
            response = await env.ASSETS.fetch(new Request(asset, { method: 'GET', headers: request.headers }));
            if (response.status !== 404)
                break;
        }
    } const headers = new Headers(response.headers); headers.set('Referrer-Policy', 'no-referrer'); headers.set('X-Content-Type-Options', 'nosniff');headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');if(url.protocol==='https:')headers.set('Strict-Transport-Security','max-age=31536000'); if (['/i', '/app/patient','/care/server'].some(p => url.pathname.startsWith(p)))
        headers.set('Cache-Control', 'no-store'); return new Response(response.body, { status: response.status, headers }); } };
