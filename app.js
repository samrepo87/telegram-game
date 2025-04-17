// Initialize game variables
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 7;

// Telegram Web App initialization
const tg = window.Telegram.WebApp;
tg.expand(); // Expand the web app to full size

// Get DOM elements
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const restartButton = document.getElementById('restartButton');

// Game functions
function checkGuess() {
    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = "Please enter a valid number between 1 and 100!";
        return;
    }
    
    attempts++;
    attemptsDisplay.textContent = `Attempts: ${attempts}`;
    
    if (userGuess === secretNumber) {
        endGame(true);
    } else if (attempts >= maxAttempts) {
        endGame(false);
    } else {
        message.textContent = userGuess < secretNumber ? "Too low! Try higher." : "Too high! Try lower.";
        guessInput.value = '';
        guessInput.focus();
    }
}

function endGame(isWin) {
    if (isWin) {
        message.textContent = `Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts!`;
    } else {
        message.textContent = `Game over! The number was ${secretNumber}.`;
    }
    
    guessInput.disabled = true;
    guessButton.disabled = true;
    restartButton.style.display = 'inline-block';
}

function restartGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    attemptsDisplay.textContent = `Attempts: ${attempts}`;
    message.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.disabled = false;
    restartButton.style.display = 'none';
    guessInput.focus();
}

// Event listeners
guessButton.addEventListener('click', checkGuess);
restartButton.addEventListener('click', restartGame);

// Also allow pressing Enter to submit guess
guessInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

// Initialize the game
restartGame();