const grid = document.getElementById('grid');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

const emojis = ['🚀', '🛸', '🌌', '🌍', '⭐', '☄️', '🛰️', '🌕'];
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function initGame() {
    grid.innerHTML = '';
    cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);

    cards.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${emoji}</div>
        `;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });

    resetBoard();
    moves = 0;
    matches = 0;
    seconds = 0;
    gameStarted = false;
    movesDisplay.textContent = moves;
    timeDisplay.textContent = '00:00';
    clearInterval(timer);
    winModal.classList.remove('active');
}

function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    startTimer();

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-back').textContent === secondCard.querySelector('.card-back').textContent;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matches++;
    if (matches === emojis.length) {
        setTimeout(gameWon, 500);
    }
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function gameWon() {
    clearInterval(timer);
    finalTimeDisplay.textContent = timeDisplay.textContent;
    finalMovesDisplay.textContent = moves;
    winModal.classList.add('active');
}

restartBtn.addEventListener('click', () => {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('flipped', 'matched'));
    setTimeout(initGame, 400);
});

playAgainBtn.addEventListener('click', initGame);

// Initialize game on load
initGame();
