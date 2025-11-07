//global vars
let randomNumber;
let attempts = 0;
let isGameOver = false;

//event listeners
document.querySelector("#guess-btn").addEventListener("click", checkGuess);
document.querySelector("#reset-btn").addEventListener("click", initGame);

//submit guess enter keypress on input
document.querySelector("#guess-input").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        isGameOver ? initGame(): checkGuess();
    }
});

initGame();

function initGame() {
    isGameOver = false;
    attempts = 0;
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log(randomNumber);

    //hide reset button
    document.querySelector("#reset-btn").style.display = "none";

    //show guess button
    document.querySelector("#guess-btn").style.display = "inline";

    let playerGuess = document.querySelector("#guess-input");
    playerGuess.focus(); //focus guess text input
    playerGuess.value = "";
    let feedback = document.querySelector("#feedback");
    feedback.textContent = ""; //clear feedback message
    document.querySelector("#guesses").textContent = ""; //clear previous guesses
}

function checkGuess() {
    let guessInput = document.querySelector("#guess-input");
    let guess = guessInput.value;
    console.log("Player guess: " + guess);
    let feedback = document.querySelector("#feedback");
    if (guess < 1 || guess > 99) {
        feedback.textContent = "Please enter a value between 1 and 99.";
        feedback.style.color = "red";
        guessInput.select();
        return;
    }
    attempts++;
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
23
    if (guess == randomNumber) {
        feedback.textContent = "You guess it. You won!";
        feedback.style.color = "darkgreen";
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts >= 7) {
            feedback.textContent = "Sorry, you lost.";
            feedback.style.color = "red";
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high!";
            guessInput.select();
        } else {
            feedback.textContent = "Guess was low!";
            guessInput.select();
        }
    }
}

function gameOver() {
    isGameOver = true;
    guessBtn = document.querySelector("#guess-btn");
    resetBtn = document.querySelector("#reset-btn");
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";
}
