// Offline support for 栞 Shiori.
// App files and content (index.html, app.js, style.css, data/content.json): network first, so updates
//   show up on the next visit; the cached copy is used when offline.
// Voice audio (audio/v*/*.mp3): file names are hashes of the text, so they never change → cache first,
//   in a separate cache that survives app updates.
// Google Fonts: cache first.  Sign-in / sync requests (Supabase) are never touched.
// Only caches named "shiori-…" are cleaned up: the other apps on the same site keep theirs.
const CACHE = "shiori-v2";
const AUDIO = "shiori-audio-v1";
const SHELL = ["./", "./index.html", "./app.js", "./style.css", "./data/content.json", "./manifest.webmanifest", "./favicon.svg", "./vendor/printkit.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("shiori-") && k !== CACHE && k !== AUDIO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const cacheFirst = (cacheName, req, key) => caches.open(cacheName).then(async c => {
  const hit = await c.match(key);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === "opaque")) c.put(key, res.clone());
  return res;
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (isFont) { e.respondWith(cacheFirst(CACHE, req, req)); return; }
  if (!sameOrigin) return;
  const key = url.origin + url.pathname; // ignore query strings
  if (url.pathname.includes("/audio/") && url.pathname.endsWith(".mp3")) { e.respondWith(cacheFirst(AUDIO, req, key)); return; }
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
      return res;
    }).catch(() => caches.match(key).then(hit => hit || (req.mode === "navigate" ? caches.match(self.location.origin + self.location.pathname.replace(/sw\.js$/, "index.html")).then(r => r || Response.error()) : Response.error())))
  );
});
