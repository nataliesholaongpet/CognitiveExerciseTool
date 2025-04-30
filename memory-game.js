const cardSymbols = ['🍎','🍌','🍇','🍊','🍓','🍉','🍍','🥝'];
let cards = [...cardSymbols, ...cardSymbols];
let firstCard = null;
let secondCard = null;

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
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetFlips();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetFlips();
    }, 1000);
  }
}

function resetFlips() {
  firstCard = null;
  secondCard = null;
}

function initGame() {
  shuffle(cards);
  const board = document.getElementById('gameBoard');
  cards.forEach(symbol => {
    board.appendChild(createCard(symbol));
  });
}

initGame();