// Game state
const gameState = {
    secretNumber: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    maxAttempts: 7,
    gameOver: false,
    adsShown: 0,
    lastAdTime: 0
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
    restartButton: document.getElementById('restartButton'),
    adContainer: document.createElement('div')
};

// Create ad container
elements.adContainer.innerHTML = `
    <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        color: white;
        flex-direction: column;
    ">
        <h2 style="margin-bottom: 20px;">ADVERTISEMENT</h2>
        <p style="margin-bottom: 30px;">Support our game by watching this ad</p>
        <div id="adCountdown" style="margin-bottom: 20px;">Ad will close in 5 seconds</div>
        <button id="closeAd" style="
            padding: 10px 20px;
            background: #0088cc;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Skip Ad</button>
    </div>
`;
elements.adContainer.style.display = 'none';
document.body.appendChild(elements.adContainer);

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
    
    // Show ad when game ends
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

// Show ad function
function showAd() {
    // Check if we should show ad based on frequency and timing
    const now = Date.now();
    const hoursSinceLastAd = (now - gameState.lastAdTime) / (1000 * 60 * 60);
    
    if (gameState.adsShown >= 2 || (gameState.lastAdTime && hoursSinceLastAd < 0.1)) {
        return;
    }
    
    gameState.adsShown++;
    gameState.lastAdTime = now;
    
    // Show ad container
    elements.adContainer.style.display = 'block';
    const countdownElement = elements.adContainer.querySelector('#adCountdown');
    const closeButton = elements.adContainer.querySelector('#closeAd');
    
    let secondsLeft = 5;
    countdownElement.textContent = `Ad will close in ${secondsLeft} seconds`;
    
    const countdown = setInterval(() => {
        secondsLeft--;
        countdownElement.textContent = `Ad will close in ${secondsLeft} seconds`;
        
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            closeAd();
        }
    }, 1000);
    
    closeButton.onclick = () => {
        clearInterval(countdown);
        closeAd();
    };
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        clearInterval(countdown);
        closeAd();
    }, 5000);
}

function closeAd() {
    elements.adContainer.style.display = 'none';
}

// Ad implementation exactly as requested
function show_9223341(settings) {
    if (settings.type === 'inApp') {
        const { frequency, capping, interval, timeout, everyPage } = settings.inAppSettings;
        
        // First ad after timeout
        setTimeout(() => {
            showAd();
            
            // Subsequent ads at interval
            if (frequency > 1) {
                const adInterval = setInterval(() => {
                    if (gameState.adsShown < frequency) {
                        showAd();
                    } else {
                        clearInterval(adInterval);
                    }
                }, interval * 1000);
            }
        }, timeout * 1000);
    }
}

// Event listeners
elements.guessButton.addEventListener('click', checkGuess);
elements.restartButton.addEventListener('click', initGame);
elements.guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkGuess();
});

// Initialize the game
initGame();

// Initial ad display after 5 seconds
setTimeout(() => {
    show_9223341({ 
        type: 'inApp', 
        inAppSettings: { 
            frequency: 2, 
            capping: 0.1, 
            interval: 20, 
            timeout: 5, 
            everyPage: false 
        } 
    });
}, 100);
