// Word bank: 6 to 12 letter words in ALL CAPS with double letters
const bncWordPairs = [
    { correct: "COMMITTEE", misspelled: "COMITEE" },
    { correct: "SUCCESS", misspelled: "SUCES" },
    { correct: "ADDRESS", misspelled: "ADRESS" },
    { correct: "APPEAR", misspelled: "APEAR" },
    { correct: "DILEMMA", misspelled: "DILEMA" },
    { correct: "OCCUR", misspelled: "OCUR" },
    { correct: "PARALLEL", misspelled: "PARALEL" },
    { correct: "BRILLIANT", misspelled: "BRILIANT" },
    { correct: "BUBBLE", misspelled: "BUBLE" },
    { correct: "COMMERCE", misspelled: "COMERCE" },
    { correct: "PASSPORT", misspelled: "PASPORT" },
    { correct: "SUMMER", misspelled: "SUMER" },
    { correct: "BALLOON", misspelled: "BALOON" },
    { correct: "POSSESSION", misspelled: "POSESION" },
    { correct: "COLLEAGUE", misspelled: "COLEAGUE" },
    { correct: "PROFESSOR", misspelled: "PROFESOR" }
];

let bncState = {
    score: 0,
    lives: 3,
    level: 1,
    isPlaying: false,
    spawnInterval: null
};

// Hook into your main dashboard mini-game card click
function startMiniGame(gameName) {
    if (gameName === 'break-n-crash') {
        document.getElementById('dashboard-screen').classList.remove('active');
        document.getElementById('breakncrash-screen').classList.add('active');
        document.getElementById('bnc-start-overlay').classList.add('active');
    } else {
        alert(`Loading mini-game: ${gameName.toUpperCase()}! Coming soon, Dia.`);
    }
}

function exitBreakNCrash() {
    bncState.isPlaying = false;
    clearInterval(bncState.spawnInterval);
    document.querySelectorAll('.bnc-word').forEach(el => el.remove());
    
    document.getElementById('breakncrash-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
}

function startBreakNCrashGame() {
    document.getElementById('bnc-start-overlay').classList.remove('active');
    document.getElementById('bnc-gameover-modal').classList.remove('active');
    
    bncState.score = 0;
    bncState.lives = 3;
    bncState.level = 1;
    bncState.isPlaying = true;
    updateBncHUD();

    document.querySelectorAll('.bnc-word').forEach(el => el.remove());
    startBncSpawning();
}

function updateBncHUD() {
    document.getElementById('bnc-score').textContent = bncState.score;
    document.getElementById('bnc-life').textContent = '❤️'.repeat(bncState.lives);
    document.getElementById('bnc-level').textContent = bncState.level;
}

function startBncSpawning() {
    const intervalTime = Math.max(1900 - (bncState.level - 1) * 200, 950);

    bncState.spawnInterval = setInterval(() => {
        if (!bncState.isPlaying) return;
        spawnBncWord();
    }, intervalTime);
}

function spawnBncWord() {
    const arena = document.getElementById('breakncrash-arena');
    const pair = bncWordPairs[Math.floor(Math.random() * bncWordPairs.length)];
    
    const isMisspelled = Math.random() < 0.5;
    const wordText = isMisspelled ? pair.misspelled : pair.correct;

    const wordEl = document.createElement('div');
    wordEl.className = 'bnc-word raining-word';
    wordEl.textContent = wordText;

    const maxX = arena.clientWidth - 160;
    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    wordEl.style.left = randomX + 'px';

    // Slowest starting speed (4.5 seconds fall duration), getting slightly faster with levels
    const fallDuration = Math.max(4.5 - (bncState.level * 0.25), 2.0);
    wordEl.style.transition = `top ${fallDuration}s linear, transform 0.1s ease`;

    arena.appendChild(wordEl);

    requestAnimationFrame(() => {
        wordEl.style.top = (arena.clientHeight - 50) + 'px';
    });

    // Click / Tap Handler
    wordEl.addEventListener('click', () => {
        if (!bncState.isPlaying) return;

        if (isMisspelled) {
            // Correctly clicked misspelled word -> Score +10
            wordEl.classList.add('blasting');
            bncState.score += 10;
            checkBncLevel();
            updateBncHUD();
            setTimeout(() => wordEl.remove(), 300);
        } else {
            // Clicked a correct word -> Penalty (Lose Life)
            wordEl.classList.add('penalty');
            loseBncLife();
            setTimeout(() => wordEl.remove(), 300);
        }
    });

    // Reached bottom check
    setTimeout(() => {
        if (!wordEl.isConnected) return;
        if (isMisspelled) {
            // Missed a misspelled word hitting the danger line -> Lose Life
            loseBncLife();
        }
        wordEl.remove();
    }, fallDuration * 1000);
}

function checkBncLevel() {
    const newLevel = Math.floor(bncState.score / 200) + 1;
    if (newLevel !== bncState.level) {
        bncState.level = newLevel;
        clearInterval(bncState.spawnInterval);
        startBncSpawning();
    }
}

function loseBncLife() {
    bncState.lives--;
    updateBncHUD();

    if (bncState.lives <= 0) {
        endBncGame();
    }
}

function endBncGame() {
    bncState.isPlaying = false;
    clearInterval(bncState.spawnInterval);
    document.querySelectorAll('.bnc-word').forEach(el => el.remove());

    document.getElementById('bnc-final-score').textContent = `Your Final Score: ${bncState.score}`;
    document.getElementById('bnc-gameover-modal').classList.add('active');
}
