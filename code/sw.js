// In the service worker, listen for the 'install' event
self.addEventListener('install', function (event) {
    event.waitUntil(
        // Open a cache and store some resources
        caches.open('my-cache').then(function (cache) {
            return cache.addAll([
                'index.html',
                'style/main.css',
                'code/index.js'
            ]);
        })
    );
});

// In the service worker, listen for the 'fetch' event
self.addEventListener('fetch', function (event) {
    event.respondWith(
        // Try to get the response from a cache
        caches.match(event.request).then(function (response) {
            // If the cache is hit, return the cached response
            if (response) {
                return response;
            }

            // Otherwise, fetch the resource from the network
            return fetch(event.request);
        })
    );
});