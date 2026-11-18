// ==========================================
// BREAK N' CRASH - Mini Game Module
// ==========================================

const BreakNCrashGame = {
    score: 0,
    lives: 3,
    level: 1,
    gameInterval: null,
    spawnInterval: null,
    activeWords: [],
    isGameRunning: false,
    availableWords: [],

    // Comprehensive dictionary pair pool to prevent repetition
    masterWordPool: [
        { correct: "COMPLETION", misspelled: "COMPLETSHON" },
        { correct: "CONGRATULATIONS", misspelled: "CONGRADULATION" },
        { correct: "COMMITTEE", misspelled: "COMITEE" },
        { correct: "EXPRESSION", misspelled: "EXPRESHUN" },
        { correct: "INTERNATIONAL", misspelled: "INTERNATIONEL" },
        { correct: "DICTIONARY", misspelled: "DICTONARY" },
        { correct: "NECESSARY", misspelled: "NECESARY" },
        { correct: "DEFINITELY", misspelled: "DEFINATELY" },
        { correct: "ACCOMMODATE", misspelled: "ACOMMODATE" },
        { correct: "ACHIEVEMENT", misspelled: "ACHIEVMENT" },
        { correct: "ARGUMENT", misspelled: "ARGUEMENT" },
        { correct: "BEGINNING", misspelled: "BEGINING" },
        { correct: "CALENDAR", misspelled: "CALENDER" },
        { correct: "CATEGORY", misspelled: "CATAGORY" },
        { correct: "COLLEAGUE", misspelled: "COLLEAGE" },
        { correct: "CONSCIOUS", misspelled: "CONSCOUS" },
        { correct: "CURRICULUM", misspelled: "CURRICLUM" },
        { correct: "DISAPPOINT", misspelled: "DISSAPOINT" },
        { correct: "ENVIRONMENT", misspelled: "ENVIROMENT" },
        { correct: "EXPERIENCE", misspelled: "EXPERIANCE" },
        { correct: "FAMILIAR", misspelled: "FAMLIAR" },
        { correct: "GOVERNMENT", misspelled: "GOVERMENT" },
        { correct: "GUARANTEE", misspelled: "GARANTEE" },
        { correct: "INDEPENDENCE", misspelled: "INDEPENDANCE" },
        { correct: "KNOWLEDGE", misspelled: "KNOWEDGE" },
        { correct: "MAINTENANCE", misspelled: "MAINTANENCE" },
        { correct: "MILLENNIUM", misspelled: "MILENNIUM" },
        { correct: "OCCURRED", misspelled: "OCCURED" },
        { correct: "PARLIAMENT", misspelled: "PARLIAMENT" },
        { correct: "POSSESSION", misspelled: "POSESION" },
        { correct: "PRONUNCIATION", misspelled: "PRONUNCIATION" },
        { correct: "QUESTIONNAIRE", misspelled: "QUESTONAIRE" },
        { correct: "RECEIVE", misspelled: "RECIEVE" },
        { correct: "RECOMMEND", misspelled: "RECOMEND" },
        { correct: "SCHEDULE", misspelled: "SHEDULE" },
        { correct: "SEPARATE", misspelled: "SEPERATE" },
        { correct: "SUCCESSFUL", misspelled: "SUCCESFUL" },
        { correct: "TEMPERATURE", misspelled: "TEMPRATURE" },
        { correct: "THRESHOLD", misspelled: "THRESHHOLD" },
        { correct: "TOMORROW", misspelled: "TOMORROW" },
        { correct: "UNFORGETTABLE", misspelled: "UNFORGETABLE" },
        { correct: "VACUUM", misspelled: "VACCUM" },
        { correct: "WONDERFUL", misspelled: "WONDEFUL" }
    ],

    // Initialize UI container & modals
    init() {
        if (document.getElementById('break-n-crash-container')) return;

        // 1. Main Game Playfield Container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'break-n-crash-container';
        gameContainer.style.cssText = `
            display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.85); z-index: 9999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #fff; user-select: none; overflow: hidden;
        `;

        gameContainer.innerHTML = `
            <div id="bnc-hud" style="display: flex; justify-content: space-between; padding: 20px 40px; font-size: 20px; font-weight: bold; background: rgba(0,0,0,0.4);">
                <div id="bnc-lives">LIFE: ❤️❤️❤️</div>
                <div id="bnc-score">SCORE: 0</div>
                <div id="bnc-level">LEVEL: 1</div>
            </div>
            <div id="bnc-playfield" style="position: relative; width: 100%; height: calc(100vh - 140px); overflow: hidden;">
                <div style="position: absolute; bottom: 60px; left: 50px; display: flex; align-items: flex-end; gap: 20px;">
                    <div style="font-size: 40px;">🙇‍♂️</div>
                </div>
                <div style="position: absolute; bottom: 50px; left: 0; width: 100%; border-bottom: 4px solid #fff;"></div>
            </div>
            <button id="bnc-exit-btn" style="position: absolute; bottom: 10px; right: 20px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Exit Game</button>
        `;
        document.body.appendChild(gameContainer);

        // 2. Game Over Modal Container
        const gameOverModal = document.createElement('div');
        gameOverModal.id = 'bnc-game-over-modal';
        gameOverModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.8); z-index: 10001; display: none;
            align-items: center; justify-content: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        gameOverModal.innerHTML = `
            <div style="background: #fff; color: #333; padding: 35px; border-radius: 12px; width: 400px; max-width: 90%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
                <h1 style="margin-top: 0; color: #e74c3c; font-size: 32px; letter-spacing: 1px;">GAME OVER</h1>
                <p style="font-size: 16px; color: #555; margin: 15px 0;">Your Final Score:</p>
                <div id="bnc-final-score" style="font-size: 42px; font-weight: bold; color: #2c3e50; margin-bottom: 25px;">0</div>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="bnc-play-again-btn" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Play Again</button>
                    <button id="bnc-go-exit-btn" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Main Menu</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameOverModal);

        // Event listeners for Game Over buttons
        document.getElementById('bnc-play-again-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            document.getElementById('break-n-crash-container').style.display = 'block';
            this.startGame();
        });

        document.getElementById('bnc-go-exit-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
        });

        document.getElementById('bnc-exit-btn').addEventListener('click', () => this.endGameManually());
    },

    // Show instruction modal
    showInstructions(onStartCallback) {
        this.init();
        
        let modal = document.getElementById('bnc-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'bnc-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.7); z-index: 10000; display: flex;
                align-items: center; justify-content: center;
            `;
            modal.innerHTML = `
                <div style="background: #fff; color: #333; padding: 30px; border-radius: 12px; width: 450px; max-width: 90%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                    <h2 style="margin-top: 0; color: #2c3e50;">Break N' Crash</h2>
                    <p style="font-size: 14px; line-height: 1.5; color: #555; text-align: left;">
                        Words rain down the screen. Eliminate the <strong>misspelled words</strong> by clicking or tapping them before they hit the bottom line! 
                        <br><br>• Each misspelled word blasted: <strong>+10 points</strong>
                        <br><br>• Clicking a correct word or letting a misspelled word hit the bottom costs <strong>1 life</strong> (3 lives total).
                        <br><br>• Level advances automatically every 200 points, increasing fall speed continuously!
                    </p>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                        <button id="bnc-start-game-btn" style="padding: 10px 25px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">GAME</button>
                        <button id="bnc-cancel-modal-btn" style="padding: 10px 25px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">CANCEL</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('bnc-start-game-btn').addEventListener('click', () => {
                modal.style.display = 'none';
                document.getElementById('break-n-crash-container').style.display = 'block';
                this.startGame();
                if (onStartCallback) onStartCallback();
            });

            document.getElementById('bnc-cancel-modal-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        } else {
            modal.style.display = 'flex';
        }
    },

    startGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.activeWords = [];
        this.isGameRunning = true;
        
        // Refresh and shuffle dictionary pool so words aren't repeated until the pool resets
        this.availableWords = [...this.masterWordPool].sort(() => Math.random() - 0.5);
        
        this.updateHUD();

        const playfield = document.getElementById('bnc-playfield');
        playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());

        // Spawner loop
        this.spawnInterval = setInterval(() => {
            if (this.isGameRunning) this.spawnWord();
        }, 2000);

        // Main game ticker loop
        this.gameInterval = setInterval(() => {
            if (this.isGameRunning) this.updateGameLoop();
        }, 30);
    },

    spawnWord() {
        const playfield = document.getElementById('bnc-playfield');
        
        if (this.availableWords.length === 0) {
            this.availableWords = [...this.masterWordPool].sort(() => Math.random() - 0.5);
        }

        const item = this.availableWords.pop();
        const isMisspelled = Math.random() > 0.4; 
        const wordText = isMisspelled ? item.misspelled : item.correct;

        const node = document.createElement('div');
        node.className = 'bnc-word-node';
        node.textContent = wordText;

        const maxX = playfield.clientWidth - 160;
        const randomX = Math.max(20, Math.floor(Math.random() * maxX));

        node.style.cssText = `
            position: absolute; top: 0px; left: ${randomX}px;
            background: #fff; color: #2c3e50; padding: 6px 12px;
            border-radius: 20px; font-weight: bold; font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;
            transition: transform 0.1s;
        `;

        node.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            if (!this.isGameRunning) return;

            if (isMisspelled) {
                this.score += 10;
                this.createBlastEffect(node);
                node.remove();
                this.activeWords = this.activeWords.filter(w => w.element !== node);
                this.level = Math.floor(this.score / 200) + 1;
            } else {
                this.loseLife();
                node.style.background = '#e74c3c';
                node.style.color = '#fff';
                setTimeout(() => node.remove(), 200);
                this.activeWords = this.activeWords.filter(w => w.element !== node);
            }
            this.updateHUD();
        });

        playfield.appendChild(node);
        
        this.activeWords.push({
            element: node,
            y: 0,
            speed: (1.0 + (this.level - 1) * 0.35),
            isMisspelled: isMisspelled
        });
    },

    updateGameLoop() {
        const playfield = document.getElementById('bnc-playfield');
        const floorLimit = playfield.clientHeight - 80;

        for (let i = this.activeWords.length - 1; i >= 0; i--) {
            let obj = this.activeWords[i];
            obj.y += obj.speed;
            obj.element.style.top = obj.y + 'px';

            if (obj.y >= floorLimit) {
                if (obj.isMisspelled) {
                    this.loseLife();
                }
                obj.element.remove();
                this.activeWords.splice(i, 1);
                this.updateHUD();
            }
        }

        if (this.lives <= 0) {
            this.triggerGameOver();
        }
    },

    loseLife() {
        this.lives--;
        if (this.lives < 0) this.lives = 0;
    },

    createBlastEffect(node) {
        const rect = node.getBoundingClientRect();
        const spark = document.createElement('div');
        spark.textContent = '💥 +10';
        spark.style.cssText = `
            position: fixed; top: ${rect.top}px; left: ${rect.left}px;
            color: #f1c40f; font-weight: bold; font-size: 18px; z-index: 10001;
            pointer-events: none; transition: transform 0.5s, opacity 0.5s;
        `;
        document.body.appendChild(spark);
        setTimeout(() => {
            spark.style.transform = 'translateY(-30px) scale(1.3)';
            spark.style.opacity = '0';
        }, 20);
        setTimeout(() => spark.remove(), 500);
    },

    updateHUD() {
        const hearts = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
        document.getElementById('bnc-lives').textContent = `LIFE: ${hearts}`;
        document.getElementById('bnc-score').textContent = `SCORE: ${this.score}`;
        document.getElementById('bnc-level').textContent = `LEVEL: ${this.level}`;
    },

    triggerGameOver() {
        this.isGameRunning = false;
        clearInterval(this.gameInterval);
        clearInterval(this.spawnInterval);

        const playfield = document.getElementById('bnc-playfield');
        if (playfield) {
            playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());
        }

        document.getElementById('break-n-crash-container').style.display = 'none';

        // Reflect final score and show Game Over dialog box
        document.getElementById('bnc-final-score').textContent = this.score;
        document.getElementById('bnc-game-over-modal').style.display = 'flex';
    },

    endGameManually() {
        this.isGameRunning = false;
        clearInterval(this.gameInterval);
        clearInterval(this.spawnInterval);

        const playfield = document.getElementById('bnc-playfield');
        if (playfield) {
            playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());
        }

        document.getElementById('break-n-crash-container').style.display = 'none';
    }
};
