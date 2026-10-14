// Replaces the old app's service worker so installed copies stop showing the old version.
// It takes over open windows, clears the old app's saved files (the new app uses "lipservice-" names, so
// they're safe), sends each window to the "new address" page (which forwards to Lip Service), then removes itself.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('warmup-')).map((k) => caches.delete(k)));
    const wins = await self.clients.matchAll({ type: 'window' });
    await Promise.all(wins.map((w) => w.navigate(w.url).catch(() => {})));
    await self.registration.unregister();
  })());
});
