const CACHE_NAME = 'b3n-cache-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/bibliotheque.html',
  '/projet-xam-xamle.html',
  '/a-propos.html',
  '/styles.min.css',
  '/script.js',
  '/manifest.json',
  '/images/logo.png',
  '/images/Ndiaga NDIAYE ESP 2.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  '/offline.html'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache : "Network first, falling back to cache"
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la réponse est valide, on la met en cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Si la requête échoue, on utilise le cache
        return caches.match(event.request)
          .then(response => {
            // Si on trouve une réponse en cache, on la retourne
            if (response) {
              return response;
            }
            
            // Si la requête est pour une page HTML, on retourne la page hors ligne
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Sinon on retourne une réponse vide
            return new Response('', {
              status: 408,
              statusText: 'Request timed out.'
            });
          });
      })
  );
}); 