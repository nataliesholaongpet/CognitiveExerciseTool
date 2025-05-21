if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/CognitiveExerciseTool/sw.js', { scope: '/CognitiveExerciseTool/' })
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notifications allowed');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    LifestyleTips();
});

document.addEventListener('DOMContentLoaded', () => {
    loadReminders();

    const addReminderButton = document.getElementById('addReminderButton');
    const reminderForm = document.getElementById('reminderForm');
    const saveReminderButton = document.getElementById('saveReminder');

    addReminderButton.addEventListener('click', () => {
        reminderForm.classList.toggle('hidden');
        saveReminderButton.classList.toggle('hidden');
    });

    document.getElementById('saveReminder').addEventListener('click', () => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const time = new Date(document.getElementById('reminderTime').value);
        const text = document.getElementById('reminderText').value;
        const id = Date.now();

        const reminder = { id, time: time.toISOString(), text };

        reminderForm.classList.toggle('hidden');
        saveReminderButton.classList.toggle('hidden');
    });

    document.getElementById('reminderContainer').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-reminder')) {
            const reminderDiv = e.target.closest('.reminder-tab');
            const id = Number(reminderDiv.dataset.id);

            deleteReminder(id);

            reminderDiv.remove();
        }
    });
});

function saveReminder(reminder) {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    if (reminders.length === 0) {
        document.getElementById('reminderContainer').innerHTML = '';
        return;
    }
    reminders.forEach(renderReminder);
}

function deleteReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function renderReminder({ time, text }) {
    const dateObj = new Date(time);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}/${month}`;
    const formattedTime = `${hours}:${minutes}`;

    const container = document.getElementById('reminderContainer');
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'reminder-tab';
    reminderDiv.innerHTML = `<span class="reminder-time"><strong>${formattedDate}</strong> <strong>${formattedTime}</strong></span></div><hr class="gradient-line"></hr><span class="reminder-text">${text}</span><button class="delete-reminder"><img src="bin.png" class="delete-icon" alt="Delete reminder"</button>`;
    container.appendChild(reminderDiv);
}

function schedulePushNotification(reminder) {
    navigator.serviceWorker.ready.then(async reg => {
        const subscription = await reg.pushManager.getSubscription();

        if (!subscription) {
            console.error('No push subscription found.');
            return;
        }

        await fetch('https://cognitiveexercisetool.onrender.com/reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription, reminder })
        });
    });
}

const music = new Audio('all-good-things.mp3');

document.getElementById('playButton').addEventListener('click', () => {
    music.play();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    music.pause();
});

let currentTrack = 0;
const audio = document.getElementById('audioPlayer'); // Your <audio> element

function playTrack(index) {
    audio.src = playlist[index];
    audio.play();
}

document.getElementById('nextButton').addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    playTrack(currentTrack);
});

const progressBar = document.getElementById('progressBar');

audio.addEventListener('loadedmetadata', () => {
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

// lifestyle tips section
function LifestyleTips() {
    const tips = ["Do you need to take any medication?", "Do something that makes you happy today!", "It's important to get at least 30 minutes of physical activity in per day", "It can help to write notes and to-do lists", "Music can help bring back memories", "Have you talked to a loved one recently?", "It's important to socialise regularly", "Do you have any chores you need to do?", "Remember to take a walk today!"];
    const tipButton = document.getElementById('tipButton');
    const tipText = document.getElementById('tipText');
    const speakButton = document.getElementById('speakButton');

    function showRandomTip() {
        const random = tips[Math.floor(Math.random() * tips.length)];
        tipText.textContent = random;
    }

    if (tipButton && tipText) {
        showRandomTip();

        tipButton.addEventListener('click', showRandomTip);
    }

    speakButton.addEventListener('click', () => {
        const tts = new SpeechSynthesisUtterance(tipText.textContent);
        speechSynthesis.speak(tts);


    }
    )
}

document.getElementById('saveReminder').addEventListener('click', async () => {
    if (!("Notification" in window)) {
        alert("This system does not support push notifications");
        return;
    }

    async function subscribeUserToPush() {
        const registration = await navigator.serviceWorker.ready;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BPAz2Rvk6nj4t7cUBaJc3B70ZXOUxfuEoi-LohzpbMbosWwLjBcRRlhq09w_kM2FjYZhPuy6uCE-s3mTu9sq2ig')
            });

            console.log('Push Subscription:', subscription);

            await fetch('https://cognitiveexercisetool.onrender.com/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            console.log('Already subscribed:', subscription);
        }
        return subscription;
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    let permission = Notification.permission;
    if (permission === "default") {
        permission = await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
        const subscription = await subscribeUserToPush();

        const time = new Date(document.getElementById('reminderTime').value);
        const text = document.getElementById('reminderText').value;
        const id = Date.now();
        const reminder = { id, time: time.toISOString(), text };

        await fetch('https://cognitiveexercisetool.onrender.com/reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription, reminder })
        });

        saveReminder(reminder);
        renderReminder(reminder);

    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Notifications enabled!");
                subscribeUserToPush();
            } else {
                alert("Notifications denied.");
            }
        });
    } else {
        alert("Notifications are blocked. Please enable them in your app settings.");
    }
});