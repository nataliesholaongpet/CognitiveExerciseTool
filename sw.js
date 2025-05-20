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
                '/Cognitive%20Exercises.html',
                '/home.png',
                '/Lifestyle%20Tips.html',
                '/lightbulb-icon.png',
                '/magnifying-glass.png',
                '/Memory%20Card%20Game.html',
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