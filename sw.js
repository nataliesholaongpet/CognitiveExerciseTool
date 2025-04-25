self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/Cognitive Exercise Tool.html' ,
                '/styles.css' ,
                '/app.js' ,
                '/manifest.json' ,
                '/placeholder-icon.jpg'
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

self.addEventListener('push', event => {
    let data = { title: 'Reminder', body: 'Time for your cognitive exercise!', icon: '/placeholder-icon.jpg'};

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
