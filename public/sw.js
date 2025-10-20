// Service Worker отключен - используется только для установки иконки
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// Не кэшируем запросы - просто пропускаем через сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
