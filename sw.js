const CACHE_NAME = 'b3n-cache-v2';
const OFFLINE_URL = '/offline.html';

// Ressources à mettre en cache immédiatement lors de l'installation
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/bibliotheque.html',
  '/projet-xam-xamle.html',
  '/a-propos.html',
  '/galerie.html',
  '/recherche-avancee.html',
  '/styles.min.css',
  '/styles.css',
  '/animations.css',
  '/script.js',
  '/search-advanced.js',
  '/manifest.json',
  '/offline.html',
  '/images/logo.png',
  '/images/Ndiaga NDIAYE ESP 2.jpg',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation du service worker avec précaching des ressources essentielles
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert pour pré-chargement');
        return cache.addAll(CORE_ASSETS);
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
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activé et contrôlant toutes les pages');
      return self.clients.claim();
    })
  );
});

// Stratégie de cache adaptative: Stale-While-Revalidate pour les ressources statiques,
// Network-First pour les requêtes API ou dynamiques
self.addEventListener('fetch', (event) => {
  // Si la requête est pour une ressource externe ou une API, on privilégie le réseau
  if (
    event.request.url.includes('api') || 
    !event.request.url.startsWith(self.location.origin)
  ) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Pour les ressources statiques, on utilise la stratégie Stale-While-Revalidate
  if (
    event.request.url.match(/\.(css|js|png|gif|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
    return;
  }
  
  // Pour les pages HTML, on utilise une stratégie réseau-d'abord avec fallback offline
  if (event.request.mode === 'navigate') {
    event.respondWith(navigationStrategy(event.request));
    return;
  }
  
  // Par défaut, on utilise une stratégie cache-d'abord
  event.respondWith(cacheFirstStrategy(event.request));
});

// Stratégie Network First pour les APIs et requêtes dynamiques
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    // Mettre en cache la réponse du réseau si elle est valide
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Service temporairement indisponible.', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stratégie Stale-While-Revalidate pour les ressources statiques
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  // On retourne la réponse du cache pendant qu'on met à jour le cache en arrière plan
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse && networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    })
    .catch(() => {
      // On ignore silencieusement les erreurs réseau pendant la revalidation
    });
  
  return cachedResponse || fetchPromise;
}

// Stratégie spécifique pour la navigation
async function navigationStrategy(request) {
  try {
    // On essaie d'abord le réseau
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    // En cas d'échec réseau, on utilise le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si la requête n'est pas en cache, on retourne la page hors ligne
    return caches.match(OFFLINE_URL);
  }
}

// Stratégie Cache First pour les autres types de ressources
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Si la ressource n'existe pas dans le cache et le réseau échoue,
    // on renvoie une erreur ou un placeholder selon le type de ressource
    if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      // Ici on pourrait renvoyer une image placeholder
      return new Response('Image non disponible', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    return new Response('Ressource non disponible', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 