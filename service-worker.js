/* eslint-env serviceworker */
/* eslint no-restricted-globals: "off" */
/* global workbox */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');
if (!workbox) throw new Error('Unable to load workbox');

workbox.setConfig({ debug: false });

// Load Expiration plugin
workbox.loadModule('workbox-expiration');

const version = '3869435683'; // Replaced by actual hash of file in PHP

const log = (...args) => { console.log(`SW ${version} -`, ...args); };
const logError = (...args) => { console.error(`SW ${version} -`, ...args); };
const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * Enable navigation preload to improve performance of navigation requests
 * since we don't cache HTML
 * https://developers.google.com/web/updates/2017/02/navigation-preload
 * https://developers.google.com/web/tools/workbox/modules/workbox-navigation-preload
 */
workbox.navigationPreload.enable();

/**
 * Don't cache requests to static HTML pages, since Fastly sets cookies
 * Only fallback to cache if Network fails (e.g. user is offline), and
 * delete this cache when new service worker is activated
 * However, it is important to handle static pages so that the initial
 * PWA starting URL does respond w/ a 200 when offline
 */
workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
            cacheName: 'static-pages',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 5,
                    maxAgeSeconds: YEAR_IN_SECONDS,
                }),
            ],
        }),
        {
            // Turn on navigation preload by default
            allowlist: [/.*/],
            // Never cache dynamic pages or PHP files
            denylist: [/[^?]+\/(sign-out|support|mailvalidation|resetpass|accountclose|previews|preview_)/, /\.php($|#|\?)/],
        },
    ),
);

/**
 * Gets populated by PHP with a list of files to pre-cache
 * This way when the new service worker is activated, the user already has
 * all the essential files in cache!
 * @type {Array}
 */
const preCachedAssetURLs = [{"url":"https:\/\/www.befunky.com\/web\/css\/screen.6bf497a798.css","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/befunky.core.0950deab40.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/icons\/sprite.8b314c323f.svg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/site\/logo-dark1.svg","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/bundle.6294c0129b.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/scripts.10dc63baf8.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/html\/bfn-app-min.0cdde8b315.txt","revision":null},{"url":"https:\/\/www.befunky.com\/web\/icons\/befunky-b-logo-light.svg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/checker_pattern.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/collage-templates-sprite.png","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/fonts\/google-fonts-sprite.262e2c52f7_tiny.png","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/fonts\/befunky-fonts-sprite.6807740e41_tiny.png","revision":null},{"url":"https:\/\/www.befunky.com\/web\/icons\/no-color.svg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/premium_emblem.png","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/spectrum_color.png","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/textures\/effect_thumbsV7.xml","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/texturemodel\/textures_thumbs.xml","revision":null},{"url":"https:\/\/www.befunky.com\/web\/datas\/collage_layouts_data_v1.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/datas\/effect_thumbs_v1.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/datas\/patterns-data.json","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/overlays\/19DEC17\/overlays-data.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/zip.0.0.4.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/z-worker.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/pako-1.0.10.min.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/pako-codecs.0.0.1.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/opentype.0.8.0.min.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/pdf-worker-v3.min.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/blob-stream.min.js","revision":null},{"url":"https:\/\/www.befunky.com\/web\/js\/pdfkit-single-image-safari10-0.10.0.min.js","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_1_thumb.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_1_large.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_2_thumb.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_2_large.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_3_thumb.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_3_large.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_4_thumb.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_4_large.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_5_thumb.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_5_large.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_6_thumb.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/image-manager\/sample_6_large.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/photoeditor\/samples\/thumbs\/sample_1.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/photoeditor\/samples\/images\/sample_1.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/photoeditor\/samples\/thumbs\/sample_3.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/photoeditor\/samples\/images\/sample_3.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/photoeditor\/samples\/thumbs\/sample_4.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/graphics\/photoeditor\/samples\/images\/sample_4.jpg","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-layout.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-pattern.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-graphic.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-effect-v4.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-artsy.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-frame.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-overlay.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/images\/app\/menu-backgrounds\/bg-textures.jpg?auto=format","revision":null},{"url":"https:\/\/www.befunky.com\/?pwa-start-url","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/en.c8ab11f175.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/es.72ecfe8e61.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/pt.f1ac045352.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/fr.1ea2973bbf.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/de.fda6886ede.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/it.0262837302.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/tr.c77d33cda3.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/zh.73fb153360.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/ja.1b101ee02a.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/ko.ec9b7dc491.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/ru.3af4267b0e.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/no.16d236dfdc.json","revision":null},{"url":"https:\/\/www.befunky.com\/web\/languages\/all\/ar.7d8b2cfe6b.json","revision":null}];
workbox.precaching.precacheAndRoute(preCachedAssetURLs);

