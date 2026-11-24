self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    const init = event.request.mode === 'navigate' ? { cache: 'no-cache' } : undefined;
    event.respondWith(fetch(event.request, init));
  }
});
