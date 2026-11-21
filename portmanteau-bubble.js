// ==========================================
// PORTMANTEAU BUBBLE BLAST UNIVERSITY
// ==========================================

const PortmanteauGame = {
    score: 0,
    level: 1,
    bubbles: [],
    selectedBubble: null,
    animationFrameId: null,
    spawnTimer: 0,
    isGameRunning: false,
    isPaused: false,
    lastTime: 0,
    dangerLineY: 86,
    dangerGraceFrames: 0,

    // Stage 1: Small + Small -> Big Bubble (+10 pts)
    smallRecipes: [
        { a: "white", b: "board", result: "whiteboard", color: "#3b82f6" },
        { a: "ball", b: "pen", result: "ballpen", color: "#6366f1" },
        { a: "wind", b: "water", result: "ice", color: "#06b6d4" },
        { a: "paper", b: "napkin", result: "paper napkin", color: "#f59e0b" },
        { a: "toilet", b: "paper", result: "toilet paper", color: "#10b981" },
        { a: "earth", b: "water", result: "mud", color: "#92400e" },
        { a: "earth", b: "fire", result: "lava", color: "#ef4444" },
        { a: "note", b: "book", result: "notebook", color: "#8b5cf6" },
        { a: "lock", b: "key", result: "padlock", color: "#64748b" },
        { a: "ink", b: "pad", result: "inkpad", color: "#ec4899" },
        { a: "air", b: "port", result: "airport", color: "#0ea5e9" },
        { a: "school", b: "bag", result: "schoolbag", color: "#14b8a6" },
        { a: "fire", b: "wood", result: "bonfire", color: "#f97316" },
        { a: "rain", b: "bow", result: "rainbow", color: "#a855f7" },
        { a: "sun", b: "flower", result: "sunflower", color: "#eab308" },
        { a: "book", b: "shelf", result: "bookshelf", color: "#0d9488" },
        { a: "back", b: "pack", result: "backpack", color: "#2563eb" },
        { a: "class", b: "room", result: "classroom", color: "#16a34a" },
        { a: "snow", b: "ball", result: "snowball", color: "#0284c7" },
        { a: "chalk", b: "board", result: "chalkboard", color: "#475569" }
    ],

    // Stage 2: Big Bubble + Small Bubble -> Eliminate! (+20 pts)
    bigEliminations: {
        "whiteboard": ["school", "classroom", "pen", "chalk"],
        "ballpen": ["paper", "notebook", "ink", "school", "pad"],
        "ice": ["fire", "sun", "air"],
        "paper napkin": ["tissue", "water", "pad"],
        "toilet paper": ["tissue", "water", "napkin"],
        "mud": ["water", "rain", "tissue", "napkin"],
        "lava": ["water", "ice", "earth", "air"],
        "notebook": ["pen", "school", "bag", "ink", "classroom"],
        "padlock": ["lock", "school", "bag", "key"],
        "inkpad": ["ink", "paper", "pen", "note"],
        "airport": ["air", "bag", "backpack"],
        "schoolbag": ["school", "book", "notebook", "pen", "classroom"],
        "bonfire": ["water", "wind", "air", "earth"],
        "rainbow": ["sun", "rain", "air"],
        "sunflower": ["earth", "water", "sun"],
        "bookshelf": ["book", "school", "classroom", "library"],
        "backpack": ["school", "book", "notebook", "bag"],
        "classroom": ["school", "board", "whiteboard", "book", "chalk"],
        "snowball": ["fire", "sun", "water"],
        "chalkboard": ["school", "classroom", "chalk", "board"]
    },

    // Stage 3 (Bonus): Big Bubble + Big Bubble -> Double Blast! (+50 pts)
    bigComboPairs: [
        ["whiteboard", "classroom"],
        ["whiteboard", "chalkboard"],
        ["ballpen", "notebook"],
        ["ice", "lava"],
        ["mud", "lava"],
        ["paper napkin", "toilet paper"],
        ["schoolbag", "backpack"],
        ["schoolbag", "notebook"],
        ["backpack", "notebook"],
        ["bookshelf", "classroom"],
        ["bonfire", "snowball"],
        ["rainbow", "sunflower"],
        ["airport", "backpack"]
    ],

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
        if (document.getElementById('portmanteau-container')) return;

        const mobile = this.isMobile();
        const dangerTop = mobile ? 68 : 86;
        const floorBottom = mobile ? 70 : 32;
        const floorHeight = mobile ? 14 : 16;

        const container = document.createElement('div');
        container.id = 'portmanteau-container';
        container.style.cssText = `
            display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;
            background: #f8fafc; z-index: 9999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
            touch-action: none; overflow: hidden;
        `;

        const hudPadding = mobile ? '12px 14px 12px 66px' : '18px 36px 18px 76px';
        const hudFontSize = mobile ? '15px' : '22px';
        const btnPadding = mobile ? '8px 12px' : '10px 18px';
        const btnFontSize = mobile ? '14px' : '16px';

        container.innerHTML = `
            <div id="pbb-hud" style="display: flex; justify-content: space-between; align-items: center; padding: ${hudPadding}; font-size: ${hudFontSize}; font-weight: 800; background: #ffffff; border-bottom: 2px solid #e2e8f0; gap: 8px;">
                <div id="pbb-score" style="white-space: nowrap; color: #0f172a;">SCORE: 0</div>
                <div id="pbb-selected-hint" style="font-size: ${mobile ? '12px' : '15px'}; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 4px 12px; border-radius: 999px; border: 1px solid #bfdbfe; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: ${mobile ? '130px' : '260px'};">
                    Tap settled bubbles
                </div>
                <div id="pbb-level" style="white-space: nowrap; color: #0f172a;">LEVEL: 1</div>
                <div style="display: flex; gap: 6px;">
                    <button id="pbb-pause-btn" style="padding: ${btnPadding}; font-size: ${btnFontSize}; background: #f39c12; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; touch-action: manipulation;">Pause</button>
                    <button id="pbb-exit-btn" style="padding: ${btnPadding}; font-size: ${btnFontSize}; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; touch-action: manipulation;">Exit</button>
                </div>
            </div>
            <div id="pbb-playfield" style="position: relative; width: 100%; height: calc(100dvh - ${mobile ? '62px' : '78px'}); overflow: hidden; background: #ffffff; touch-action: none;">
                <!-- Clean Black Box Enclosure (starts flush at Danger Line with no excess lines above) -->
                <div id="pbb-chamber-box" style="position: absolute; top: ${dangerTop}px; bottom: ${floorBottom + floorHeight}px; left: ${mobile ? '16%' : '20%'}; right: ${mobile ? '4%' : '4%'}; border-left: 3px solid #000000; border-right: 3px solid #000000; background: #ffffff; pointer-events: none; z-index: 2;"></div>

                <!-- Top Danger Line -->
                <div id="pbb-danger-line" style="position: absolute; top: ${dangerTop}px; left: ${mobile ? '16%' : '20%'}; right: ${mobile ? '4%' : '4%'}; border-top: 3px solid #000000; pointer-events: none; z-index: 5; transition: border-color 0.2s;">
                    <span style="position: absolute; right: 6px; top: -19px; font-size: 11px; font-weight: 800; color: #000000; letter-spacing: 0.5px;">DANGER LINE</span>
                </div>

                <!-- Left Character Sprite Zone -->
                <div id="pbb-mascot-zone" style="position: absolute; bottom: ${mobile ? '104px' : '72px'}; left: ${mobile ? '6px' : '28px'}; width: ${mobile ? '56px' : '130px'}; display: flex; flex-direction: column; align-items: center; pointer-events: none; z-index: 4;">
                    <div id="pbb-mascot-emoji" style="font-size: ${mobile ? '40px' : '70px'}; transition: transform 0.2s;">👩‍🏫</div>
                </div>

                <!-- Black Ground Platform Base -->
                <div id="pbb-floor" style="position: absolute; bottom: ${floorBottom}px; left: ${mobile ? '16%' : '20%'}; right: ${mobile ? '4%' : '4%'}; height: ${floorHeight}px; background: #000000; border-top: 3px solid #000000; border-radius: 0 0 6px 6px; pointer-events: none; z-index: 4;"></div>
            </div>
        `;
        document.body.appendChild(container);

        if (!document.getElementById('pbb-wiggle-style')) {
            const style = document.createElement('style');
            style.id = 'pbb-wiggle-style';
            style.textContent = `
                @keyframes pbbBubbleWiggle {
                    0%   { transform: scale(1.12, 0.86); }
                    25%  { transform: scale(0.92, 1.09) rotate(-3deg); }
                    50%  { transform: scale(1.06, 0.94) rotate(3deg); }
                    75%  { transform: scale(0.98, 1.02) rotate(-1.5deg); }
                    100% { transform: scale(1, 1) rotate(0deg); }
                }
                .pbb-wiggle-anim {
                    animation: pbbBubbleWiggle 0.42s ease-out;
                }
            `;
            document.head.appendChild(style);
        }

        const playfield = document.getElementById('pbb-playfield');
        playfield.addEventListener('pointerdown', (e) => {
            if (!this.isGameRunning || this.isPaused) return;
            if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;

            let bestBubble = null;
            let bestDist = Infinity;

            for (let i = 0; i < this.bubbles.length; i++) {
                const b = this.bubbles[i];
                const rect = b.element.getBoundingClientRect();
                const { padX, padY } = (typeof GameSettings !== 'undefined' && GameSettings.getSensitivityPadding)
                    ? GameSettings.getSensitivityPadding(rect)
                    : { padX: rect.width * 0.2, padY: rect.height * 0.2 };

                const centerX = (rect.left + rect.right) / 2;
                const centerY = (rect.top + rect.bottom) / 2;
                const rx = (rect.width / 2) + padX;
                const ry = (rect.height / 2) + padY;

                const normDist = ((e.clientX - centerX) ** 2) / (rx ** 2) + ((e.clientY - centerY) ** 2) / (ry ** 2);
                if (normDist <= 1 && normDist < bestDist) {
                    bestDist = normDist;
                    bestBubble = b;
                }
            }

            if (bestBubble) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBubbleTap(bestBubble);
            } else if (this.selectedBubble) {
                this.clearSelection();
            }
        });

        const gameOverModal = document.createElement('div');
        gameOverModal.id = 'pbb-game-over-modal';
        gameOverModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;
            background: rgba(0,0,0,0.8); z-index: 10001; display: none;
            align-items: center; justify-content: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            user-select: none; -webkit-user-select: none; touch-action: manipulation;
        `;
        gameOverModal.innerHTML = `
            <div style="background: #fff; color: #333; padding: 35px; border-radius: 12px; width: 400px; max-width: 90%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
                <h1 style="margin-top: 0; color: #e74c3c; font-size: 32px; letter-spacing: 1px;">BUBBLES OVERFLOWED!</h1>
                <p style="font-size: 16px; color: #555; margin: 12px 0;">Your Final Score:</p>
                <div id="pbb-final-score" style="font-size: 42px; font-weight: bold; color: #2c3e50; margin-bottom: 24px;">0</div>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="pbb-play-again-btn" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Play Again</button>
                    <button id="pbb-go-exit-btn" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Main Menu</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameOverModal);

        document.getElementById('pbb-play-again-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            document.getElementById('portmanteau-container').style.display = 'block';
            this.lockZoom();
            this.startGame();
        });

        document.getElementById('pbb-go-exit-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            this.unlockZoom();
        });

        document.getElementById('pbb-exit-btn').addEventListener('click', () => this.endGameManually());
        document.getElementById('pbb-pause-btn').addEventListener('click', () => this.togglePause());
    },

    showInstructions(onStartCallback) {
        this.init();

        let modal = document.getElementById('pbb-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pbb-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;
                background: rgba(0,0,0,0.7); z-index: 10000; display: flex;
                align-items: center; justify-content: center;
                user-select: none; -webkit-user-select: none; touch-action: manipulation;
            `;
            modal.innerHTML = `
                <div style="background: #fff; color: #333; padding: 28px; border-radius: 12px; width: 470px; max-width: 92%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                    <h2 style="margin-top: 0; color: #2c3e50;">Portmanteau Bubble Blast University</h2>
                    <p style="font-size: 14px; line-height: 1.55; color: #475569; text-align: left;">
                        Combine two <strong>grounded/settled</strong> word bubbles inside the box to form compound words and clear the room before bubbles reach the top <strong>Danger Line</strong>!
                        <br><br>• <strong>Small + Small = Big Bubble (+10 pts):</strong> Combine two base words (e.g., <em>white + board = whiteboard</em>, <em>earth + fire = lava</em>).
                        <br>• <strong>Big + Small = Burst! (+20 pts):</strong> Pair a Big Bubble with its purpose, place, or counter (e.g., <em>whiteboard + school</em>, <em>ice + fire</em>).
                        <br>• <strong>Big + Big = Mega Burst! (+50 pts):</strong> Combine two compatible Big Bubbles to blast both at once!
                        <br>• Bubbles float down continuously until they land or hit the top Danger Line. Level advances every <strong>200 points</strong>!
                    </p>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                        <button id="pbb-start-game-btn" style="padding: 10px 26px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">GAME</button>
                        <button id="pbb-cancel-modal-btn" style="padding: 10px 26px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">CANCEL</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('pbb-start-game-btn').addEventListener('click', () => {
                modal.style.display = 'none';
                document.getElementById('portmanteau-container').style.display = 'block';
                this.lockZoom();
                this.startGame();
                if (onStartCallback) onStartCallback();
            });

            document.getElementById('pbb-cancel-modal-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        } else {
            modal.style.display = 'flex';
        }
    },

    startGame() {
        this.score = 0;
        this.level = 1;
        this.bubbles = [];
        this.selectedBubble = null;
        this.isGameRunning = true;
        this.isPaused = false;
        this.spawnTimer = 0;
        this.dangerGraceFrames = 0;

        document.getElementById('pbb-pause-btn').textContent = 'Pause';
        document.getElementById('pbb-pause-btn').style.background = '#f39c12';

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'none';

        const pauseOverlay = document.getElementById('pbb-pause-overlay');
        if (pauseOverlay) pauseOverlay.remove();

        const playfield = document.getElementById('pbb-playfield');
        playfield.querySelectorAll('.pbb-bubble-node').forEach(el => el.remove());

        this.updateHUD();
        this.updateHint("Tap settled bubbles");
        this.seedStarterBubbles();

        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.lastTime = performance.now();
        this.animationFrameLoop(this.lastTime);
    },

    getPlayZoneBounds() {
        const playfield = document.getElementById('pbb-playfield');
        const mobile = this.isMobile();
        const w = playfield ? playfield.clientWidth : window.innerWidth;
        const h = playfield ? playfield.clientHeight : window.innerHeight - 70;
        const wallThickness = 3;
        const leftBound = Math.floor(w * (mobile ? 0.16 : 0.20)) + wallThickness;
        const rightBound = Math.floor(w * (mobile ? 0.96 : 0.96)) - wallThickness;
        const floorBottomOffset = mobile ? 70 : 32;
        const floorHeight = mobile ? 14 : 16;
        const floorY = h - (floorBottomOffset + floorHeight);
        this.dangerLineY = mobile ? 68 : 86;
        return { leftBound, rightBound, floorY, width: w, height: h };
    },

    getSmallRadius() {
        return this.isMobile() ? 24 : 32;
    },

    getBigRadius() {
        return this.isMobile() ? 37 : 48;
    },

    seedStarterBubbles() {
        const { leftBound, rightBound, floorY } = this.getPlayZoneBounds();
        const r = this.getSmallRadius();
        const starterWords = ["wind", "lock", "tissue", "ball", "napkin", "board", "white"];
        const usableW = Math.max(60, rightBound - leftBound - r * 2);
        const step = usableW / Math.max(1, starterWords.length - 1);

        starterWords.forEach((word, idx) => {
            const x = leftBound + r + idx * step;
            const y = floorY - r;
            const b = this.createBubble(word, false, x, y);
            b.settled = true;
            b.vy = 0;
            this.triggerBubbleWiggle(b);
        });
    },

    triggerBubbleWiggle(bubble) {
        if (!bubble || !bubble.element) return;
        bubble.element.classList.remove('pbb-wiggle-anim');
        void bubble.element.offsetWidth;
        bubble.element.classList.add('pbb-wiggle-anim');
    },

    pickSmartNextWord() {
        const smallOnBoard = this.bubbles.filter(b => !b.isBig).map(b => b.word);
        const bigOnBoard = this.bubbles.filter(b => b.isBig).map(b => b.word);
        const candidatePool = [];

        bigOnBoard.forEach(bigWord => {
            const counters = this.bigEliminations[bigWord] || [];
            counters.forEach(c => candidatePool.push(c, c));
        });

        smallOnBoard.forEach(smallWord => {
            this.smallRecipes.forEach(rec => {
                if (rec.a === smallWord) candidatePool.push(rec.b);
                if (rec.b === smallWord) candidatePool.push(rec.a);
            });
        });

        const randomRecipe = this.smallRecipes[Math.floor(Math.random() * this.smallRecipes.length)];
        candidatePool.push(randomRecipe.a, randomRecipe.b);

        return candidatePool[Math.floor(Math.random() * candidatePool.length)];
    },

    spawnFallingBubble() {
        const { leftBound, rightBound } = this.getPlayZoneBounds();
        const r = this.getSmallRadius();
        const minX = leftBound + r + 4;
        const maxX = Math.max(minX + 10, rightBound - r - 4);

        let spawnX = minX + Math.random() * (maxX - minX);
        const spawnY = this.dangerLineY - r - 6;

        for (let attempt = 0; attempt < 10; attempt++) {
            const tooClose = this.bubbles.some(b => Math.hypot(b.x - spawnX, b.y - spawnY) < (b.radius + r + 8));
            if (!tooClose) break;
            spawnX = minX + Math.random() * (maxX - minX);
        }

        const word = this.pickSmartNextWord();
        const b = this.createBubble(word, false, spawnX, spawnY);
        b.vy = 1.25;
    },

    getWordAccentColor(word, isBig) {
        if (isBig) {
            const rec = this.smallRecipes.find(r => r.result === word);
            return rec ? rec.color : "#2563eb";
        }
        const palette = ["#0284c7", "#0d9488", "#4f46e5", "#d97706", "#dc2626", "#7c3aed", "#059669"];
        let hash = 0;
        for (let i = 0; i < word.length; i++) hash = word.charCodeAt(i) + ((hash << 5) - hash);
        return palette[Math.abs(hash) % palette.length];
    },

    createBubble(word, isBig, x, y) {
        const playfield = document.getElementById('pbb-playfield');
        const radius = isBig ? this.getBigRadius() : this.getSmallRadius();
        const textColor = this.getWordAccentColor(word, isBig);

        const el = document.createElement('div');
        el.className = 'pbb-bubble-node';
        el.textContent = word;

        const baseFontSize = isBig
            ? (word.length >= 11 ? (this.isMobile() ? 11 : 14) : (this.isMobile() ? 13 : 17))
            : (word.length >= 7 ? (this.isMobile() ? 10 : 13) : (this.isMobile() ? 12 : 15));

        el.style.cssText = `
            position: absolute;
            width: ${radius * 2}px;
            height: ${radius * 2}px;
            left: ${x - radius}px;
            top: ${y - radius}px;
            border-radius: 50%;
            background: ${isBig ? 'radial-gradient(circle at 30% 28%, #ffffff 0%, #e0f2fe 70%, #bae6fd 100%)' : 'radial-gradient(circle at 30% 28%, #ffffff 0%, #f8fafc 75%, #e2e8f0 100%)'};
            border: ${isBig ? '3px' : '2.2px'} solid #000000;
            color: ${textColor};
            font-weight: 800;
            font-size: ${baseFontSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 4px;
            box-sizing: border-box;
            line-height: 1.1;
            box-shadow: inset 0 3px 6px rgba(255,255,255,0.85), 0 3px 8px rgba(0, 0, 0, 0.14);
            cursor: pointer;
            z-index: ${isBig ? 7 : 6};
            will-change: left, top;
        `;

        playfield.appendChild(el);

        const bubbleObj = {
            id: Math.random().toString(36).slice(2),
            word: word.toLowerCase(),
            isBig: isBig,
            x: x,
            y: y,
            vx: 0,
            vy: 1.2,
            radius: radius,
            settled: false,
            settledFrames: 0,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.04,
            swayAmp: 0.4,
            element: el
        };

        this.bubbles.push(bubbleObj);
        return bubbleObj;
    },

    handleBubbleTap(bubble) {
        if (!bubble.settled) {
            this.shakeBubble(bubble);
            this.updateHint("Wait until it lands!");
            return;
        }

        if (!this.selectedBubble) {
            this.selectBubble(bubble);
            return;
        }

        if (this.selectedBubble.id === bubble.id) {
            this.clearSelection();
            return;
        }

        const first = this.selectedBubble;
        const second = bubble;
        const matchResult = this.evaluateCombination(first, second);

        if (matchResult) {
            this.clearSelection();
            this.executeCombination(first, second, matchResult);
        } else {
            this.shakeBubble(second);
            this.selectBubble(second);
            this.updateHint(`No match — selected "${second.word}"`);
        }
    },

    selectBubble(bubble) {
        this.clearSelection();
        this.selectedBubble = bubble;
        bubble.element.style.borderColor = '#2563eb';
        bubble.element.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.35), 0 6px 14px rgba(37, 99, 235, 0.25)';
        bubble.element.style.transform = 'scale(1.06)';
        this.updateHint(`Selected: "${bubble.word}"`);
    },

    clearSelection() {
        if (this.selectedBubble && this.selectedBubble.element) {
            this.selectedBubble.element.style.borderColor = '#000000';
            this.selectedBubble.element.style.boxShadow = 'inset 0 3px 6px rgba(255,255,255,0.85), 0 3px 8px rgba(0, 0, 0, 0.14)';
            this.selectedBubble.element.style.transform = 'scale(1)';
        }
        this.selectedBubble = null;
        this.updateHint("Tap settled bubbles");
    },

    shakeBubble(bubble) {
        if (!bubble || !bubble.element) return;
        bubble.element.style.transform = 'translateX(-3px)';
        setTimeout(() => {
            if (bubble.element) bubble.element.style.transform = 'translateX(3px)';
        }, 55);
        setTimeout(() => {
            if (bubble.element) {
                bubble.element.style.transform = (this.selectedBubble && this.selectedBubble.id === bubble.id)
                    ? 'scale(1.06)'
                    : 'scale(1)';
            }
        }, 110);
    },

    evaluateCombination(b1, b2) {
        if (!b1.isBig && !b2.isBig) {
            const recipe = this.smallRecipes.find(r =>
                (r.a === b1.word && r.b === b2.word) ||
                (r.a === b2.word && r.b === b1.word)
            );
            if (recipe) {
                return { type: 'MERGE_TO_BIG', newWord: recipe.result, points: 10 };
            }
            return null;
        }

        if (b1.isBig !== b2.isBig) {
            const bigB = b1.isBig ? b1 : b2;
            const smallB = b1.isBig ? b2 : b1;
            const allowedSmallWords = this.bigEliminations[bigB.word] || [];
            if (allowedSmallWords.includes(smallB.word)) {
                return { type: 'ELIMINATE_BIG_SMALL', points: 20 };
            }
            return null;
        }

        if (b1.isBig && b2.isBig) {
            const isCombo = this.bigComboPairs.some(([w1, w2]) =>
                (w1 === b1.word && w2 === b2.word) ||
                (w1 === b2.word && w2 === b1.word)
            );
            if (isCombo) {
                return { type: 'ELIMINATE_BIG_BIG', points: 50 };
            }
            return null;
        }

        return null;
    },

    executeCombination(b1, b2, result) {
        const targetX = b2.x;
        const targetY = b2.y;

        this.score += result.points;
        this.level = Math.floor(this.score / 200) + 1;
        this.updateHUD();
        this.celebrateMascot();

        this.removeBubble(b1);
        this.removeBubble(b2);

        if (result.type === 'MERGE_TO_BIG') {
            this.createFloatingPop(targetX, targetY - 20, `${result.newWord.toUpperCase()}! +10`, '#2563eb');
            const bigBubble = this.createBubble(result.newWord, true, targetX, targetY);
            bigBubble.settled = true;
            bigBubble.vy = 0;
            this.triggerBubbleWiggle(bigBubble);
        } else if (result.type === 'ELIMINATE_BIG_SMALL') {
            this.createBurstRing(targetX, targetY, '#10b981');
            this.createFloatingPop(targetX, targetY - 24, `BLAST! +20`, '#059669');
        } else if (result.type === 'ELIMINATE_BIG_BIG') {
            this.createBurstRing(targetX, targetY, '#f59e0b');
            this.createFloatingPop(targetX, targetY - 28, `MEGA BLAST! +50`, '#d97706');
        }

        // Only unsettle bubbles that are no longer resting on a solid surface
        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            b.settledFrames = 0;
            if (b.vy < 1.1) b.vy = 1.1;
        }
    },

    removeBubble(bubble) {
        if (!bubble) return;
        if (this.selectedBubble && this.selectedBubble.id === bubble.id) {
            this.selectedBubble = null;
        }
        if (bubble.element) {
            bubble.element.remove();
        }
        this.bubbles = this.bubbles.filter(b => b.id !== bubble.id);
    },

    celebrateMascot() {
        const mascot = document.getElementById('pbb-mascot-emoji');
        if (!mascot) return;
        mascot.textContent = '🙌';
        mascot.style.transform = 'scale(1.12)';
        setTimeout(() => {
            if (mascot) {
                mascot.textContent = '👩‍🏫';
                mascot.style.transform = 'scale(1)';
            }
        }, 400);
    },

    createBurstRing(x, y, color) {
        const playfield = document.getElementById('pbb-playfield');
        if (!playfield) return;
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute; left: ${x - 42}px; top: ${y - 42}px;
            width: 84px; height: 84px; border-radius: 50%;
            border: 3px solid ${color}; pointer-events: none; z-index: 20;
            transform: scale(0.5); opacity: 1;
            transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        `;
        playfield.appendChild(ring);
        requestAnimationFrame(() => {
            ring.style.transform = 'scale(1.45)';
            ring.style.opacity = '0';
        });
        setTimeout(() => ring.remove(), 320);
    },

    createFloatingPop(x, y, text, color) {
        const playfield = document.getElementById('pbb-playfield');
        if (!playfield) return;
        const pop = document.createElement('div');
        pop.textContent = text;
        pop.style.cssText = `
            position: absolute; left: ${Math.max(20, x - 65)}px; top: ${Math.max(20, y)}px;
            color: ${color}; font-weight: 900; font-size: 17px;
            text-shadow: 0 2px 6px rgba(255,255,255,0.95);
            pointer-events: none; z-index: 25;
            transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        `;
        playfield.appendChild(pop);
        requestAnimationFrame(() => {
            pop.style.transform = 'translateY(-28px)';
            pop.style.opacity = '0';
        });
        setTimeout(() => pop.remove(), 520);
    },

    stepPhysics() {
        const { leftBound, rightBound, floorY } = this.getPlayZoneBounds();
        const floatSpeed = Math.min(2.2, 1.2 + (this.level - 1) * 0.12);

        // 1. Advance falling bubbles continuously; keep landed/supported bubbles grounded
        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            const prevX = b.x;
            const prevY = b.y;

            const touchingFloor = (b.y + b.radius) >= (floorY - 1.5);
            const supportedBelow = this.bubbles.some((other, idx) => {
                if (idx === i) return false;
                if (other.y <= b.y + 4) return false;
                const dx = Math.abs(other.x - b.x);
                const dy = other.y - b.y;
                return dx < (other.radius + b.radius * 0.75) && dy <= (other.radius + b.radius + 6);
            });

            if (!touchingFloor && !supportedBelow) {
                b.settled = false;
                b.settledFrames = 0;
                b.swayPhase += b.swaySpeed;
                const airDriftX = Math.cos(b.swayPhase) * b.swayAmp;
                b.vy = Math.max(1.1, Math.min(b.vy + 0.04, floatSpeed));
                b.x += b.vx + airDriftX;
                b.y += b.vy;
            } else {
                b.vy = 0;
                b.x += b.vx;
            }

            b.vx *= 0.78;

            if (b.x - b.radius < leftBound) {
                b.x = leftBound + b.radius;
                b.vx = 0.2;
            } else if (b.x + b.radius > rightBound) {
                b.x = rightBound - b.radius;
                b.vx = -0.2;
            }

            if (b.y + b.radius > floorY) {
                b.y = floorY - b.radius;
                b.vy = 0;
            }

            b._prevX = prevX;
            b._prevY = prevY;
            b._touchingFloor = touchingFloor;
            b._supportedBelow = supportedBelow;
        }

        // 2. Smooth circle-circle separation so bubbles never overlap or flinch
        for (let iter = 0; iter < 5; iter++) {
            for (let i = 0; i < this.bubbles.length; i++) {
                for (let j = i + 1; j < this.bubbles.length; j++) {
                    const a = this.bubbles[i];
                    const b = this.bubbles[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.hypot(dx, dy) || 0.01;
                    const minDist = a.radius + b.radius + 2;

                    if (dist < minDist) {
                        const overlap = (minDist - dist) * 0.5;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Prefer pushing horizontally if side-by-side so falling bubbles don't stall vertically
                        const pushY = overlap * Math.abs(ny) * 0.65;
                        const pushX = overlap * Math.max(0.35, Math.abs(nx));

                        if (a.y < b.y) {
                            a.y -= pushY;
                            b.y += pushY * 0.35;
                        } else {
                            b.y -= pushY;
                            a.y += pushY * 0.35;
                        }

                        if (a.x < b.x) {
                            a.x -= pushX;
                            b.x += pushX;
                        } else {
                            a.x += pushX;
                            b.x -= pushX;
                        }
                    }
                }
            }

            for (let i = 0; i < this.bubbles.length; i++) {
                const b = this.bubbles[i];
                if (b.x - b.radius < leftBound) b.x = leftBound + b.radius;
                if (b.x + b.radius > rightBound) b.x = rightBound - b.radius;
                if (b.y + b.radius > floorY) {
                    b.y = floorY - b.radius;
                    b.vy = 0;
                }
            }
        }

        let anyOverDangerLine = false;

        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            const wasSettled = b.settled;
            const atRestOnSurface = ((b.y + b.radius) >= (floorY - 2)) || b._supportedBelow;

            if (atRestOnSurface) {
                b.settledFrames++;
                if (b.settledFrames >= 3) {
                    b.settled = true;
                }
            } else {
                b.settledFrames = 0;
                b.settled = false;
            }

            if (!wasSettled && b.settled) {
                this.triggerBubbleWiggle(b);
            }

            b.element.style.left = `${b.x - b.radius}px`;
            b.element.style.top = `${b.y - b.radius}px`;
            b.element.style.opacity = b.settled ? '1' : '0.88';

            if ((b.y - b.radius) <= this.dangerLineY && b.settled) {
                anyOverDangerLine = true;
            }
        }

        const dangerLineEl = document.getElementById('pbb-danger-line');
        if (anyOverDangerLine) {
            this.dangerGraceFrames++;
            if (dangerLineEl) dangerLineEl.style.borderTopColor = '#ef4444';
            if (this.dangerGraceFrames >= 40) {
                this.triggerGameOver();
            }
        } else {
            this.dangerGraceFrames = 0;
            if (dangerLineEl) dangerLineEl.style.borderTopColor = '#000000';
        }
    },

    animationFrameLoop(timestamp) {
        if (!this.isGameRunning) return;

        const elapsed = Math.max(8, Math.min(34, timestamp - this.lastTime || 16));
        this.lastTime = timestamp;

        if (!this.isPaused) {
            this.spawnTimer += elapsed;
            const spawnIntervalMs = Math.max(1650, 2900 - (this.level - 1) * 140);

            if (this.spawnTimer >= spawnIntervalMs) {
                this.spawnTimer = 0;
                this.spawnFallingBubble();
            }

            this.stepPhysics();
        }

        this.animationFrameId = requestAnimationFrame((ts) => this.animationFrameLoop(ts));
    },

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pbb-pause-btn');
        const playfield = document.getElementById('pbb-playfield');

        if (this.isPaused) {
            pauseBtn.textContent = 'Resume';
            pauseBtn.style.background = '#27ae60';
            this.bubbles.forEach(b => b.element.style.visibility = 'hidden');

            let pauseOverlay = document.getElementById('pbb-pause-overlay');
            if (!pauseOverlay) {
                pauseOverlay = document.createElement('div');
                pauseOverlay.id = 'pbb-pause-overlay';
                pauseOverlay.style.cssText = `
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(15,23,42,0.92); backdrop-filter: blur(6px); display: flex;
                    flex-direction: column; align-items: center; justify-content: center;
                    font-size: 34px; font-weight: bold; color: #fff; z-index: 100; gap: 10px;
                    text-align: center; padding: 20px;
                `;
                pauseOverlay.innerHTML = `<div>GAME PAUSED</div><div style="font-size: 16px; font-weight: normal; color: #cbd5e1;">Bubbles are hidden to prevent peeking!</div>`;
                playfield.appendChild(pauseOverlay);
            } else {
                pauseOverlay.style.display = 'flex';
            }
        } else {
            pauseBtn.textContent = 'Pause';
            pauseBtn.style.background = '#f39c12';
            this.bubbles.forEach(b => b.element.style.visibility = 'visible');
            this.lastTime = performance.now();

            const pauseOverlay = document.getElementById('pbb-pause-overlay');
            if (pauseOverlay) pauseOverlay.style.display = 'none';
        }
    },

    updateHUD() {
        document.getElementById('pbb-score').textContent = `SCORE: ${this.score}`;
        document.getElementById('pbb-level').textContent = `LEVEL: ${this.level}`;
    },

    updateHint(msg) {
        const hintEl = document.getElementById('pbb-selected-hint');
        if (hintEl) hintEl.textContent = msg;
    },

    triggerGameOver() {
        this.isGameRunning = false;
        this.unlockZoom();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'block';

        const playfield = document.getElementById('pbb-playfield');
        if (playfield) {
            playfield.querySelectorAll('.pbb-bubble-node').forEach(el => el.remove());
            const pauseOverlay = document.getElementById('pbb-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
        }

        document.getElementById('portmanteau-container').style.display = 'none';
        document.getElementById('pbb-final-score').textContent = this.score;
        document.getElementById('pbb-game-over-modal').style.display = 'flex';
    },

    endGameManually() {
        this.isGameRunning = false;
        this.unlockZoom();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'block';

        const playfield = document.getElementById('pbb-playfield');
        if (playfield) {
            playfield.querySelectorAll('.pbb-bubble-node').forEach(el => el.remove());
            const pauseOverlay = document.getElementById('pbb-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
        }

        document.getElementById('portmanteau-container').style.display = 'none';
    }
};