/**
 * When service worker is updated, all caches are deleted except...
 */
const cachesToKeepBetweenVersions = [
    'ui-images',
    'font-files',
    'google-fonts-stylesheets',
    'api-get-requests',
];

/**
 * Used cached API GET requests when offline
 * GET requests to API are cacheable and don't set cookies
 */
const apiGetRegex = /\/api\/get\/[a-z/-]+$/;
workbox.routing.registerRoute(
    ({ url }) => apiGetRegex.test(url),
    new workbox.strategies.NetworkFirst({
        cacheName: 'api-get-requests',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 5,
                maxAgeSeconds: WEEK_IN_SECONDS,
            }),
        ],
    }),
);

/**
 * Cache UI images for up to 1 year
 */
const imagesRegex = /\/(web|_web\/contents)\/images\/(site|app|teasers|cursors)\/[^.]+\.([jpg|png|svg|cur])/;
workbox.routing.registerRoute(
    ({ url }) => imagesRegex.test(url),
    new workbox.strategies.CacheFirst({
        cacheName: 'ui-images',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: YEAR_IN_SECONDS,
            }),
        ],
    }),
);

/**
 * Cache font files for up to 1 year
 */
const fontsRegex = /\/(web|_web\/contents)\/(user-)?fonts\//;
const googleFontsRegex = /^https:\/\/fonts\.gstatic\.com/;
workbox.routing.registerRoute(
    ({ url }) => [fontsRegex, googleFontsRegex].some(regex => regex.test(url)),
    new workbox.strategies.CacheFirst({
        cacheName: 'font-files',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: YEAR_IN_SECONDS,
            }),
        ],
    }),
);

/**
 * Cache the Google Fonts stylesheets with a stale-while-revalidate strategy,
 * since Google could update them at any time
 */
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    }),
);

self.addEventListener('install', () => {
    log('Installing');
});

self.addEventListener('activate', (event) => {
    // Delete most cached content upon activation
    log('Activating');

    // Get list of all clients that will be controlled
    self.clients.matchAll({ includeUncontrolled: true })
        .then((clientList) => {
            const urls = clientList.map(client => client.url);
            log('Matching clients:', urls.join(', '));
        });

    // Clean up old caches
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                // Don't delete prior service worker's precache
                // It's already diffed and updated by workbox so that shared assets are not removed.
                cacheNames
                    .filter(name => !cachesToKeepBetweenVersions.includes(name) && !name.startsWith('workbox-precache-'))
                    .map(name => caches.delete(name)),
            ))
            .then(() => {
                return self.clients.claim();
            }),
    );
});

/**
 * When passed {type: 'SKIP_WAITING'} message, activate right away replacing the
 * existing service worker
 * When passed {type: 'GET_VERSION'} message, send version string to client
 */
self.addEventListener('message', (event) => {

    if (event.data && event.data.type === 'SKIP_WAITING') {
        let skippedWaitingComplete = false;
        self.skipWaiting()
            .catch(error => logError('SKIP_WAITING failed', error))
            .then(() => { skippedWaitingComplete = true; });

        /**
         * Log error if skipWaiting doesn't work
         * This can happen if reg.update() is running while skipWaiting is called
         * @type {number}
         */
        const waitSeconds = 2;
        setTimeout(() => {
            if (!skippedWaitingComplete) {
                logError(`SKIP_WAITING timed out after ${waitSeconds} second(s). Trying again...`);
                self.skipWaiting()
                    .catch(error => logError('SKIP_WAITING failed on second attempt', error));
            }
        }, waitSeconds * 1000);
        return;
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version });
    }

    if (event.data && event.data.type === 'CLAIM_CLIENTS') {
        self.clients.claim();
    }
});
