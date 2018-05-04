let staticCacheName = 'restaurants-static-v2';

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
    '/img/desktop/1.jpg',
    '/img/desktop/2.jpg',
    '/img/desktop/3.jpg',
    '/img/desktop/4.jpg',
    '/img/desktop/5.jpg',
    '/img/desktop/6.jpg',
    '/img/desktop/7.jpg',
    '/img/desktop/8.jpg',
    '/img/desktop/9.jpg',
    '/img/desktop/10.jpg',
    '/img/tablet/1.jpg',
    '/img/tablet/2.jpg',
    '/img/tablet/3.jpg',
    '/img/tablet/4.jpg',
    '/img/tablet/5.jpg',
    '/img/tablet/6.jpg',
    '/img/tablet/7.jpg',
    '/img/tablet/8.jpg',
    '/img/tablet/9.jpg',
    '/img/tablet/10.jpg',
    '/img/mobile/1.jpg',
    '/img/mobile/2.jpg',
    '/img/mobile/3.jpg',
    '/img/mobile/4.jpg',
    '/img/mobile/5.jpg',
    '/img/mobile/6.jpg',
    '/img/mobile/7.jpg',
    '/img/mobile/8.jpg',
    '/img/mobile/9.jpg',
    '/img/mobile/10.jpg',
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