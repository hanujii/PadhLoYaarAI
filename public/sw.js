// Minimal Service Worker to satisfy PWA requirements
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through
    // In future, we can add caching for specific assets here
    event.respondWith(fetch(event.request));
});
