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

        saveReminder(reminder);
        schedulePushNotification(reminder);
        renderReminder(reminder);
        reminderForm.classList.toggle('hidden');
        saveReminderButton.classList.toggle('hidden');
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
    reminderDiv.innerHTML = `<span class="reminder-time"><strong>${formattedDate}</strong> <strong>${formattedTime}</strong></span><hr class="gradient-line"></hr><span class="reminder-text">${text}</span>`;
    container.appendChild(reminderDiv);
}

function schedulePushNotification(reminder) {
    const delay = new Date(reminder.time).getTime() - Date.now();

    if (delay > 0) {
        setTimeout(() => {
            (async () => {
                if (Notification.permission === 'granted') {
                    const reg = await navigator.serviceWorker.ready;

                    await reg.showNotification("Lifestyle Reminder", {
                        body: reminder.text,
                        icon: '/icon.png'
                    });
                    try {
                        await fetch('http://localhost:4000/send', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                title: "Lifestyle Reminder",
                                body: reminder.text
                            })
                        });
                    } catch (err) {
                        console.error("Error sending server push:", err);
                    }
                }
            })();
        }, delay);
    }
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
    const tips = ["Placeholder 1", "Placeholder 2", "Placeholder 3"];
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

document.getElementById('saveReminder').addEventListener('click', () => {
    if (!("Notification" in window)) {
        alert("This system does not support push notifications");
        return;
    }

    async function subscribeUserToPush() {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BPAz2Rvk6nj4t7cUBaJc3B70ZXOUxfuEoi-LohzpbMbosWwLjBcRRlhq09w_kM2FjYZhPuy6uCE-s3mTu9sq2ig')
        });

        console.log('Push Subscription:', subscription);

        await fetch('http://localhost:4000/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });
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

    if (Notification.permission === "granted") {
        alert("Notifications are already enabled.");
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