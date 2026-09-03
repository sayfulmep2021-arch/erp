/**
 * ============================================================================
 * MEP Production & Inventory Management System - Service Worker (sw.js)
 * High-Performance Offline Caching & PWA Engine
 * ============================================================================
 */

const CACHE_NAME = 'mep-portal-v1.0.0';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './check_floor_stock.html',
    './daily_production_plan.html',
    './assemble_summary.html',
    './store_position_report.html',
    './daily_production_received_assemble.html',
    './daily_fg_production_entry.html',
    './bom.html',
    './monthly_production_summary.html',
    './monthly_rm_demand_vs_received.html',
    './master_database.js',
    './check_floor_stock_data.js',
    './daily_production_plan_data.js',
    './assemble_summary_data.js',
    './store_position_data.js',
    './bom_data.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './app_logo.png',
    './favicon.ico'
];

// Install Event: Pre-cache shell assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Pre-caching offline pages');
                return cache.addAll(PRECACHE_ASSETS).catch(err => {
                    console.warn('[Service Worker] Some assets could not be cached immediately:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event: Clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Cache First with Network Fallback
self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Ignore non-http requests (e.g. chrome-extension://)
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Fetch in background to keep cache fresh
                fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                }).catch(() => {/* Offline */});
                return cachedResponse;
            }

            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // Fallback for HTML pages when completely offline
                if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
