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
    // Show rewarded ad before restarting
    showRewardedAd()
        .then(() => {
            // Ad was completed - proceed with restart
            actualRestart();
        })
        .catch((error) => {
            // Ad was skipped or failed - still restart but could add logic here
            console.log("Ad skipped or failed:", error);
            actualRestart();
        });
}

function actualRestart() {
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

// Ad integration function
function showRewardedAd() {
    return new Promise((resolve, reject) => {
        // Check if ad function exists (for testing outside ad environment)
        if (typeof show_9223341 === 'function') {
            show_9223341('pop')
                .then(() => {
                    // Ad completed successfully
                    resolve();
                })
                .catch((error) => {
                    // Ad failed or was skipped
                    reject(error);
                });
        } else {
            // For testing without actual ad SDK
            console.log("Ad would show here in production");
            // Simulate ad completion after short delay
            setTimeout(resolve, 1000);
        }
    });
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
actualRestart();
