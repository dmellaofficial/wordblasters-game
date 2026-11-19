// ==========================================
// BREAK N' CRASH - Mini Game Module
// ==========================================

const BreakNCrashGame = {
    score: 0,
    lives: 3,
    level: 1,
    animationFrameId: null,
    spawnInterval: null,
    activeWords: [],
    isGameRunning: false,
    isPaused: false,
    availableWords: [],
    heartSpawnedThisMilestone: false,
    lastTime: 0,

    // Massive 100+ master dictionary pair pool to prevent repetition
    masterWordPool: [
        { correct: "COMPLETION", misspelled: "COMPLETSHON" },
        { correct: "CONGRATULATIONS", misspelled: "CONGRADULATION" },
        { correct: "COMMITTEE", misspelled: "COMMIITEE" },
        { correct: "EXPRESSION", misspelled: "EXPRESHUN" },
        { correct: "INTERNATIONAL", misspelled: "INTERNATIONEL" },
        { correct: "DICTIONARY", misspelled: "DICTIOUNARY" },
        { correct: "NECESSARY", misspelled: "NECCEESARY" },
        { correct: "DEFINITELY", misspelled: "DEFINATELY" },
        { correct: "ACCOMMODATE", misspelled: "ACOMMOODATE" },
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
        { correct: "MAINTENANCE", misspelled: "MAINTEINANCE" },
        { correct: "MILLENNIUM", misspelled: "MILENNIUM" },
        { correct: "OCCURRED", misspelled: "OCCURED" },
        { correct: "PARLIAMENT", misspelled: "PARLLIAMENT" },
        { correct: "POSSESSION", misspelled: "POSSEESSION" },
        { correct: "PRONUNCIATION", misspelled: "PRONANCIATION" },
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
        { correct: "BARGAIN", misspelled: "BARGAINE" },
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
        { correct: "EXTREME", misspelled: "EXTREEM" },
        { correct: "FAVORITE", misspelled: "FAVORIATE" },
        { correct: "FIERCE", misspelled: "FEIRCE" },
        { correct: "FORFEIT", misspelled: "FORFIET" },
        { correct: "FOURTEEN", misspelled: "FOURTHEEN" },
        { correct: "FREEDOM", misspelled: "FREEDUM" },
        { correct: "FULFILL", misspelled: "FULFIL" },
        { correct: "GENERALLY", misspelled: "GENERALY" },
        { correct: "GLAMOROUS", misspelled: "GLANOURUS" },
        { correct: "GRADUALLY", misspelled: "GRADUALY" },
        { correct: "GRATEFUL", misspelled: "GREATEFUL" },
        { correct: "GUARANTEE", misspelled: "GURANTEE" },
        { correct: "HARASS", misspelled: "HARRASS" },
        { correct: "HEIGHT", misspelled: "HIETH" },
        { correct: "HUMOROUS", misspelled: "HUMORROUS" },
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
        { correct: "LIBRARY", misspelled: "LIBARY" },
        { correct: "LICENSE", misspelled: "LICENCE" },
        { correct: "LIGHTNING", misspelled: "LIGHTING" },
        { correct: "LONELINESS", misspelled: "LONLINESS" },
        { correct: "MAINTENANCE", misspelled: "MAINTEINANCE" },
        { correct: "MANEUVER", misspelled: "MANEUVER" },
        { correct: "MARRIAGE", misspelled: "MERRIEGE" },
        { correct: "MATHEMATICS", misspelled: "MATHMATICS" },
        { correct: "MEANWHILE", misspelled: "MEINWHILE" },
        { correct: "MEDICINE", misspelled: "MEDISIN" },
        { correct: "MINIATURE", misspelled: "MINATURE" },
        { correct: "MISCHIEVOUS", misspelled: "MISCHIEVIOUS" },
        { correct: "MEMORANDUM", misspelled: "MEMORANDAM" },
        { correct: "MUTUAL", misspelled: "MUTCHUAL" },
        { correct: "MYSTERIOUS", misspelled: "MYSTERIUS" },
        { correct: "NATURAL", misspelled: "NATRUAL" },
        { correct: "NECESSARY", misspelled: "NECESSARY" },
        { correct: "NEIGHBOR", misspelled: "NIEHBOR" },
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
        { correct: "PERHAPS", misspelled: "PERSHAPS" },
        { correct: "PERMANENT", misspelled: "PERNANENT" },
        { correct: "PERSONAL", misspelled: "PERSONEL" },
        { correct: "PERSUADE", misspelled: "PERSWADE" },
        { correct: "PHYSICIAN", misspelled: "PHYSISIAN" },
        { correct: "PIECE", misspelled: "PEICE" },
        { correct: "PLAYWRIGHT", misspelled: "PLAYRIGHT" },
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
        { correct: "PROBABLY", misspelled: "PROBABBLY" },
        { correct: "PROCEDURE", misspelled: "PROCEEDURE" },
        { correct: "PROCEED", misspelled: "PROCCEED" },
        { correct: "PROFESSOR", misspelled: "PROFFESOR" },
        { correct: "PRONUNCIATION", misspelled: "PRONANCIATION" },
        { correct: "PROPHECY", misspelled: "PROPHESY" },
        { correct: "PSYCHOLOGY", misspelled: "PSICHOLOGY" },
        { correct: "PUBLICLY", misspelled: "PUBLICLLY" },
        { correct: "QUANTITY", misspelled: "QUANITY" },
        { correct: "QUARREL", misspelled: "QUAREEL" },
        { correct: "QUESTION", misspelled: "QUESTONI" },
        { correct: "RECEIPT", misspelled: "RECIEPT" },
        { correct: "RECOGNITION", misspelled: "RECOGNITON" },
        { correct: "RECOMMEND", misspelled: "RECOMENND" },
        { correct: "REFERENCE", misspelled: "REFERANCE" },
        { correct: "REFERRED", misspelled: "REFERED" },
        { correct: "RELEVANT", misspelled: "RELAVANT" },
        { correct: "RELIGIOUS", misspelled: "RELIGOUS" },
        { correct: "REMEMBRANCE", misspelled: "REMEMMBRANCE" },
        { correct: "REPETITION", misspelled: "REPETTION" },
        { correct: "RESPECTIVELY", misspelled: "RESPECTIVLY" },
        { correct: "RHYTHM", misspelled: "RYTHMH" },
        { correct: "SCIENCE", misspelled: "SCINECE" },
        { correct: "SECRETARY", misspelled: "SECRETRY" },
        { correct: "SEIZE", misspelled: "SIECE" },
        { correct: "SENSIBLE", misspelled: "SENSIIBLE" },
        { correct: "SERGEANT", misspelled: "SARGEANT" },
        { correct: "SEVERAL", misspelled: "SEVRAL" },
        { correct: "SHINING", misspelled: "SHINNING" },
        { correct: "SHOULD", misspelled: "SHLOUD" },
        { correct: "SIGNIFICANT", misspelled: "SIGNIFIKANT" },
        { correct: "SIMILAR", misspelled: "SIMILLAR" },
        { correct: "SIMPLE", misspelled: "SIMPEL" },
        { correct: "SINCERE", misspelled: "SINSEER" },
        { correct: "SOVEREIGN", misspelled: "SOVRAN" },
        { correct: "SPECIFIC", misspelled: "SPECIFIK" },
        { correct: "SPECIMEN", misspelled: "SPESIMEN" },
        { correct: "STATIONARY", misspelled: "STATIONNERY" },
        { correct: "STATUE", misspelled: "STATTUTE" },
        { correct: "STRENGTH", misspelled: "STRENGHT" },
        { correct: "STRENUOUS", misspelled: "STREANUOUS" },
        { correct: "SUBSEQUENT", misspelled: "SUBSQUENT" },
        { correct: "SUBTLE", misspelled: "SUTLE" },
        { correct: "SUCCESS", misspelled: "SUCCEES" },
        { correct: "SUFFICIENT", misspelled: "SUFFICENT" },
        { correct: "SUMMARY", misspelled: "SUMMERY" },
        { correct: "SUPERSEDE", misspelled: "SUPERCEDE" },
        { correct: "SURPRISE", misspelled: "SUPRISE" },
        { correct: "SUSCEPTIBLE", misspelled: "SUSCEPTABLE" },
        { correct: "SYMMETRY", misspelled: "SIMMETRY" },
        { correct: "TECHNIQUE", misspelled: "TEKNIQUE" },
        { correct: "TEMPERAMENT", misspelled: "TEMPERMENT" },
        { correct: "THOROUGH", misspelled: "THORROU" },
        { correct: "THRESHOLD", misspelled: "THRESHHOLD" },
        { correct: "TOMORROW", misspelled: "TOMMORROW" },
        { correct: "TONGUE", misspelled: "TUNG" },
        { correct: "TRAGEDY", misspelled: "TRAGIDY" },
        { correct: "TRANSCEND", misspelled: "TRUNSCEND" },
        { correct: "TRANSFER", misspelled: "TRANSFERR" },
        { correct: "TRIUMPH", misspelled: "TRIUMIPH" },
        { correct: "TRULY", misspelled: "TRUULY" },
        { correct: "TWELFTH", misspelled: "TWELVETH" },
        { correct: "TYRANNY", misspelled: "TYRANY" },
        { correct: "UNCONSCIOUS", misspelled: "UNCONSCOUS" },
        { correct: "UNDOUBTEDLY", misspelled: "UNDOUBETEDLY" },
        { correct: "UNFORTUNATELY", misspelled: "UNFORTUNATLY" },
        { correct: "UNUSUAL", misspelled: "UNUSAL" },
        { correct: "USEFUL", misspelled: "USEFULL" },
        { correct: "VALUABLE", misspelled: "VALUAEBLE" },
        { correct: "VEGETABLE", misspelled: "VEGITABLE" },
        { correct: "VENGEANCE", misspelled: "VENGENCE" },
        { correct: "VICINITY", misspelled: "VINICITY" },
        { correct: "VILLAIN", misspelled: "VILIIAN" },
        { correct: "VISIBLE", misspelled: "VIZIBLE" },
        { correct: "WARRANT", misspelled: "WARRENT" },
        { correct: "WEIRD", misspelled: "WIIRD" },
        { correct: "WELFARE", misspelled: "WELFARR" },
        { correct: "WHETHER", misspelled: "WIETHER" },
        { correct: "WHOLE", misspelled: "WHOLL" },
        { correct: "WITHHOLD", misspelled: "WITHOLD" },
        { correct: "WITNESS", misspelled: "WITNES" },
        { correct: "WRITING", misspelled: "WRITTING" },
        { correct: "YACHT", misspelled: "YATHT" },
        { correct: "YIELD", misspelled: "YEILD" },
        { correct: "ZOOLOGY", misspelled: "ZOOLOOGY" }
    ],

    // 50% extra tap sensitivity margin around word pills
    tapSensitivityMultiplier: 1.5,

    isMobile() {
        return window.innerWidth <= 650;
    },

    lockZoom() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    },

    unlockZoom() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
    },

    init() {
        if (document.getElementById('break-n-crash-container')) return;

        const mobile = this.isMobile();
        const gameContainer = document.createElement('div');
        gameContainer.id = 'break-n-crash-container';
        gameContainer.style.cssText = `
            display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #000000; z-index: 9999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #fff; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
            touch-action: none; overflow: hidden;
        `;

        const hudPadding = mobile ? '12px 14px' : '20px 40px';
        const hudFontSize = mobile ? '16px' : '22px';
        const btnPadding = mobile ? '8px 12px' : '10px 18px';
        const btnFontSize = mobile ? '14px' : '16px';

        gameContainer.innerHTML = `
            <div id="bnc-hud" style="display: flex; justify-content: space-between; align-items: center; padding: ${hudPadding}; font-size: ${hudFontSize}; font-weight: 800; background: #0a0a0a; border-bottom: 1px solid #222; gap: 6px; flex-wrap: nowrap;">
                <div id="bnc-lives" style="white-space: nowrap;">❤️❤️❤️</div>
                <div id="bnc-score" style="white-space: nowrap;">SCORE: 0</div>
                <div id="bnc-level" style="white-space: nowrap;">LVL: 1</div>
                <div style="display: flex; gap: 6px;">
                    <button id="bnc-pause-btn" style="padding: ${btnPadding}; font-size: ${btnFontSize}; background: #f39c12; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; touch-action: none;">Pause</button>
                    <button id="bnc-exit-btn" style="padding: ${btnPadding}; font-size: ${btnFontSize}; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; touch-action: none;">Exit</button>
                </div>
            </div>
            <div id="bnc-playfield" style="position: relative; width: 100%; height: calc(100vh - ${mobile ? '65px' : '90px'}); overflow: hidden; background: #000000; touch-action: none;">
                <div style="position: absolute; bottom: ${mobile ? '38px' : '60px'}; left: ${mobile ? '20px' : '50px'}; display: flex; align-items: flex-end; gap: 20px; pointer-events: none;">
                    <div style="font-size: ${mobile ? '36px' : '44px'};">🙇‍♂️</div>
                </div>
                <div style="position: absolute; bottom: ${mobile ? '30px' : '50px'}; left: 0; width: 100%; border-bottom: 4px solid #fff; pointer-events: none;"></div>
            </div>
        `;
        document.body.appendChild(gameContainer);

        // 50% expanded touch proximity assistance on the playfield so near-edge taps still hit misspelled words or hearts
        const playfield = document.getElementById('bnc-playfield');
        const handlePlayfieldAssist = (e) => {
            if (!this.isGameRunning || this.isPaused) return;
            const point = e.touches && e.touches[0] ? e.touches[0] : e;
            if (!point || typeof point.clientX !== 'number' || typeof point.clientY !== 'number') return;

            for (let i = 0; i < this.activeWords.length; i++) {
                const w = this.activeWords[i];
                if (!w.isMisspelled && !w.isHeart) continue;
                const rect = w.element.getBoundingClientRect();
                const padX = rect.width * 0.25;  // +50% total horizontal reach (25% each side)
                const padY = rect.height * 0.25; // +50% total vertical reach (25% top/bottom)

                if (
                    point.clientX >= rect.left - padX &&
                    point.clientX <= rect.right + padX &&
                    point.clientY >= rect.top - padY &&
                    point.clientY <= rect.bottom + padY
                ) {
                    if (e.cancelable) e.preventDefault();
                    e.stopPropagation();
                    w.onTap(w.element);
                    break;
                }
            }
        };
        playfield.addEventListener('touchstart', handlePlayfieldAssist, { passive: false });
        playfield.addEventListener('pointerdown', handlePlayfieldAssist);

        const gameOverModal = document.createElement('div');
        gameOverModal.id = 'bnc-game-over-modal';
        gameOverModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.8); z-index: 10001; display: none;
            align-items: center; justify-content: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            user-select: none; -webkit-user-select: none; touch-action: none;
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

        document.getElementById('bnc-play-again-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            document.getElementById('break-n-crash-container').style.display = 'block';
            this.lockZoom();
            this.startGame();
        });

        document.getElementById('bnc-go-exit-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            this.unlockZoom();
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
                user-select: none; -webkit-user-select: none; touch-action: none;
            `;
            modal.innerHTML = `
                <div style="background: #fff; color: #333; padding: 30px; border-radius: 12px; width: 450px; max-width: 90%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                    <h2 style="margin-top: 0; color: #2c3e50;">Break N' Crash</h2>
                    <p style="font-size: 14px; line-height: 1.5; color: #555; text-align: left;">
                        Words rain down smoothly with staggered timing in the middle and right lanes. Tap the <strong>misspelled words</strong> once to blast them! 
                        <br><br>• Regular word blasted: <strong>+10 points</strong>
                        <br><br>• Long word (11+ letters) blasted: <strong>+30 points</strong> (accelerates level progression!)
                        <br><br>• From <strong>Level 5 onwards</strong>, multiple words rain down in separated lanes with staggered intervals so they never align or stack!
                        <br><br>• Every 5th level, a single <strong>Bonus Heart</strong> drops to restore life or award +100 points!
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
                this.lockZoom();
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
        this.heartSpawnedThisMilestone = false;
        document.getElementById('bnc-pause-btn').textContent = 'Pause';
        
        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'none';

        const pauseOverlay = document.getElementById('bnc-pause-overlay');
        if (pauseOverlay) pauseOverlay.remove();
        
        this.refillWordPool();
        this.updateHUD();

        const playfield = document.getElementById('bnc-playfield');
        playfield.querySelectorAll('.bnc-word-node').forEach(el => el.remove());

        if (this.spawnInterval) clearInterval(this.spawnInterval);
        this.spawnInterval = setInterval(() => {
            if (this.isGameRunning && !this.isPaused) {
                this.spawnGameBatch();
            }
        }, 1450);

        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.lastTime = performance.now();
        this.animationFrameLoop(this.lastTime);
    },

    refillWordPool() {
        this.availableWords = [...this.masterWordPool].sort(() => Math.random() - 0.2);
    },

    getRightHalfBounds(playfieldWidth, itemWidth = 220) {
        const mobile = this.isMobile();
        const minX = Math.floor(playfieldWidth * (mobile ? 0.36 : 0.42));
        const rightMargin = mobile ? 10 : 20;
        const maxX = Math.max(minX, playfieldWidth - itemWidth - rightMargin);
        return { minX, maxX };
    },

    spawnGameBatch() {
        const playfield = document.getElementById('bnc-playfield');
        const playfieldWidth = playfield ? playfield.clientWidth : window.innerWidth;
        const mobile = this.isMobile();

        if (this.level % 5 === 0 && !this.heartSpawnedThisMilestone) {
            this.heartSpawnedThisMilestone = true;
            this.spawnHeartItem(playfieldWidth);
            return;
        } else if (this.level % 5 !== 0) {
            this.heartSpawnedThisMilestone = false;
        }

        let spawnCount = 3;
        if (this.level >= 5) {
            spawnCount = (this.level >= 10) ? 3 : 2;
        }

        const { minX, maxX } = this.getRightHalfBounds(playfieldWidth, mobile ? 170 : 230);
        const zoneWidth = Math.max(80, maxX - minX);
        const laneCount = mobile ? Math.min(spawnCount, 2) : Math.max(2, Math.min(spawnCount, Math.floor(zoneWidth / 170)));

        let availableLanes = [];
        for (let i = 0; i < laneCount; i++) {
            availableLanes.push(i);
        }
        availableLanes.sort(() => Math.random() - 0.5);

        const staggerDelays = [0, 100, 200];

        for (let i = 0; i < spawnCount; i++) {
            const delay = staggerDelays[i] !== undefined ? staggerDelays[i] : i * 100;
            const lane = availableLanes[i % availableLanes.length];

            setTimeout(() => {
                if (!this.isGameRunning || this.isPaused) return;
                this.spawnSingleWord(lane, laneCount, playfieldWidth);
            }, delay);
        }
    },

    bindInstantTap(node, callback) {
        let triggered = false;
        const handleTap = (e) => {
            if (e && e.cancelable) e.preventDefault();
            if (e && e.stopPropagation) e.stopPropagation();
            if (triggered || !this.isGameRunning || this.isPaused) return;
            triggered = true;
            callback(node);
            setTimeout(() => { triggered = false; }, 120);
        };

        node.addEventListener('touchstart', handleTap, { passive: false });
        node.addEventListener('pointerdown', handleTap);
        return handleTap;
    },

    spawnHeartItem(playfieldWidth) {
        const playfield = document.getElementById('bnc-playfield');
        const mobile = this.isMobile();
        const node = document.createElement('div');
        node.className = 'bnc-word-node';
        node.textContent = '❤️ BONUS HEART';

        const estWidth = mobile ? 185 : 230;
        const { minX, maxX } = this.getRightHalfBounds(playfieldWidth, estWidth);
        const randomX = Math.floor(minX + Math.random() * Math.max(1, maxX - minX));

        node.style.cssText = `
            position: absolute; top: 0px; left: ${randomX}px;
            background: #e74c3c; color: #fff;
            padding: ${mobile ? '20px 26px' : '22px 32px'};
            border-radius: 35px; font-weight: 900;
            font-size: ${mobile ? '20px' : '24px'};
            box-shadow: 0 6px 15px rgba(231,76,60,0.5); cursor: pointer;
            z-index: 10; touch-action: none; -webkit-tap-highlight-color: transparent;
            user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
            white-space: nowrap;
        `;

        const onTapAction = (el) => {
            if (this.lives < 3) {
                this.lives++;
                this.createHeartEffect(el, '+1 LIFE ❤️', '#2ecc71');
            } else {
                this.score += 100;
                this.createHeartEffect(el, '+100 PTS 🌟', '#f1c40f');
            }
            el.remove();
            this.activeWords = this.activeWords.filter(w => w.element !== el);
            this.updateHUD();
        };

        const tapFn = this.bindInstantTap(node, onTapAction);

        playfield.appendChild(node);

        this.activeWords.push({
            element: node,
            y: 0,
            speed: 2.2,
            isHeart: true,
            onTap: () => tapFn(null)
        });
    },

    spawnSingleWord(laneIndex, totalLanes, playfieldWidth) {
        const playfield = document.getElementById('bnc-playfield');
        const mobile = this.isMobile();
        
        if (this.availableWords.length === 0) {
            this.refillWordPool();
        }

        const item = this.availableWords.pop();
        const isMisspelled = Math.random() > 0.4; 
        const wordText = isMisspelled ? item.misspelled : item.correct;
        const isLongWord = wordText.length >= 11;

        const node = document.createElement('div');
        node.className = 'bnc-word-node';
        node.textContent = wordText;

        const fontSize = mobile ? (wordText.length >= 12 ? 19 : 22) : 26;
        // ~50% boost to touch target padding for effortless mobile tapping
        const padV = mobile ? 22 : 24;
        const padH = mobile ? 26 : 36;

        node.style.cssText = `
            position: absolute; top: 0px; left: 0px;
            background: #fff; color: #1e293b;
            padding: ${padV}px ${padH}px;
            border-radius: 32px; font-weight: 800;
            font-size: ${fontSize}px;
            letter-spacing: 0.5px;
            box-shadow: 0 6px 14px rgba(0,0,0,0.3); cursor: pointer;
            touch-action: none; -webkit-tap-highlight-color: transparent;
            user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
            white-space: nowrap; will-change: top;
        `;

        playfield.appendChild(node);

        const actualWidth = node.offsetWidth || 180;
        const rightMargin = mobile ? 10 : 20;
        const zoneStartX = Math.floor(playfieldWidth * (mobile ? 0.36 : 0.42));
        const zoneEndX = Math.max(zoneStartX + 40, playfieldWidth - rightMargin);
        const usableZoneWidth = Math.max(40, zoneEndX - zoneStartX);
        const laneWidth = usableZoneWidth / Math.max(1, totalLanes);

        const laneMinX = zoneStartX + (laneIndex * laneWidth);
        const laneMaxX = Math.max(laneMinX, laneMinX + laneWidth - actualWidth);
        let finalX = Math.floor(laneMinX + Math.random() * Math.max(1, laneMaxX - laneMinX));

        finalX = Math.max(zoneStartX, Math.min(finalX, playfieldWidth - actualWidth - rightMargin));
        node.style.left = finalX + 'px';

        const onTapAction = (el) => {
            if (isMisspelled) {
                const ptsEarned = isLongWord ? 30 : 10;
                this.score += ptsEarned;
                this.createBlastEffect(el, `💥 +${ptsEarned}`);
                el.remove();
                this.activeWords = this.activeWords.filter(w => w.element !== el);
                this.level = Math.floor(this.score / 200) + 1;
                this.updateHUD();
            } else {
                el.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (el) el.style.transform = 'scale(1)';
                }, 100);
            }
        };

        const tapFn = this.bindInstantTap(node, onTapAction);
        
        this.activeWords.push({
            element: node,
            y: 0,
            speed: (2.4 + (this.level - 1) * 0.9),
            isMisspelled: isMisspelled,
            isHeart: false,
            onTap: () => tapFn(null)
        });
    },

    animationFrameLoop(timestamp) {
        if (!this.isGameRunning) return;

        if (!this.isPaused) {
            const playfield = document.getElementById('bnc-playfield');
            const floorOffset = this.isMobile() ? 55 : 80;
            const floorLimit = playfield ? playfield.clientHeight - floorOffset : 500;

            for (let i = this.activeWords.length - 1; i >= 0; i--) {
                let obj = this.activeWords[i];
                obj.y += obj.speed;
                obj.element.style.top = obj.y + 'px';

                if (obj.y >= floorLimit) {
                    if (obj.isMisspelled && !obj.isHeart) {
                        this.loseLife();
                    }
                    obj.element.remove();
                    this.activeWords.splice(i, 1);
                    this.updateHUD();
                }
            }

            if (this.lives <= 0) {
                this.triggerGameOver();
                return;
            }
        }

        this.animationFrameId = requestAnimationFrame((ts) => this.animationFrameLoop(ts));
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
                    background: rgba(0,0,0,0.9); backdrop-filter: blur(6px); display: flex; 
                    flex-direction: column; align-items: center; justify-content: center; 
                    font-size: 36px; font-weight: bold; color: #fff; z-index: 100; gap: 10px;
                    text-align: center; padding: 20px;
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

    createBlastEffect(node, textMsg) {
        const rect = node.getBoundingClientRect();
        const spark = document.createElement('div');
        spark.textContent = textMsg;
        spark.style.cssText = `
            position: fixed; top: ${rect.top}px; left: ${rect.left}px;
            color: #f1c40f; font-weight: bold; font-size: 24px; z-index: 10001;
            pointer-events: none; transition: transform 0.5s, opacity 0.5s;
        `;
        document.body.appendChild(spark);
        setTimeout(() => {
            spark.style.transform = 'translateY(-30px) scale(1.3)';
            spark.style.opacity = '0';
        }, 20);
        setTimeout(() => spark.remove(), 500);
    },

    createHeartEffect(node, textMsg, colorHex) {
        const rect = node.getBoundingClientRect();
        const spark = document.createElement('div');
        spark.textContent = textMsg;
        spark.style.cssText = `
            position: fixed; top: ${rect.top}px; left: ${rect.left}px;
            color: ${colorHex}; font-weight: bold; font-size: 26px; z-index: 10001;
            pointer-events: none; transition: transform 0.6s, opacity 0.6s;
        `;
        document.body.appendChild(spark);
        setTimeout(() => {
            spark.style.transform = 'translateY(-40px) scale(1.4)';
            spark.style.opacity = '0';
        }, 20);
        setTimeout(() => spark.remove(), 600);
    },

    updateHUD() {
        const mobile = this.isMobile();
        const hearts = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
        document.getElementById('bnc-lives').textContent = mobile ? hearts : `LIFE: ${hearts}`;
        document.getElementById('bnc-score').textContent = `SCORE: ${this.score}`;
        document.getElementById('bnc-level').textContent = mobile ? `LVL: ${this.level}` : `LEVEL: ${this.level}`;
    },

    triggerGameOver() {
        this.isGameRunning = false;
        this.unlockZoom();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
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
        this.unlockZoom();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
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
