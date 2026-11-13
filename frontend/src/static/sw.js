const CACHE_NAME = "supporther-v2";

const APP_SHELL = [
  "/",
  "/browse",
  "/map",
  "/events",
  "/favorites",
  "/reviews",
  "/login",
  "/register",
  "/businessSubmission",
  "/offline",

  "/manifest.webmanifest",

  "/css/styles.css",
  "/css/register.css",

  "/js/browse.js",
  "/js/map.js",
  "/js/events.js",
  "/js/favorites.js",
  "/js/reviews.js",
  "/js/login.js",
  "/js/register.js",
  "/js/businessSubmission.js",
  "/js/sw-register.js",

  "/images/icon-192.png",
  "/images/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(req));
    return;
  }

  if (
    url.pathname.startsWith("/css/") ||
    url.pathname.startsWith("/js/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(pageNetworkFirst(req));
    return;
  }

  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);

  if (cached) {
    return cached;
  }

  return fetch(req);
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);

    const cache = await caches.open(CACHE_NAME);
    cache.put(req, fresh.clone());

    return fresh;
  } catch (err) {
    const cached = await caches.match(req);

    if (cached) {
      return cached;
    }

    return new Response(
      JSON.stringify({
        error: "You are offline. This data is not available right now."
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}

async function pageNetworkFirst(req) {
  try {
    const fresh = await fetch(req);

    const cache = await caches.open(CACHE_NAME);
    cache.put(req, fresh.clone());

    return fresh;
  } catch (err) {
    const cached = await caches.match(req);

    if (cached) {
      return cached;
    }

    return caches.match("/offline");
  }
}