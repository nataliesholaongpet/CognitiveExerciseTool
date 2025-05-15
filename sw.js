const CACHE_NAME = 'v5';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v5').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                '/manifest.json',
                '/placeholder-icon.jpg',
                '/Cognitive Exercises.html',
                '/home.png',
                '/Lifestyle Tips.html',
                '/lightbulb-icon.png',
                '/magnifying-glass.png',
                '/Memory Card Game.html',
                '/memory-game.js',
                '/placeholder.png',
                '/puzzle-piece.png',
                '/thought-bubble.png',
                '/brain-icon.png',
                '/app-icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('push', event => {
    let data = { title: 'Reminder', body: 'Time for your cognitive exercise!', icon: '/placeholder-icon.jpg' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon
        })
    );
});

const webpush = require('web-push');

webpush.setVapidDetails(
  'crownofnatalie@gmail.com',
  'BPAz2Rvk6nj4t7cUBaJc3B70ZXOUxfuEoi-LohzpbMbosWwLjBcRRlhq09w_kM2FjYZhPuy6uCE-s3mTu9sq2ig',
  'A5GPCqIVn0j5kLsbTx9uD2DR9OsJnxXBhmi2tkSCVUg'
);

webpush.sendNotification(subscription, JSON.stringify({
  title: "Reminder",
  body: "Don't forget to take your meds!"
}));

