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
    isPaused: false,
    availableWords: [],

    // Massive 100+ master dictionary pair pool to prevent repetition and add challenge
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
        { correct: "WONDERFUL", misspelled: "WONDEFUL" },
        { correct: "ABSENCE", misspelled: "ABSENCEE" },
        { correct: "ACCEPT", misspelled: "AXCEPT" },
        { correct: "ACCIDENTALLY", misspelled: "ACCIDENTLY" },
        { correct: "BANQUET", misspelled: "BANQET" },
        { correct: "BARGAIN", misspelled: "BARGAIN" },
        { correct: "BASICALLY", misspelled: "BASICALY" },
        { correct: "BREADTH", misspelled: "BREADTH" },
        { correct: "BRILLIANT", misspelled: "BRILIANT" },
        { correct: "BUREAU", misspelled: "BURROU" },
        { correct: "BUSINESS", misspelled: "BUSINES" },
        { correct: "CEMETERY", misspelled: "CEMETARY" },
        { correct: "CHALLENGE", misspelled: "CHALLANGE" },
        { correct: "CHANGEABLE", misspelled: "CHANGABLE" },
        { correct: "COLONEL", misspelled: "KERNAL" },
        { correct: "COMPARISON", misspelled: "COMPARRISON" },
        { correct: "CONTROLLED", misspelled: "CONTROLED" },
        { correct: "COOPERATE", misspelled: "COOPRATE" },
        { correct: "CRITICISM", misspelled: "CRITICISUM" },
        { correct: "DECEIVE", misspelled: "DECIEVE" },
        { correct: "DESCRIBE", misspelled: "DISCRIBE" },
        { correct: "DISEASE", misspelled: "DIZEASE" },
        { correct: "ECSTASY", misspelled: "ECSTACY" },
        { correct: "EMBARRASS", misspelled: "EMBARASS" },
        { correct: "EQUIPMENT", misspelled: "EQUIPMENTH" },
        { correct: "EXAGGERATE", misspelled: "EXAGGERET" },
        { correct: "EXCEED", misspelled: "EXCEDE" },
        { correct: "EXISTENCE", misspelled: "EXISTANCE" },
        { correct: "EXPERIENCE", misspelled: "EXPERIENCE" },
        { correct: "EXTREME", misspelled: "EXTREEM" },
        { correct: "FAVORITE", misspelled: "FAVOURITE" },
        { correct: "FIERCE", misspelled: "FEIRCE" },
        { correct: "FORFEIT", misspelled: "FORFIET" },
        { correct: "FOURTEEN", misspelled: "FOURTEEN" },
        { correct: "FREEDOM", misspelled: "FREEDUM" },
        { correct: "FULFILL", misspelled: "FULFIL" },
        { correct: "GENERALLY", misspelled: "GENERALY" },
        { correct: "GLAMOROUS", misspelled: "GLAMOURUS" },
        { correct: "GRADUALLY", misspelled: "GRADUALY" },
        { correct: "GRATEFUL", misspelled: "GREATFUL" },
        { correct: "GUARANTEE", misspelled: "GURANTEE" },
        { correct: "HARASS", misspelled: "HARRASS" },
        { correct: "HEIGHT", misspelled: "HIETH" },
        { correct: "HUMOROUS", misspelled: "HUMOROUS" },
        { correct: "IGNORANCE", misspelled: "IGNORANCE" },
        { correct: "IMMEDIATE", misspelled: "IMEDIATE" },
        { correct: "INCIDENTALLY", misspelled: "INCIDENTLY" },
        { correct: "INCREDIBLE", misspelled: "INCREDABLE" },
        { correct: "INFLUENCE", misspelled: "INFLUANCE" },
        { correct: "INITIAL", misspelled: "INISHIAL" },
        { correct: "INTEREST", misspelled: "INTREST" },
        { correct: "INTERFERE", misspelled: "INTERFER" },
        { correct: "JEALOUS", misspelled: "JALOUS" },
        { correct: "JUDGMENT", misspelled: "JUDGEMENT" },
        { correct: "LABORATORY", misspelled: "LABRATORY" },
        { correct: "LEGITIMATE", misspelled: "LEJITIMATE" },
        { correct: "LENGTH", misspelled: "LENTH" },
        { correct: "LIBRARY", lib: "LIBARY" },
        { correct: "LICENSE", misspelled: "LICENCE" },
        { correct: "LIGHTNING", misspelled: "LIGHTING" },
        { correct: "LONELINESS", misspelled: "LONLINESS" },
        { correct: "MAINTENANCE", misspelled: "MAINTENANCE" },
        { correct: "MANEUVER", misspelled: "MANEUVER" },
        { correct: "MARRIAGE", misspelled: "MARRIAGE" },
        { correct: "MATHEMATICS", misspelled: "MATHMATICS" },
        { correct: "MEANWHILE", misspelled: "MEANWHILE" },
        { correct: "MEDICINE", misspelled: "MEDISIN" },
        { correct: "MINIATURE", misspelled: "MINATURE" },
        { correct: "MISCHIEVOUS", misspelled: "MISCHIEVIOUS" },
        { correct: "MR", misspelled: "MR" },
        { correct: "MUTUAL", misspelled: "MUTCHUAL" },
        { correct: "MYSTERIOUS", misspelled: "MYSTERIUS" },
        { correct: "NATURAL", misspelled: "NATRUAL" },
        { correct: "NECESSARY", misspelled: "NECESSARY" },
        { correct: "NEIGHBOR", misspelled: "NIEGHBOR" },
        { correct: "NEITHER", misspelled: "NIETHER" },
        { correct: "NINETEEN", misspelled: "NINETIEN" },
        { correct: "NOTICEABLE", misspelled: "NOTICABLE" },
        { correct: "OCCASION", misspelled: "OCASION" },
        { correct: "OCCURRED", misspelled: "OCCURED" },
        { correct: "OFFICIAL", misspelled: "OFICIAL" },
        { correct: "OMISSION", misspelled: "OMISSION" },
        { correct: "OPTIMISTIC", misspelled: "OPTIMISTIK" },
        { correct: "ORIGINAL", misspelled: "ORGINAL" },
        { correct: "OUTRAGEOUS", misspelled: "OUTRAGIOUS" },
        { correct: "PAID", misspelled: "PAYED" },
        { correct: "PANIC", misspelled: "PANICK" },
        { correct: "PARALLEL", misspelled: "PARALLER" },
        { correct: "PARTICULAR", misspelled: "PARTICULAR" },
        { correct: "PASTIME", misspelled: "PASTTIME" },
        { correct: "PEACE", misspelled: "PEASE" },
        { correct: "PECULIAR", misspelled: "PECULER" },
        { correct: "PERCEIVE", misspelled: "PERCIEVE" },
        { correct: "PERFORM", misspelled: "PERFRM" },
        { correct: "PERHAPS", misspelled: "PERHAPS" },
        { correct: "PERMANENT", misspelled: "PERMANENT" },
        { correct: "PERSONAL", misspelled: "PERSONEL" },
        { correct: "PERSUADE", misspelled: "PERSWADE" },
        { correct: "PHYSICIAN", misspelled: "PHYSISIAN" },
        { correct: "PIECE", misspelled: "PEICE" },
        { correct: "PLAYWRIGHT", misspelled: "PLAYWRIGHT" },
        { correct: "POSSESS", misspelled: "POSSES" },
        { correct: "POSSIBILITY", misspelled: "POSIBILTY" },
        { correct: "PRACTICAL", misspelled: "PRAKTIKAL" },
        { correct: "PRACTICE", misspelled: "PRAKTIS" },
        { correct: "PRECEED", misspelled: "PRECEDE" },
        { correct: "PREFERENCE", misspelled: "PREFERANCE" },
        { correct: "PREFERRED", misspelled: "PREFERED" },
        { correct: "PREJUDICE", misspelled: "PREJUDES" },
        { correct: "PREPARATION", misspelled: "PREPARATON" },
        { correct: "PRIVILEGE", misspelled: "PRIVILAGE" },
        { correct: "PROBABLY", misspelled: "PROBABLY" },
        { correct: "PROCEDURE", misspelled: "PROCEEDURE" },
        { correct: "PROCEED", misspelled: "PROCEED" },
        { correct: "PROFESSOR", misspelled: "PROFESOR" },
        { correct: "PRONUNCIATION", misspelled: "PRONUNCIATION" },
        { correct: "PROPHECY", misspelled: "PROPHESY" },
        { correct: "PSYCHOLOGY", misspelled: "SICHOLOGY" },
        { correct: "PUBLICLY", misspelled: "PUBLICLY" },
        { correct: "QUANTITY", misspelled: "QUANITY" },
        { correct: "QUARREL", misspelled: "QUARREL" },
        { correct: "QUESTION", misspelled: "QUESTON" },
        { correct: "RECEIPT", misspelled: "RECIEPT" },
        { correct: "RECEIVE", misspelled: "RECEIVE" },
        { correct: "RECOGNITION", misspelled: "RECOGNITON" },
        { correct: "RECOMMEND", misspelled: "RECOMMEND" },
        { correct: "REFERENCE", misspelled: "REFERANCE" },
        { correct: "REFERRED", misspelled: "REFERED" },
        { correct: "RELEVANT", misspelled: "RELAVANT" },
        { correct: "RELIGIOUS", misspelled: "RELIGOUS" },
        { correct: "REMEMBRANCE", misspelled: "REMEMBRANCE" },
        { correct: "REPETITION", misspelled: "REPETTION" },
        { correct: "RESPECTIVELY", misspelled: "RESPECTIVLY" },
        { correct: "RHYTHM", misspelled: "RYTHM" },
        { correct: "SCHEDULE", misspelled: "SCHEDULE" },
        { correct: "SCIENCE", misspelled: "SCINECE" },
        { correct: "SECRETARY", misspelled: "SECRETRY" },
        { correct: "SEIZE", misspelled: "SIECE" },
        { correct: "SENSIBLE", misspelled: "SENSABLE" },
        { correct: "SEPARATE", misspelled: "SEPARATE" },
        { correct: "SERGEANT", misspelled: "SARGEANT" },
        { correct: "SEVERAL", misspelled: "SEVRAL" },
        { correct: "SHINING", misspelled: "SHINNING" },
        { correct: "SHOULD", misspelled: "SHOUD" },
        { correct: "SIGNIFICANT", misspelled: "SIGNIFIKANT" },
        { correct: "SIMILAR", misspelled: "SIMILLAR" },
        { correct: "SIMPLE", misspelled: "SIMPEL" },
        { correct: "SINCERE", misspelled: "SINSEER" },
        { correct: "SOVEREIGN", misspelled: "SOVRAN" },
        { correct: "SPECIFIC", misspelled: "SPECIFIK" },
        { correct: "SPECIMEN", misspelled: "SPESIMEN" },
        { correct: "STATIONARY", misspelled: "STATIONERY" },
        { correct: "STATUE", misspelled: "STATUTE" },
        { correct: "STRENGTH", misspelled: "STRENGHT" },
        { correct: "STRENUOUS", misspelled: "STRENUOUS" },
        { correct: "SUBSEQUENT", misspelled: "SUBSQUENT" },
        { correct: "SUBTLE", misspelled: "SUTLE" },
        { correct: "SUCCESS", misspelled: "SUCCES" },
        { correct: "SUCCESSFUL", misspelled: "SUCCESSFUL" },
        { correct: "SUFFICIENT", misspelled: "SUFFICENT" },
        { correct: "SUMMARY", misspelled: "SUMMERY" },
        { correct: "SUPERSEDE", misspelled: "SUPERSEDE" },
        { correct: "SUPRISE", misspelled: "SUPRISE" },
        { correct: "SUSCEPTIBLE", misspelled: "SUSCEPTABLE" },
        { correct: "SYMMETRY", misspelled: "SIMMETRY" },
        { correct: "TECHNIQUE", misspelled: "TEKNIQUE" },
        { correct: "TEMPERAMENT", misspelled: "TEMPERMENT" },
        { correct: "TEMPERATURE", misspelled: "TEMPRATURE" },
        { correct: "THOROUGH", misspelled: "THORROU" },
        { correct: "THRESHOLD", misspelled: "THRESHOLD" },
        { correct: "TOMORROW", misspelled: "TOMORROW" },
        { correct: "TONGUE", misspelled: "TUNG" },
        { correct: "TRAGEDY", misspelled: "TRAGIDY" },
        { correct: "TRANSCEND", misspelled: "TRANSCEND" },
        { correct: "TRANSFER", misspelled: "TRANSFERR" },
        { correct: "TRIUMPH", misspelled: "TRIUMPH" },
        { correct: "TRULY", misspelled: "TRUELY" },
        { correct: "TWELFTH", misspelled: "TWELVETH" },
        { correct: "TYRANNY", misspelled: "TYRANY" },
        { correct: "UNCONSCIOUS", misspelled: "UNCONSCOUS" },
        { correct: "UNDOUBTEDLY", misspelled: "UNDOUBTEDLY" },
        { correct: "UNFORTUNATELY", misspelled: "UNFORTUNATLY" },
        { correct: "UNUSUAL", misspelled: "UNUSAL" },
        { correct: "USEFUL", misspelled: "USEFULL" },
        { correct: "VACUUM", misspelled: "VACUUM" },
        { correct: "VALUABLE", misspelled: "VALUABLE" },
        { correct: "VEGETABLE", misspelled: "VEGITABLE" },
        { correct: "VENGEANCE", misspelled: "VENGENCE" },
        { correct: "VICINITY", misspelled: "VICINITY" },
        { correct: "VILLAIN", misspelled: "VILLIAN" },
        { correct: "VISIBLE", misspelled: "VIZIBLE" },
        { correct: "WARRANT", misspelled: "WARRENT" },
        { correct: "WEIRD", misspelled: "WIERD" },
        { correct: "WELFARE", misspelled: "WELFAIR" },
        { correct: "WHETHER", misspelled: "WEATHER" },
        { correct: "WHOLE", misspelled: "WHOLL" },
        { correct: "WITHHOLD", misspelled: "WITHOLD" },
        { correct: "WITNESS", misspelled: "WITNES" },
        { correct: "WONDERFUL", misspelled: "WONDERFUL" },
        { correct: "WRITING", misspelled: "WRITTING" },
        { correct: "YACHT", misspelled: "YATHT" },
        { correct: "YIELD", misspelled: "YEILD" },
        { correct: "ZOOLOGY", misspelled: "ZOOLOGY" }
    ],

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
            <div id="bnc-hud" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; font-size: 20px; font-weight: bold; background: rgba(0,0,0,0.4);">
                <div id="bnc-lives">LIFE: ❤️❤️❤️</div>
                <div id="bnc-score">SCORE: 0</div>
                <div id="bnc-level">LEVEL: 1</div>
                <div style="display: flex; gap: 10px;">
                    <button id="bnc-pause-btn" style="padding: 8px 16px; background: #f39c12; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Pause</button>
                    <button id="bnc-exit-btn" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Exit</button>
                </div>
            </div>
            <div id="bnc-playfield" style="position: relative; width: 100%; height: calc(100vh - 140px); overflow: hidden;">
                <div style="position: absolute; bottom: 60px; left: 50px; display: flex; align-items: flex-end; gap: 20px;">
                    <div style="font-size: 40px;">🙇‍♂️</div>
                </div>
                <div style="position: absolute; bottom: 50px; left: 0; width: 100%; border-bottom: 4px solid #fff;"></div>
            </div>
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

        // Event Listeners
        document.getElementById('bnc-play-again-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            document.getElementById('break-n-crash-container').style.display = 'block';
            this.startGame();
        });

        document.getElementById('bnc-go-exit-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
        });

        document.getElementById('bnc-exit-btn').addEventListener('click', () => this.endGameManually());
        document.getElementById('bnc-pause-btn').addEventListener('click', () => this.togglePause());
    },

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
                        <br><br>• Letting a misspelled word hit the bottom costs <strong>1 life</strong> (3 lives total).
                        <br><br>• Speed scales intensely, and after Level 5, multiple words rain down simultaneously to create real chaos!
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
        this.isPaused = false;
        document.getElementById('bnc-pause-btn').textContent = 'Pause';
        
        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'none';

        const pauseOverlay = document.getElementById('bnc-pause-overlay');
        if (pauseOverlay) pauseOverlay.remove();
        
        this.refillWordPool();
        this.updateHUD();

        const playfield = document.getElementById('bnc-playfield');
        playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());

        // Spawner loop
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.spawnInterval = setInterval(() => {
            if (this.isGameRunning && !this.isPaused) {
                this.spawnBatchOfWords();
            }
        }, 1400);

        // Main game ticker loop
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => {
            if (this.isGameRunning && !this.isPaused) this.updateGameLoop();
        }, 30);
    },

    refillWordPool() {
        // Shuffle the massive pool thoroughly so words never repeat early
        this.availableWords = [...this.masterWordPool].sort(() => Math.random() - 0.5);
    },

    spawnBatchOfWords() {
        // Level 1-5: 1 word at a time
        // Level 6-7: +3 extra = 4 words
        // Level 8-9: +3 more = 7 words, and so on every 2 levels after Level 5.
        let spawnCount = 1;
        if (this.level >= 6) {
            let extraTiers = Math.floor((this.level - 6) / 2) + 1;
            spawnCount = 1 + (extraTiers * 3);
        }

        for (let i = 0; i < spawnCount; i++) {
            this.spawnSingleWord();
        }
    },

    spawnSingleWord() {
        const playfield = document.getElementById('bnc-playfield');
        
        if (this.availableWords.length === 0) {
            this.refillWordPool();
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
            if (!this.isGameRunning || this.isPaused) return;

            if (isMisspelled) {
                this.score += 10;
                this.createBlastEffect(node);
                node.remove();
                this.activeWords = this.activeWords.filter(w => w.element !== node);
                this.level = Math.floor(this.score / 200) + 1;
                this.updateHUD();
            } else {
                node.style.transform = 'scale(0.95)';
                setTimeout(() => node.style.transform = 'scale(1)', 100);
            }
        });

        playfield.appendChild(node);
        
        this.activeWords.push({
            element: node,
            y: 0,
            // Drastically increased base speed and level scaling factor for high-speed action
            speed: (4.5 + (this.level - 1) * 1.25),
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

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('bnc-pause-btn');
        const playfield = document.getElementById('bnc-playfield');

        if (this.isPaused) {
            pauseBtn.textContent = 'Resume';
            pauseBtn.style.background = '#27ae60';
            
            this.activeWords.forEach(w => w.element.style.visibility = 'hidden');

            let pauseOverlay = document.getElementById('bnc-pause-overlay');
            if (!pauseOverlay) {
                pauseOverlay = document.createElement('div');
                pauseOverlay.id = 'bnc-pause-overlay';
                pauseOverlay.style.cssText = `
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); display: flex; 
                    flex-direction: column; align-items: center; justify-content: center; 
                    font-size: 36px; font-weight: bold; color: #fff; z-index: 100; gap: 10px;
                `;
                pauseOverlay.innerHTML = `<div>GAME PAUSED</div><div style="font-size: 16px; font-weight: normal; color: #aaa;">Words are hidden to prevent peeking!</div>`;
                playfield.appendChild(pauseOverlay);
            } else {
                pauseOverlay.style.display = 'flex';
            }
        } else {
            pauseBtn.textContent = 'Pause';
            pauseBtn.style.background = '#f39c12';
            
            this.activeWords.forEach(w => w.element.style.visibility = 'visible');

            const pauseOverlay = document.getElementById('bnc-pause-overlay');
            if (pauseOverlay) pauseOverlay.style.display = 'none';
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

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'block';

        const playfield = document.getElementById('bnc-playfield');
        if (playfield) {
            playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());
            const pauseOverlay = document.getElementById('bnc-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
        }

        document.getElementById('break-n-crash-container').style.display = 'none';
        document.getElementById('bnc-final-score').textContent = this.score;
        document.getElementById('bnc-game-over-modal').style.display = 'flex';
    },

    endGameManually() {
        this.isGameRunning = false;
        clearInterval(this.gameInterval);
        clearInterval(this.spawnInterval);

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'block';

        const playfield = document.getElementById('bnc-playfield');
        if (playfield) {
            playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());
            const pauseOverlay = document.getElementById('bnc-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
        }

        document.getElementById('break-n-crash-container').style.display = 'none';
    }
};
