const CACHE_NAME = 'offline-cache';
const OFFLINE_URL = 'index.html';

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				OFFLINE_URL,
				'styles.css?20230412',
				'functions.js?20230412',
				'characters.json',
				'manifest.json',
			]);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => {
				return response || fetch(event.request);
			})
			.catch((error) => {
				return caches.match(OFFLINE_URL);
			})
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
		})
	);
});
