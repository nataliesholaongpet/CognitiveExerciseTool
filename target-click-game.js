const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

let reactionTimes = [];
let gameDuration = 30; 
let gameEndTime;
let targetAppearTime;
let gameActive = false;

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('infoPopup');
  const popupButton = document.getElementsByClassName('popupButton')[0];
  const infoPopupButton = document.getElementsByClassName('showInfoPopup')[0];
  const overlay = document.getElementsByClassName('popupOverlay')[0];

  popupButton.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.classList.add('hidden');
  });

  infoPopupButton.addEventListener('click', () => {
    popup.style.display = 'block';
    overlay.classList.remove('hidden');
  });
});

function createTarget() {
  if (!gameActive) return;

  const target = document.createElement('div');
  target.classList.add('target');

  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const size = 50;

  const x = Math.random() * (areaWidth - size);
  const y = Math.random() * (areaHeight - size);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  targetAppearTime = Date.now();

  target.addEventListener('click', () => {
    const clickTime = Date.now();
    const reactionTime = clickTime - targetAppearTime;
    reactionTimes.push(reactionTime);

    target.remove();
    spawnNextTarget();
  });

  gameArea.appendChild(target);
}

function spawnNextTarget() {
  if (!gameActive) return;

  const delay = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (Date.now() < gameEndTime) {
      createTarget();
    }
  }, delay);
}

function startGame() {
  reactionTimes = [];
  gameActive = true;
  gameEndTime = Date.now() + gameDuration * 1000;
  scoreDisplay.textContent = `Time left: ${gameDuration}s`;

  const countdown = setInterval(() => {
    const timeLeft = Math.max(0, Math.floor((gameEndTime - Date.now()) / 1000));
    scoreDisplay.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);

  createTarget();
}

function endGame() {
  gameActive = false;
  gameArea.innerHTML = ''; 

  if (reactionTimes.length === 0) {
    scoreDisplay.textContent = "No clicks recorded!";
    return;
  }

  const total = reactionTimes.reduce((a, b) => a + b, 0);
  const average = total / reactionTimes.length;
  const averageSeconds = (average / 1000).toFixed(3);

  scoreDisplay.textContent = `Average Reaction Time: ${averageSeconds} seconds`;
}

startGame();
