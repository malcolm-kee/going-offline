const version = 'v6';
const staticCacheName = 'static-files' + version;

addEventListener('install', installEvent => {
  // use this to cache files
  console.log(`sw is installing`);
  installEvent.waitUntil(
    caches
      .open(staticCacheName)
      .then(staticCache =>
        staticCache.addAll([
          '/js/app.js',
          'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css',
          '/offline.html',
        ])
      )
  );
});

addEventListener('activate', activateEvent => {
  // use this to cleanup files
  console.log(`sw is activationg`);
  activateEvent.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(name => {
            if (name !== staticCacheName) {
              caches.delete(name);
            }
          })
        )
      )
      .then(() => clients.claim())
  );
});

addEventListener('fetch', fetchEvent => {
  console.log(`The sw is listening...`);
  const { request } = fetchEvent;
  console.log(request);
  fetchEvent.respondWith(
    caches
      .match(request)
      .then(responseFromCache => {
        if (responseFromCache) {
          return responseFromCache;
        }
        return fetch(request);
      })
      .catch(err => {
        console.log(err);
        return caches.match('/offline.html');
      })
  );
});
