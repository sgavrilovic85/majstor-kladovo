// Servis-worker v2: uvek prvo uzima najnoviju stranicu sa interneta, keš koristi samo kad nema veze
const KES = "majstor-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== KES).map(x => caches.delete(x))))
    .then(() => clients.claim())
));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-store" })
      .then(r => { const k = r.clone(); caches.open(KES).then(c => c.put(e.request, k)); return r; })
      .catch(() => caches.match(e.request))
  );
});
