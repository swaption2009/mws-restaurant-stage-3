importScripts('/js/idb.js');
importScripts('/js/idbhelper.js');

let staticCacheName = 'restaurants-static-v3';

self.addEventListener('install', event => {
  let UrlsToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/data/restaurants.json',
    '/css/styles.css',
    '/css/styles-tablet.css',
    '/css/styles-desktop.css',
    '/js/idb.js',
    '/js/idbhelper.js',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/img/desktop/1.webp',
    '/img/desktop/2.webp',
    '/img/desktop/3.webp',
    '/img/desktop/4.webp',
    '/img/desktop/5.webp',
    '/img/desktop/6.webp',
    '/img/desktop/7.webp',
    '/img/desktop/8.webp',
    '/img/desktop/9.webp',
    '/img/desktop/10.webp',
    '/img/tablet/1.webp',
    '/img/tablet/2.webp',
    '/img/tablet/3.webp',
    '/img/tablet/4.webp',
    '/img/tablet/5.webp',
    '/img/tablet/6.webp',
    '/img/tablet/7.webp',
    '/img/tablet/8.webp',
    '/img/tablet/9.webp',
    '/img/tablet/10.webp',
    '/img/mobile/1.webp',
    '/img/mobile/2.webp',
    '/img/mobile/3.webp',
    '/img/mobile/4.webp',
    '/img/mobile/5.webp',
    '/img/mobile/6.webp',
    '/img/mobile/7.webp',
    '/img/mobile/8.webp',
    '/img/mobile/9.webp',
    '/img/mobile/10.webp',
  ];

  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(UrlsToCache);
    })
  )
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cachesNames => {
      return Promise.all(
        cachesNames.filter(cachesName => {
          return cachesName.startsWith('restaurants-') && cachesName != staticCacheName;
        }).map(cachesName => {
          return caches.delete(cachesName);
        })
      )
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      if (response) return response;
      return fetch(event.request);
    })
  )
});

self.addEventListener('sync', function (event) {
  if (event.tag === 'review-sync') {
    event.waitUntil(IDBHelper.syncOfflineReviews());
  }
});