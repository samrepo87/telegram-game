// Initialize game variables
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 7;

// Telegram Web App initialization
const tg = window.Telegram.WebApp;
tg.expand(); // Expand the web app to full size

// Ad management variables
let adShownCount = 0;
const maxAdsPerSession = 2;
let adTimeout;
let adInterval;

// Get DOM elements
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const restartButton = document.getElementById('restartButton');
const adContainer = document.getElementById('adContainer');
const closeAdButton = document.getElementById('closeAd');
const adCountdown = document.getElementById('adCountdown');
const gameContainer = document.getElementById('gameContainer');

// Game functions
function checkGuess() {
    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) {
        message.textContent = "Please enter a number!";
        return;
    }
    
    if (userGuess < 1 || userGuess > 100) {
        message.textContent = "Please enter a number between 1 and 100!";
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
    
    // Show ad when game ends
    showAd();
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
    
    // Show ad when new game starts (every 2nd game)
    if (Math.random() < 0.5) {
        showAd();
    }
}

// Ad functions
function showAd() {
    if (adShownCount >= maxAdsPerSession) return;
    
    adShownCount++;
    gameContainer.classList.add('blur');
    adContainer.style.display = 'flex';
    
    let secondsLeft = 5;
    adCountdown.textContent = `Ad will close in ${secondsLeft} seconds`;
    
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        adCountdown.textContent = `Ad will close in ${secondsLeft} seconds`;
        
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            closeAd();
        }
    }, 1000);
    
    adTimeout = setTimeout(() => {
        clearInterval(countdownInterval);
        closeAd();
    }, 5000);
}

function closeAd() {
    gameContainer.classList.remove('blur');
    adContainer.style.display = 'none';
    clearTimeout(adTimeout);
}

// Event listeners
guessButton.addEventListener('click', checkGuess);
restartButton.addEventListener('click', restartGame);
closeAdButton.addEventListener('click', closeAd);

// Also allow pressing Enter to submit guess
guessInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

// Initialize the game
restartGame();

// Show first ad after 5 seconds
setTimeout(() => {
    showAd();
}, 5000);

// Show ads periodically (every 30 seconds)
adInterval = setInterval(() => {
    if (adShownCount < maxAdsPerSession) {
        showAd();
    }
}, 30000);

// In-App Interstitial Ad Integration
function show_9223341(settings) {
    const { type, inAppSettings } = settings;
    if (type === 'inApp') {
        // Implement your actual ad SDK integration here
        console.log('Showing ad with settings:', inAppSettings);
        
        // For demo purposes, we'll use our showAd function
        setTimeout(() => {
            showAd();
        }, inAppSettings.timeout * 1000);
        
        if (inAppSettings.frequency > 1) {
            setInterval(() => {
                if (adShownCount < inAppSettings.frequency) {
                    showAd();
                }
            }, inAppSettings.interval * 1000);
        }
    }
}

// Call the ad function with your settings
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
