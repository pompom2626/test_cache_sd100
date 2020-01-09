const cacheVersion = 'V1';
var CACHE_NAME = 'V1';
var urlsToCache = [
    '/',

];

//logging
const log = msg => {
    console.log(`[ServiceWorker ${cacheVersion}] ${msg}`);
  }


//install
self.addEventListener('install', function (event) {
    self.skipWaiting();
    log('install');
    console.log('install !!!');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                log('caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

//Activate Event
self.addEventListener("activate", e => {
    log('activate');
    console.log('activate !!!');
    e.waitUntil(
        caches.keys().then(cacheVersions => {
            return Promise.all(
                cacheVersions.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});




//fetch
self.addEventListener('fetch', function (event) {
    log('fetch');
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
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});
















