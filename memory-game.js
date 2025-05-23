const cardSymbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍍', '🥝'];
let cards = [...cardSymbols, ...cardSymbols];
let firstCard = null;
let secondCard = null;
let score = 0;
let currentDifficultyIndex = 0;
let lockBoard = false;

const difficulties = ['easy', 'medium', 'hard'];
const difficultyPairs = {
  easy: 4,
  medium: 6,
  hard: 8
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCard(symbol) {
  const div = document.createElement('div');
  div.classList.add('card');
  div.dataset.symbol = symbol;
  div.textContent = '';

  div.addEventListener('click', () => {
    if (div.classList.contains('flipped') || div.classList.contains('matched')) return;
    if (lockBoard) return;

    div.classList.add('flipped');
    div.textContent = symbol;

    if (!firstCard) {
      firstCard = div;
    } else {
      secondCard = div;
      checkMatch();
    }
  });

  return div;
}

function checkMatch() {
  lockBoard = true;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    updateScore();
    resetFlips();
    checkForWin();
    lockBoard = false;
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetFlips();
      lockBoard = false;
    }, 1000);
  }
}

function resetFlips() {
  firstCard = null;
  secondCard = null;
}

function updateScore() {
  score++;
  document.getElementById('score').textContent = `Score: ${score}`;
}

function checkForWin() {
  const allMatched = document.querySelectorAll('.card.matched').length === cards.length;
  if (allMatched) {
    setTimeout(() => {
      advanceDifficulty();
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('infoPopup');
  const popupButton = document.getElementsByClassName('popupButton')[0];
  const infoPopupButton = document.getElementsByClassName('showInfoPopup')[0];
  const overlay = document.getElementById('infoOverlay');

  overlay.classList.remove('hidden');
  popup.style.display = 'block';

  requestAnimationFrame(() => {
    popup.classList.add('show');
  });

  popupButton.addEventListener('click', () => {
    popup.style.display = 'none';
    popup.classList.remove('show');
    overlay.classList.add('hidden');
  });

  infoPopupButton.addEventListener('click', () => {
    popup.style.display = 'block';
    overlay.classList.remove('hidden');

    void popup.offsetWidth;

    requestAnimationFrame(() => {
      popup.classList.add('show');
    });
  });
});

function showLevelPopup(message, callback) {
  const popup = document.getElementById('levelPopup');
  const overlay = document.getElementById('levelOverlay');
  const popupText = popup.querySelector('.popupText');
  const popupButton = popup.querySelector('.popupButton');

  popupText.textContent = message;
  overlay.classList.remove('hidden');
  popup.classList.remove('hidden');

  void popup.offsetWidth;

  requestAnimationFrame(() => {
    popup.classList.add('show');
  });

  popupButton.onclick = () => {
    popup.classList.remove('show');
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
    if (callback) callback();
  };
}


function advanceDifficulty() {
  if (currentDifficultyIndex < difficulties.length - 1) {
    currentDifficultyIndex++;
    const nextLevel = difficulties[currentDifficultyIndex];
    showLevelPopup(`Well done! Moving to ${nextLevel.toUpperCase()} level!`)
    initGame(nextLevel);
  } else {
    showLevelPopup('Congratulations! You completed all levels!');
    currentDifficultyIndex = 0;
    initGame('easy');
  }
}

function initGame(level) {
  const numPairs = difficultyPairs[level];
  const selectedSymbols = cardSymbols.slice(0, numPairs);
  cards = [...selectedSymbols, ...selectedSymbols];
  shuffle(cards);

  const board = document.getElementById('gameBoard');
  board.innerHTML = '';

  cards.forEach(symbol => {
    board.appendChild(createCard(symbol));
  });

  score = 0;
}

initGame('easy');