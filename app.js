if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
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

const addReminderButton = document.getElementById('addReminderButton');
const reminderForm = document.getElementById('reminderForm');

addReminderButton.addEventListener('click', () => {
    const isVisible = reminderForm.style.display === 'block';
    reminderForm.style.display = isVisible ? 'none' : 'block';
});

document.addEventListener('DOMContentLoaded', () => {
    loadReminders();

    document.getElementById('addReminderButton').addEventListener('click', () => {
        document.getElementById('reminderForm').style.display = 'block';
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
        document.getElementById('reminderForm').style.display = 'none';
        renderReminder(reminder);
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
    reminderDiv.innerHTML = `<span class="reminder-time"><strong>${formattedDate}</strong> <strong>${formattedTime}</strong></span><span class="reminder-text">${text}</span>`;
    container.appendChild(reminderDiv);
}

function schedulePushNotification(reminder) {
    const delay = new Date(reminder.time).getTime() - Date.now();
    if (delay > 0) {
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification("Lifestyle Reminder", {
                        body: reminder.text,
                        icon: '/icon.png'
                    });
                });
            }
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
)}
