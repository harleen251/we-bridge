const cacheName = "v1";
const urlsToCache = [ "/", "/pages", "/js","/css", "/img", "/images", "/assets/icons", "/pages/index.html", "/js/index.js", "/js/header.js", "/css/style.css", "/css/index.css", "/css/header.css","/images/icons" ];
// const urlsToCache = [ "/","/index.html", "/app.js", "/app.webmanifest", "/style.css", 
//   "/assets/icons/icon-192x192.png", "/assets/icons/icon-512x512.png","/assets/icons/icon-144x144.png",
//   "https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"
//  ];


// NEVER cache service worker itself ( i.e. don't include sw.js in above array)
// MAKE SURE THERE IS NO TYPO in the File names otherwise the cache.addAll fails in install

self.addEventListener('install', (event) => { // invoked when a browser installs this SW
    // here we cache the resources that are defined in the urlsToCache[] array
    console.log(`[SW] Event fired: ${event.type}`);
    event.waitUntil(       // waitUntil tells the browser to wait for the input promise to finish
		  caches.open( cacheName )		//caches is a global object representing CacheStorage
			  .then( ( cache ) => { 			// open the cache with the name cacheName*
				  return cache.addAll( urlsToCache ); // pass the array of URLs to cache**. it returns a promise
		}));
    self.skipWaiting();  // it tells browser to activate this SW and discard old one immediately (useful during development)
    console.log(`[SW] installed`);
});

self.addEventListener('activate', (event) => { // invoked after the SW completes its installation. 
    // It's a place for the service worker to clean up from previous SW versions
    console.log(`[SW] Event fired: ${event.type}`);
    event.waitUntil( deleteOldCache() )    // waitUntil tells the browser to wait for the input promise to finish
    self.clients.claim(); // lets the newly activated SW takes control of all related open pages 
    console.log(`[SW] activated`);
});

// iterates over cache entries for this site and delete all except the one matching cacheName
async function deleteOldCache() {
  const keyList = await caches.keys();
  return Promise.all( keyList.map( ( key ) => {
    if ( key !== cacheName  ) {    // compare key with the new cache Name in SW
      return caches.delete( key );  // delete any other cache
    }
  }));
}


self.addEventListener('fetch', event => {
    // Fires whenever the app requests a resource (file or data)  normally this is where the service worker would check to see
    // if the requested resource is in the local cache before going to the server to get it. 
    console.log(`[SW] Fetch event for ${event.request.url}`);

    event.respondWith(NetworkFirstThenCacheStrategy(event) );

});

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         return response || fetch(event.request);
//       })
//   );
// });

// self.addEventListener('message', (event) => {
//   if (event.data === 'showOfflineAnimation') {
//     self.clients.matchAll().then((clients) => {
//       clients.forEach((client) => {
//         client.postMessage({ command: 'showOfflineAnimation' });
//       });
//     });
//   }
// });

// self.addEventListener('offline', () => {
//   // Send a message to the main page to show the offline animation
//   self.clients.matchAll().then((clients) => {
//     clients.forEach((client) => {
//       client.postMessage({ command: 'showOfflineAnimation' });
//     });
//   });
// });                                                                 

// CACHE FIRST, THEN NETWORK STRATEGY
async function CacheFirstThenNetworkStrategy(event) {
    const cachedResponse = await caches.match( event.request.url, {ignoreVary:true} ); // ignore vary header (useful for offline match)
    if (cachedResponse) {
      console.log("using catched "+event.request.url);
      return cachedResponse
    }
    //not found in cache try to return from server (would be successfull if we are online)
    return fetch( event.request );  // returns cachedResponse or server fetch  if no cachedResponse
  }


// NETWORK FIRST, THEN CACHE STRATEGY
async function NetworkFirstThenCacheStrategy(event) {
  try {
      return await fetch( event.request );  // returns server fetch
  } catch(error) {
      return caches.match( event.request.url , {ignoreVary:true} ); // returns cached response if server fetch fails (e.g. user is offline)
  }
}