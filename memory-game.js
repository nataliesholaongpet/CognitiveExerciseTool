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

function showLevelPopup(message, callback) {
  const popup = document.getElementById('levelPopup');
  const popupText = document.getElementsByClassName('popupText')[1];
  const popupButton = document.getElementsByClassName('popupButton')[1];

  popupText.textContent = message;
  popup.classList.remove('hidden');

  popupButton.onclick = () => {
    popup.classList.add('hidden');
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