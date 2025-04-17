// Game state
const gameState = {
    secretNumber: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    maxAttempts: 7,
    gameOver: false
};

// Telegram Web App initialization
const tg = window.Telegram.WebApp;
tg.expand();

// DOM elements
const elements = {
    guessInput: document.getElementById('guessInput'),
    guessButton: document.getElementById('guessButton'),
    message: document.getElementById('message'),
    attemptsDisplay: document.getElementById('attempts'),
    restartButton: document.getElementById('restartButton')
};

// Initialize game
function initGame() {
    gameState.secretNumber = Math.floor(Math.random() * 100) + 1;
    gameState.attempts = 0;
    gameState.gameOver = false;
    
    elements.guessInput.value = '';
    elements.guessInput.disabled = false;
    elements.guessButton.disabled = false;
    elements.message.classList.add('hidden');
    elements.attemptsDisplay.textContent = `Attempts: ${gameState.attempts}`;
    elements.restartButton.classList.add('hidden');
    
    elements.guessInput.focus();
}

// Display message
function showMessage(text, type) {
    elements.message.textContent = text;
    elements.message.className = 'message';
    elements.message.classList.add(type);
    elements.message.classList.remove('hidden');
}

// Check user's guess
function checkGuess() {
    if (gameState.gameOver) return;
    
    const userGuess = parseInt(elements.guessInput.value);
    
    if (isNaN(userGuess)) {
        showMessage('Please enter a valid number!', 'error');
        return;
    }
    
    if (userGuess < 1 || userGuess > 100) {
        showMessage('Please enter a number between 1 and 100!', 'error');
        return;
    }
    
    gameState.attempts++;
    elements.attemptsDisplay.textContent = `Attempts: ${gameState.attempts}`;
    
    if (userGuess === gameState.secretNumber) {
        endGame(true);
    } else if (gameState.attempts >= gameState.maxAttempts) {
        endGame(false);
    } else {
        const hint = userGuess < gameState.secretNumber ? 'Too low!' : 'Too high!';
        showMessage(`${hint} Try again.`, 'info');
        elements.guessInput.value = '';
        elements.guessInput.focus();
    }
}

// End game
function endGame(isWin) {
    gameState.gameOver = true;
    
    if (isWin) {
        showMessage(`Congratulations! You guessed the number ${gameState.secretNumber} in ${gameState.attempts} attempts!`, 'success');
        elements.guessButton.classList.add('pulse');
    } else {
        showMessage(`Game over! The number was ${gameState.secretNumber}.`, 'error');
    }
    
    elements.guessInput.disabled = true;
    elements.guessButton.disabled = true;
    elements.restartButton.classList.remove('hidden');
    
    // Show ad when game ends (exactly as requested)
    show_9223341({ 
        type: 'inApp', 
        inAppSettings: { 
            frequency: 2, 
            capping: 0.1, 
            interval: 30, 
            timeout: 5, 
            everyPage: false 
        } 
    });
}

// Event listeners
elements.guessButton.addEventListener('click', checkGuess);
elements.restartButton.addEventListener('click', initGame);
elements.guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkGuess();
});

// Initialize the game
initGame();

// Ad implementation (exactly as provided)
function show_9223341(settings) {
    console.log('Ad would show now with settings:', settings);
    // This is where your actual ad implementation would go
    // Keeping it exactly as you provided without modifications
}
