var EXTRA_FILES = [];

var CHECKSUM = "v1";

var FILES = [
  'offline.html',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  'https://fonts.googleapis.com/css?family=Noto+Sans:400,700|Noto+Sans+Thai+UI:300,400,500,700|Material+Icons&amp;subset=thai'
].concat(EXTRA_FILES || []);

var CACHENAME = 'jwcisus-' + CHECKSUM;

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHENAME).then(function(cache) {
    return cache.addAll(FILES);
  }));
});

self.addEventListener('activate', function(event) {
  return event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(k) {
      if (k != CACHENAME && k.indexOf('jwcisus-') == 0) {
        return caches.delete(k);
      } else {
        return Promise.resolve();
      }
    }));
  }));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response=>response||fetch(event.request))
      .catch(() => {
        if(event.request.mode == 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});