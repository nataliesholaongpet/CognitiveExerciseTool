self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v2').then(cache => {
            return cache.addAll([
                '/',
                '/Cognitive Exercise Tool.html',
                '/styles.css',
                '/app.js',
                '/manifest.json',
                '/placeholder-icon.jpg',
                '/Cognitive Exercises.html',
                '/home.png',
                '/Lifestyle Tips.html',
                '/lightbulb-icon.png',
                '/magnifying-glass.png',
                '/Memory Card Game.png',
                '/memory-game.js',
                '/placeholder.png',
                '/puzzle-piece.png',
                '/though-bubble.png',
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
                keys.filter(key => key !== 'v2').map(key => caches.delete(key))
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
