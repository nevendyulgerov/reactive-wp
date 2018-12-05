/* eslint prefer-arrow-callback: "off" */
/* eslint func-names: "off" */
/* eslint no-var: "off" */
/* eslint no-restricted-globals: "off" */
/* eslint array-callback-return: "off" */
/* eslint compat/compat: "off" */
/* eslint no-unused-vars: "off" */
/* eslint object-shorthand: "off" */

var cachePrefix = 'v';
var cacheNumber = 1;
var cacheName = cachePrefix + cacheNumber;
var cacheFiles = [
  './'
];
var wpApiFlag = 'wp/v2';
var reactiveWooApiFlag = 'reactive-woo/v1';

// define filter for cacheable requests
var isCacheableRequest = function (request) {
  return request.method === 'GET' &&
    request.url.indexOf(wpApiFlag) === -1 &&
    request.url.indexOf(reactiveWooApiFlag) === -1;
};

self.addEventListener('install', function (event) {
  // console.log('[ServiceWorker] Installed');

  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      // console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', function (event) {
  // console.log('[ServiceWorker] Activated');

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (resourceCacheName) {
        if (resourceCacheName !== cacheName) {
          // console.log('[ServiceWorker] Removing cached files from ', resourceCacheName);
          return caches.delete(resourceCacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (!isCacheableRequest(event.request)) {
    return;
  }
  // console.log('[ServiceWorker] Fetching', event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        var requestClone;
        if (response) {
          // console.log('[Service Worker] Found in cache', event.request.url);
          return response;
        }

        requestClone = event.request.clone();
        requestClone.credentials = 'same-origin';

        return fetch(requestClone).then(function (response) {
          var responseClose;
          if (!response) {
            // console.log('[Service Worker] No response from fetch');
            return response;
          }

          responseClose = response.clone();
          return caches.open(cacheName).then(function (cache) {
            cache.put(event.request, responseClose);
            return response;
          });
        });
      })
      .catch(function (err) {
        // console.log('[Service Worker] Error fetching and caching', err);
      })
  );
});
