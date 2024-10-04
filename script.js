let words = [];
let guessedWords = new Set();
let currentWord = '';
let scrambledWord = '';
let startTime;
let timerInterval;


fetch('./countries.json')
    .then(response => {return response.json();}) 
    .then(data => {
        words = data.countries;
        newGame();
    });


function scrambleWord(word) {
    const wordArr = word.split('');
    for (let i = wordArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArr[i], wordArr[j]] = [wordArr[j], wordArr[i]];
    }
    return wordArr.join('');
}


function newGame() {
    if (timerInterval) clearInterval(timerInterval);
    startTimer();

    
    let availableWords = words.filter(word => !guessedWords.has(word));
    if (availableWords.length === 0) {
        endGame();
        return;
    }
    currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    scrambledWord = scrambleWord(currentWord);

    
    document.getElementById('tiles-container').innerHTML = '';
    document.getElementById('letters-container').innerHTML = '';
    document.getElementById('result').innerText = '';
    document.getElementById('continue-btn').style.display = 'none';
    document.getElementById('end-btn').style.display = 'none';

    
    for (let i = 0; i < currentWord.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${i}`;
        tile.ondrop = drop;
        tile.ondragover = allowDrop;
        document.getElementById('tiles-container').appendChild(tile);
    }

    
    scrambledWord.split('').forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.draggable = true;
        letterDiv.ondragstart = drag;
        letterDiv.id = `letter-${index}`;
        letterDiv.innerText = letter;
        document.getElementById('letters-container').appendChild(letterDiv);
    });
}


function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}


function updateTimer() {
    const currentTime = new Date();
    const timeSpent = Math.floor((currentTime - startTime) / 1000);
}


function allowDrop(event) {
    event.preventDefault();
}


function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}


function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const targetTile = event.target;

    if (targetTile.innerText === '') {
        const letterDiv = document.getElementById(data);
        targetTile.innerText = letterDiv.innerText;

        letterDiv.style.visibility = 'hidden';

        if (areAllTilesFilled()) {
            checkGuess();
        }
    }
}


function areAllTilesFilled() {
    for (let i = 0; i < currentWord.length; i++) {
        const tile = document.getElementById(`tile-${i}`);
        if (tile.innerText === '') {
            return false;
        }
    }
    return true;
}


function changeBG(color) {
    for (let i = 0; i < currentWord.length; i++) {
        const tile = document.getElementById(`tile-${i}`);
        tile.style.boxShadow = color;
    }
}


function checkGuess() {
    let userGuess = '';

    for (let i = 0; i < currentWord.length; i++) {
        const tile = document.getElementById(`tile-${i}`);
        userGuess += tile.innerText;
    }

    if (userGuess === currentWord) {
        changeBG("none");
        guessedWords.add(currentWord);
        document.getElementById('continue-btn').style.display = 'inline';
        document.getElementById('end-btn').style.display = 'inline';
        clearInterval(timerInterval);
    } else {
        let correctLettersInTiles = [];

        for (let i = 0; i < currentWord.length; i++) {
            const tile = document.getElementById(`tile-${i}`);
            if (tile.innerText === currentWord[i]) {
                correctLettersInTiles.push(tile.innerText);
                tile.style.boxShadow = "none";
            }
        }

        for (let i = 0; i < currentWord.length; i++) {
            const tile = document.getElementById(`tile-${i}`);

            if (tile.innerText !== currentWord[i]) {
                const letter = tile.innerText;
                tile.style.boxShadow = "0px 0px 1px 1px red";

                scrambledWord.split('').forEach((scrambledLetter, index) => {
                    const letterDiv = document.getElementById(`letter-${index}`);
                    if (scrambledLetter === letter && letterDiv.style.visibility === 'hidden') {

                        const correctLetterIndex = correctLettersInTiles.indexOf(letter);
                        if (correctLetterIndex === -1) {
                            letterDiv.style.visibility = 'visible';
                        } else {
                            correctLettersInTiles.splice(correctLetterIndex, 1);
                        }
                    }
                });
                tile.innerText = '';
            }
        }
    }
}


function continueGame() {
    newGame();
}


function endGame() {
    clearInterval(timerInterval);
    const timeSpent = Math.floor((new Date() - startTime) / 1000);
    document.getElementById('result').innerText = `Paldies par spēli! Tu spēlē pavadīji ${timeSpent} sekundes.`;
    document.getElementById('continue-btn').style.display = 'none';
    document.getElementById('end-btn').style.display = 'none';
}