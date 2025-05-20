const CACHE_NAME = 'v5';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v5').then(cache => {
            return cache.addAll([
                '/CognitiveExerciseTool/',
                '/CognitiveExerciseTool/index.html',
                '/CognitiveExerciseTool/styles.css',
                '/CognitiveExerciseTool/app.js',
                '/CognitiveExerciseTool/manifest.json',
                '/CognitiveExerciseTool/placeholder-icon.jpg',
                '/CognitiveExerciseTool/Cognitive Exercises.html',
                '/CognitiveExerciseTool/home.png',
                '/CognitiveExerciseTool/Lifestyle Tips.html',
                '/CognitiveExerciseTool/lightbulb-icon.png',
                '/CognitiveExerciseTool/magnifying-glass.png',
                '/CognitiveExerciseTool/Memory Card Game.html',
                '/CognitiveExerciseTool/memory-game.js',
                '/CognitiveExerciseTool/placeholder.png',
                '/CognitiveExerciseTool/puzzle-piece.png',
                '/CognitiveExerciseTool/thought-bubble.png',
                '/CognitiveExerciseTool/brain-icon.png',
                '/CognitiveExerciseTool/app-icon.png'
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