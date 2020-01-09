const cacheVersion = "v1";
var CACHE_NAME = 'first-sw';
var urlsToCache = [
    '/',

];

//install
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

//Activate Event
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(cacheVersions => {
            return Promise.all(
                cacheVersions.map(cacheName => {
                    if (cacheName !== cacheVersion) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

//fetch
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {

            if (response) {
                return response;
            }

            var request = event.request.clone();

            if (request.mode !== 'navigate' && request.url.indexOf(request.referrer) === -1) {
                request = new Request(request, { mode: 'no-cors' })
            }

            return fetch(request).then(function (httpRes) {

                if (!httpRes || (httpRes.status !== 200 && httpRes.status !== 304 && httpRes.type !== 'opaque') || request.method === 'POST') {
                    return httpRes;
                }

                var responseClone = httpRes.clone();
                caches.open('first-sw').then(function (cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});
