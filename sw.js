// Cache do aplicativo para uso offline. Mude VERSAO ao publicar uma atualização.
const VERSAO = 'lume-guia-v10';
const CASCA = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/logo.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
const FONTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(CASCA)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // rede primeiro para o código (pega atualizações), cache se estiver offline
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSAO).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else if (FONTES.includes(url.hostname)) {
    // fontes: cache primeiro, guarda na primeira vez que carregar
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(n => { const cp = n.clone(); caches.open(VERSAO).then(c => c.put(req, cp)); return n; })));
  }
});
