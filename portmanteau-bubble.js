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
    dangerLineY: 95,
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
    // Purpose, location, or elemental counter
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
        const container = document.createElement('div');
        container.id = 'portmanteau-container';
        container.style.cssText = `
            display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
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
            <div id="pbb-playfield" style="position: relative; width: 100%; height: calc(100vh - ${mobile ? '62px' : '78px'}); overflow: hidden; background: #ffffff; touch-action: none;">
                <!-- Top Danger Line -->
                <div id="pbb-danger-line" style="position: absolute; top: ${mobile ? '72px' : '90px'}; left: ${mobile ? '18%' : '22%'}; right: ${mobile ? '4%' : '5%'}; border-top: 3px solid #1e293b; pointer-events: none; z-index: 5; transition: border-color 0.2s;">
                    <span style="position: absolute; right: 0; top: -20px; font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 0.5px;">DANGER LINE</span>
                </div>

                <!-- Left Character Sprite Zone (ready for custom chibi sprite later) -->
                <div id="pbb-mascot-zone" style="position: absolute; bottom: ${mobile ? '24px' : '36px'}; left: ${mobile ? '10px' : '34px'}; width: ${mobile ? '72px' : '140px'}; display: flex; flex-direction: column; align-items: center; pointer-events: none; z-index: 4;">
                    <div id="pbb-mascot-emoji" style="font-size: ${mobile ? '48px' : '74px'}; transition: transform 0.2s;">👩‍🏫</div>
                </div>

                <!-- Ground Floor -->
                <div id="pbb-floor" style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${mobile ? '20px' : '28px'}; background: #cbd5e1; border-top: 3px solid #94a3b8; pointer-events: none; z-index: 4;"></div>
            </div>
        `;
        document.body.appendChild(container);

        // Unified pointerdown handler using Sidebar Sensitivity Slider (0% - 100%)
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

        // Game Over Modal
        const gameOverModal = document.createElement('div');
        gameOverModal.id = 'pbb-game-over-modal';
        gameOverModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
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
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.7); z-index: 10000; display: flex;
                align-items: center; justify-content: center;
                user-select: none; -webkit-user-select: none; touch-action: manipulation;
            `;
            modal.innerHTML = `
                <div style="background: #fff; color: #333; padding: 28px; border-radius: 12px; width: 470px; max-width: 92%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                    <h2 style="margin-top: 0; color: #2c3e50;">Portmanteau Bubble Blast University</h2>
                    <p style="font-size: 14px; line-height: 1.55; color: #475569; text-align: left;">
                        Combine two <strong>grounded/settled</strong> word bubbles to form compound words and clear the room before bubbles reach the top <strong>Danger Line</strong>!
                        <br><br>• <strong>Small + Small = Big Bubble (+10 pts):</strong> Combine two base words (e.g., <em>white + board = whiteboard</em>, <em>earth + fire = lava</em>).
                        <br>• <strong>Big + Small = Burst! (+20 pts):</strong> Pair a Big Bubble with its purpose, place, or counter (e.g., <em>whiteboard + school</em>, <em>ice + fire</em>).
                        <br>• <strong>Big + Big = Mega Burst! (+50 pts):</strong> Combine two compatible Big Bubbles to blast both at once!
                        <br>• Bubbles cannot be combined while still falling in mid-air. Level advances every <strong>200 points</strong>!
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

        // Seed initial starter bubbles so the player can immediately make a combo
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
        const leftBound = Math.floor(w * (mobile ? 0.20 : 0.23));
        const rightBound = Math.floor(w * (mobile ? 0.96 : 0.95));
        const floorY = h - (mobile ? 20 : 28);
        this.dangerLineY = mobile ? 72 : 90;
        return { leftBound, rightBound, floorY, width: w, height: h };
    },

    getSmallRadius() {
        return this.isMobile() ? 27 : 34;
    },

    getBigRadius() {
        return this.isMobile() ? 42 : 52;
    },

    seedStarterBubbles() {
        const { leftBound, rightBound } = this.getPlayZoneBounds();
        const r = this.getSmallRadius();
        const starterWords = ["wind", "lock", "tissue", "ball", "napkin", "board", "white"];
        const usableW = rightBound - leftBound - r * 2;
        const step = usableW / Math.max(1, starterWords.length - 1);

        starterWords.forEach((word, idx) => {
            const x = leftBound + r + idx * step;
            const y = this.dangerLineY + r + 8 + (idx % 2) * 18;
            this.createBubble(word, false, x, y);
        });
    },

    pickSmartNextWord() {
        // Look at current settled/active bubbles so the player regularly receives useful pairing pieces
        const smallOnBoard = this.bubbles.filter(b => !b.isBig).map(b => b.word);
        const bigOnBoard = this.bubbles.filter(b => b.isBig).map(b => b.word);

        const candidatePool = [];

        // 1. Add words that can eliminate existing Big Bubbles
        bigOnBoard.forEach(bigWord => {
            const counters = this.bigEliminations[bigWord] || [];
            counters.forEach(c => candidatePool.push(c, c));
        });

        // 2. Add partners for existing Small Bubbles
        smallOnBoard.forEach(smallWord => {
            this.smallRecipes.forEach(rec => {
                if (rec.a === smallWord) candidatePool.push(rec.b);
                if (rec.b === smallWord) candidatePool.push(rec.a);
            });
        });

        // 3. Add fresh recipe ingredients
        const randomRecipe = this.smallRecipes[Math.floor(Math.random() * this.smallRecipes.length)];
        candidatePool.push(randomRecipe.a, randomRecipe.b);

        return candidatePool[Math.floor(Math.random() * candidatePool.length)];
    },

    spawnFallingBubble() {
        const { leftBound, rightBound } = this.getPlayZoneBounds();
        const r = this.getSmallRadius();
        const minX = leftBound + r + 6;
        const maxX = Math.max(minX + 10, rightBound - r - 6);

        let spawnX = minX + Math.random() * (maxX - minX);
        const spawnY = this.dangerLineY - r - 6;

        // Avoid spawning directly overlapping another bubble near the top
        for (let attempt = 0; attempt < 10; attempt++) {
            const tooClose = this.bubbles.some(b => Math.hypot(b.x - spawnX, b.y - spawnY) < (b.radius + r + 10));
            if (!tooClose) break;
            spawnX = minX + Math.random() * (maxX - minX);
        }

        const word = this.pickSmartNextWord();
        this.createBubble(word, false, spawnX, spawnY);
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
            ? (word.length >= 11 ? (this.isMobile() ? 12 : 14) : (this.isMobile() ? 14 : 17))
            : (word.length >= 7 ? (this.isMobile() ? 11 : 13) : (this.isMobile() ? 13 : 15));

        el.style.cssText = `
            position: absolute;
            width: ${radius * 2}px;
            height: ${radius * 2}px;
            left: ${x - radius}px;
            top: ${y - radius}px;
            border-radius: 50%;
            background: ${isBig ? '#f0f9ff' : '#ffffff'};
            border: ${isBig ? '3.5px' : '2.5px'} solid #1e293b;
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
            box-shadow: 0 3px 8px rgba(15, 23, 42, 0.14);
            cursor: pointer;
            z-index: ${isBig ? 7 : 6};
            transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
        `;

        playfield.appendChild(el);

        const bubbleObj = {
            id: Math.random().toString(36).slice(2),
            word: word.toLowerCase(),
            isBig: isBig,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            radius: radius,
            settled: false,
            settledFrames: 0,
            element: el
        };

        this.bubbles.push(bubbleObj);
        return bubbleObj;
    },

    handleBubbleTap(bubble) {
        // Rule: Players can only burst/combine bubbles once they hit the ground/stack (not in mid-air)
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

        // Evaluate combination rules
        const matchResult = this.evaluateCombination(first, second);

        if (matchResult) {
            this.clearSelection();
            this.executeCombination(first, second, matchResult);
        } else {
            // Smoothly switch selection if invalid pair so gameplay stays fast
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
        bubble.element.style.transform = 'scale(1.07)';
        this.updateHint(`Selected: "${bubble.word}"`);
    },

    clearSelection() {
        if (this.selectedBubble && this.selectedBubble.element) {
            this.selectedBubble.element.style.borderColor = '#1e293b';
            this.selectedBubble.element.style.boxShadow = '0 3px 8px rgba(15, 23, 42, 0.14)';
            this.selectedBubble.element.style.transform = 'scale(1)';
        }
        this.selectedBubble = null;
        this.updateHint("Tap settled bubbles");
    },

    shakeBubble(bubble) {
        if (!bubble || !bubble.element) return;
        bubble.element.style.transform = 'translateX(-4px)';
        setTimeout(() => {
            if (bubble.element) bubble.element.style.transform = 'translateX(4px)';
        }, 55);
        setTimeout(() => {
            if (bubble.element) {
                bubble.element.style.transform = (this.selectedBubble && this.selectedBubble.id === bubble.id)
                    ? 'scale(1.07)'
                    : 'scale(1)';
            }
        }, 110);
    },

    evaluateCombination(b1, b2) {
        // Case A: Small + Small -> Big Bubble (+10 pts)
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

        // Case B: Big + Small -> Eliminate Both! (+20 pts)
        if (b1.isBig !== b2.isBig) {
            const bigB = b1.isBig ? b1 : b2;
            const smallB = b1.isBig ? b2 : b1;
            const allowedSmallWords = this.bigEliminations[bigB.word] || [];
            if (allowedSmallWords.includes(smallB.word)) {
                return { type: 'ELIMINATE_BIG_SMALL', points: 20 };
            }
            return null;
        }

        // Case C: Big + Big -> Double Burst! (+50 pts)
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

        // Remove both consumed bubbles
        this.removeBubble(b1);
        this.removeBubble(b2);

        if (result.type === 'MERGE_TO_BIG') {
            this.createFloatingPop(targetX, targetY - 20, `${result.newWord.toUpperCase()}! +10`, '#2563eb');
            const bigBubble = this.createBubble(result.newWord, true, targetX, targetY - 12);
            bigBubble.settled = true;
            bigBubble.element.style.transform = 'scale(1.18)';
            setTimeout(() => {
                if (bigBubble.element) bigBubble.element.style.transform = 'scale(1)';
            }, 160);
        } else if (result.type === 'ELIMINATE_BIG_SMALL') {
            this.createBurstRing(targetX, targetY, '#10b981');
            this.createFloatingPop(targetX, targetY - 24, `BLAST! +20`, '#059669');
        } else if (result.type === 'ELIMINATE_BIG_BIG') {
            this.createBurstRing(targetX, targetY, '#f59e0b');
            this.createFloatingPop(targetX, targetY - 28, `MEGA BLAST! +50`, '#d97706');
        }

        // Wake up any bubbles stacked above so gravity settles them naturally
        this.bubbles.forEach(b => {
            b.settled = false;
            b.settledFrames = 0;
        });
    },

    removeBubble(bubble) {
        if (bubble && bubble.element) {
            bubble.element.remove();
        }
        this.bubbles = this.bubbles.filter(b => b.id !== bubble.id);
    },

    celebrateMascot() {
        const mascot = document.getElementById('pbb-mascot-emoji');
        if (!mascot) return;
        mascot.textContent = '🙌';
        mascot.style.transform = 'scale(1.15)';
        setTimeout(() => {
            if (mascot) {
                mascot.textContent = '👩‍🏫';
                mascot.style.transform = 'scale(1)';
            }
        }, 420);
    },

    createBurstRing(x, y, color) {
        const playfield = document.getElementById('pbb-playfield');
        if (!playfield) return;
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute; left: ${x - 45}px; top: ${y - 45}px;
            width: 90px; height: 90px; border-radius: 50%;
            border: 4px solid ${color}; pointer-events: none; z-index: 20;
            transform: scale(0.5); opacity: 1;
            transition: transform 0.35s ease-out, opacity 0.35s ease-out;
        `;
        playfield.appendChild(ring);
        requestAnimationFrame(() => {
            ring.style.transform = 'scale(1.5)';
            ring.style.opacity = '0';
        });
        setTimeout(() => ring.remove(), 360);
    },

    createFloatingPop(x, y, text, color) {
        const playfield = document.getElementById('pbb-playfield');
        if (!playfield) return;
        const pop = document.createElement('div');
        pop.textContent = text;
        pop.style.cssText = `
            position: absolute; left: ${Math.max(20, x - 65)}px; top: ${Math.max(20, y)}px;
            color: ${color}; font-weight: 900; font-size: 18px;
            text-shadow: 0 2px 6px rgba(255,255,255,0.95);
            pointer-events: none; z-index: 25;
            transition: transform 0.55s ease-out, opacity 0.55s ease-out;
        `;
        playfield.appendChild(pop);
        requestAnimationFrame(() => {
            pop.style.transform = 'translateY(-32px) scale(1.1)';
            pop.style.opacity = '0';
        });
        setTimeout(() => pop.remove(), 560);
    },

    stepPhysics() {
        const { leftBound, rightBound, floorY } = this.getPlayZoneBounds();
        const gravity = 0.28 + Math.min(0.18, (this.level - 1) * 0.03);

        // Apply gravity and floor/wall bounds
        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            const prevX = b.x;
            const prevY = b.y;

            b.vy = Math.min(b.vy + gravity, 6.5);
            b.x += b.vx;
            b.y += b.vy;
            b.vx *= 0.85;

            if (b.x - b.radius < leftBound) {
                b.x = leftBound + b.radius;
                b.vx = 0;
            } else if (b.x + b.radius > rightBound) {
                b.x = rightBound - b.radius;
                b.vx = 0;
            }

            if (b.y + b.radius >= floorY) {
                b.y = floorY - b.radius;
                b.vy = 0;
            }

            b._prevX = prevX;
            b._prevY = prevY;
        }

        // Iterative circle-circle relaxation so bubbles stack organically without overlapping
        for (let iter = 0; iter < 4; iter++) {
            for (let i = 0; i < this.bubbles.length; i++) {
                for (let j = i + 1; j < this.bubbles.length; j++) {
                    const a = this.bubbles[i];
                    const b = this.bubbles[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.hypot(dx, dy) || 0.01;
                    const minDist = a.radius + b.radius + 1;

                    if (dist < minDist) {
                        const overlap = (minDist - dist) * 0.5;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        a.x -= nx * overlap;
                        a.y -= ny * overlap;
                        b.x += nx * overlap;
                        b.y += ny * overlap;

                        // Dampen downward velocity when resting on another bubble
                        if (a.y < b.y && a.vy > 0) a.vy *= 0.35;
                        if (b.y < a.y && b.vy > 0) b.vy *= 0.35;
                    }
                }
            }

            // Re-clamp to walls and floor after relaxation
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

        // Update DOM positions and determine settled state
        let anyOverDangerLine = false;

        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            const movedDist = Math.hypot(b.x - b._prevX, b.y - b._prevY);

            if (movedDist < 0.65 && Math.abs(b.vy) < 0.8) {
                b.settledFrames++;
                if (b.settledFrames >= 6) {
                    b.settled = true;
                }
            } else {
                b.settledFrames = 0;
                b.settled = false;
            }

            b.element.style.left = `${b.x - b.radius}px`;
            b.element.style.top = `${b.y - b.radius}px`;

            // Subtle visual cue: mid-air bubbles are slightly translucent; settled bubbles are crisp & ready
            b.element.style.opacity = b.settled ? '1' : '0.78';

            // Check if a settled bubble stack reaches or crosses the top danger line
            if (b.settled && (b.y - b.radius) <= this.dangerLineY) {
                anyOverDangerLine = true;
            }
        }

        const dangerLineEl = document.getElementById('pbb-danger-line');
        if (anyOverDangerLine) {
            this.dangerGraceFrames++;
            if (dangerLineEl) dangerLineEl.style.borderTopColor = '#ef4444';
            if (this.dangerGraceFrames >= 45) {
                this.triggerGameOver();
            }
        } else {
            this.dangerGraceFrames = 0;
            if (dangerLineEl) dangerLineEl.style.borderTopColor = '#1e293b';
        }
    },

    animationFrameLoop(timestamp) {
        if (!this.isGameRunning) return;

        const dt = Math.min(50, timestamp - this.lastTime);
        this.lastTime = timestamp;

        if (!this.isPaused) {
            this.spawnTimer += dt;
            const spawnIntervalMs = Math.max(1350, 2500 - (this.level - 1) * 140);

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
