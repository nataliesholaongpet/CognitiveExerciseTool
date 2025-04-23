if ('serviceWorker' in navigator) {
    window.addEventListener('load' , () => {
        navigator.serviceWorker.register('/sw.js')
                  .then(registration => {
            console.log('Service Worker registered with scope:' , registration.scope);
        }).catch(error => {
            console.log('Service Worker registration failed:' , error);
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

// lifestyle tips section
function LifestyleTips() {
    const tips = ["Placeholder 1", "Placeholder 2", "Placeholder 3"];
    const tipButton = document.getElementById('tipButton');
    const tipText = document.getElementById('tipText');

    function showRandomTip() {
        const random = tips[Math.floor(Math.random() * tips.length)];
        tipText.textContent = random;
    }

    if (tipButton && tipText) {
        showRandomTip();
    
        tipButton.addEventListener('click', showRandomTip);
      }
}
