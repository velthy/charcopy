self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('charcopy').then(function(cache) {
			return cache.addAll(
				[
					'/',
					'/index.html',
					'/styles.css',
					'/functions.js',
					'/clipboard.min.js'
				]
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.open('charcopy').then(function(cache) {
			return cache.match(event.request).then(function (response) {
				return response || fetch(event.request).then(function(response) {
					cache.put(event.request, response.clone());
					return response;
				});
			});
		})
	);
});
/*
self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request);
		})
	);
});
*/
