// ==========================================
// COMBIMENTAL BUBBLE BLAST UNIVERSITY
// ==========================================

const CombimentalGame = {
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
    recentWords: [],

    // Stage 1: Word 1 + Word 2 -> Combined / Blended Result (+10 pts)
    // Includes 200 blended & combined word pairs (including wind+water=ice and new+born=born)
    smallRecipes: [
        { a: "wind", b: "water", result: "ice", color: "#06b6d4" },
        { a: "new", b: "born", result: "born", color: "#ec4899" },
        { a: "smoke", b: "fog", result: "smog", color: "#64748b" },
        { a: "breakfast", b: "lunch", result: "brunch", color: "#f59e0b" },
        { a: "motor", b: "hotel", result: "motel", color: "#0ea5e9" },
        { a: "spoon", b: "fork", result: "spork", color: "#10b981" },
        { a: "chuckle", b: "snort", result: "chortle", color: "#8b5cf6" },
        { a: "ipod", b: "broadcast", result: "podcast", color: "#6366f1" },
        { a: "white", b: "board", result: "whiteboard", color: "#3b82f6" },
        { a: "ball", b: "pen", result: "ballpen", color: "#4f46e5" },
        { a: "paper", b: "napkin", result: "paper napkin", color: "#d97706" },
        { a: "toilet", b: "paper", result: "toilet paper", color: "#0d9488" },
        { a: "earth", b: "water", result: "mud", color: "#92400e" },
        { a: "earth", b: "fire", result: "lava", color: "#ef4444" },
        { a: "note", b: "book", result: "notebook", color: "#7c3aed" },
        { a: "lock", b: "key", result: "padlock", color: "#475569" },
        { a: "ink", b: "pad", result: "inkpad", color: "#db2777" },
        { a: "air", b: "port", result: "airport", color: "#0284c7" },
        { a: "school", b: "bag", result: "schoolbag", color: "#059669" },
        { a: "fire", b: "wood", result: "bonfire", color: "#f97316" },
        { a: "rain", b: "bow", result: "rainbow", color: "#a855f7" },
        { a: "sun", b: "flower", result: "sunflower", color: "#eab308" },
        { a: "book", b: "shelf", result: "bookshelf", color: "#0f766e" },
        { a: "back", b: "pack", result: "backpack", color: "#2563eb" },
        { a: "class", b: "room", result: "classroom", color: "#16a34a" },
        { a: "snow", b: "ball", result: "snowball", color: "#0369a1" },
        { a: "chalk", b: "board", result: "chalkboard", color: "#334155" },
        { a: "binary", b: "digit", result: "bit", color: "#2563eb" },
        { a: "picture", b: "element", result: "pixel", color: "#4f46e5" },
        { a: "cyber", b: "organism", result: "cyborg", color: "#7c3aed" },
        { a: "education", b: "entertainment", result: "edutainment", color: "#0d9488" },
        { a: "friend", b: "enemy", result: "frenemy", color: "#dc2626" },
        { a: "hungry", b: "angry", result: "hangry", color: "#ea580c" },
        { a: "camera", b: "recorder", result: "camcorder", color: "#0284c7" },
        { a: "helicopter", b: "airport", result: "heliport", color: "#0369a1" },
        { a: "stay", b: "vacation", result: "staycation", color: "#16a34a" },
        { a: "work", b: "vacation", result: "workation", color: "#059669" },
        { a: "information", b: "commercial", result: "infomercial", color: "#d97706" },
        { a: "documentary", b: "drama", result: "docudrama", color: "#9333ea" },
        { a: "vegetable", b: "food", result: "veggie", color: "#15803d" },
        { a: "chocolate", b: "alcoholic", result: "chocoholic", color: "#78350f" },
        { a: "work", b: "alcoholic", result: "workaholic", color: "#1e293b" },
        { a: "romantic", b: "comedy", result: "romcom", color: "#e11d48" },
        { a: "situation", b: "comedy", result: "sitcom", color: "#c026d3" },
        { a: "mock", b: "documentary", result: "mockumentary", color: "#6d28d9" },
        { a: "internet", b: "citizen", result: "netizen", color: "#0891b2" },
        { a: "breath", b: "analyzer", result: "breathalyzer", color: "#0f766e" },
        { a: "guess", b: "estimate", result: "guesstimate", color: "#b45309" },
        { a: "splash", b: "spatter", result: "splatter", color: "#ea580c" },
        { a: "clap", b: "crash", result: "clash", color: "#dc2626" },
        { a: "smack", b: "mash", result: "smash", color: "#be123c" },
        { a: "twist", b: "whirl", result: "twirl", color: "#7e22ce" },
        { a: "scald", b: "torch", result: "scorch", color: "#c2410c" },
        { a: "flutter", b: "hurry", result: "flurry", color: "#0284c7" },
        { a: "gleam", b: "shimmer", result: "glimmer", color: "#ca8a04" },
        { a: "flame", b: "flare", result: "flamelare", color: "#ef4444" },
        { a: "spark", b: "ark", result: "sparkle", color: "#f59e0b" },
        { a: "star", b: "burst", result: "starburst", color: "#eab308" },
        { a: "moon", b: "light", result: "moonlight", color: "#4338ca" },
        { a: "sun", b: "shine", result: "sunshine", color: "#facc15" },
        { a: "day", b: "dream", result: "daydream", color: "#38bdf8" },
        { a: "night", b: "mare", result: "nightmare", color: "#312e81" },
        { a: "foot", b: "ball", result: "football", color: "#16a34a" },
        { a: "basket", b: "ball", result: "basketball", color: "#ea580c" },
        { a: "base", b: "ball", result: "baseball", color: "#2563eb" },
        { a: "key", b: "board", result: "keyboard", color: "#334155" },
        { a: "cup", b: "cake", result: "cupcake", color: "#ec4899" },
        { a: "pan", b: "cake", result: "pancake", color: "#d97706" },
        { a: "butter", b: "fly", result: "butterfly", color: "#a855f7" },
        { a: "dragon", b: "fly", result: "dragonfly", color: "#0d9488" },
        { a: "fire", b: "fly", result: "firefly", color: "#eab308" },
        { a: "gold", b: "fish", result: "goldfish", color: "#f97316" },
        { a: "star", b: "fish", result: "starfish", color: "#e11d48" },
        { a: "jelly", b: "fish", result: "jellyfish", color: "#c026d3" },
        { a: "sea", b: "horse", result: "seahorse", color: "#0284c7" },
        { a: "head", b: "phone", result: "headphone", color: "#4f46e5" },
        { a: "ear", b: "phone", result: "earphone", color: "#0891b2" },
        { a: "smart", b: "phone", result: "smartphone", color: "#2563eb" },
        { a: "lap", b: "top", result: "laptop", color: "#475569" },
        { a: "desk", b: "top", result: "desktop", color: "#1e293b" },
        { a: "water", b: "melon", result: "watermelon", color: "#16a34a" },
        { a: "pine", b: "apple", result: "pineapple", color: "#eab308" },
        { a: "straw", b: "berry", result: "strawberry", color: "#e11d48" },
        { a: "blue", b: "berry", result: "blueberry", color: "#2563eb" },
        { a: "black", b: "berry", result: "blackberry", color: "#312e81" },
        { a: "rasp", b: "berry", result: "raspberry", color: "#db2777" },
        { a: "pop", b: "corn", result: "popcorn", color: "#f59e0b" },
        { a: "hot", b: "dog", result: "hotdog", color: "#dc2626" },
        { a: "milk", b: "shake", result: "milkshake", color: "#ec4899" },
        { a: "ice", b: "cream", result: "ice cream", color: "#06b6d4" },
        { a: "cheese", b: "burger", result: "cheeseburger", color: "#d97706" },
        { a: "sand", b: "wich", result: "sandwich", color: "#ca8a04" },
        { a: "tea", b: "pot", result: "teapot", color: "#0d9488" },
        { a: "coffee", b: "pot", result: "coffeepot", color: "#78350f" },
        { a: "flower", b: "pot", result: "flowerpot", color: "#16a34a" },
        { a: "tooth", b: "brush", result: "toothbrush", color: "#0ea5e9" },
        { a: "tooth", b: "paste", result: "toothpaste", color: "#10b981" },
        { a: "hair", b: "brush", result: "hairbrush", color: "#9333ea" },
        { a: "paint", b: "brush", result: "paintbrush", color: "#f97316" },
        { a: "rain", b: "coat", result: "raincoat", color: "#eab308" },
        { a: "over", b: "coat", result: "overcoat", color: "#475569" },
        { a: "neck", b: "lace", result: "necklace", color: "#ec4899" },
        { a: "shoe", b: "lace", result: "shoelace", color: "#334155" },
        { a: "book", b: "mark", result: "bookmark", color: "#8b5cf6" },
        { a: "land", b: "mark", result: "landmark", color: "#0284c7" },
        { a: "post", b: "card", result: "postcard", color: "#2563eb" },
        { a: "birth", b: "day", result: "birthday", color: "#f43f5e" },
        { a: "holi", b: "day", result: "holiday", color: "#10b981" },
        { a: "week", b: "end", result: "weekend", color: "#6366f1" },
        { a: "mid", b: "night", result: "midnight", color: "#1e1b4b" },
        { a: "sun", b: "rise", result: "sunrise", color: "#f97316" },
        { a: "sun", b: "set", result: "sunset", color: "#e11d48" },
        { a: "wild", b: "fire", result: "wildfire", color: "#ef4444" },
        { a: "camp", b: "fire", result: "campfire", color: "#ea580c" },
        { a: "snow", b: "flake", result: "snowflake", color: "#0284c7" },
        { a: "snow", b: "storm", result: "snowstorm", color: "#0369a1" },
        { a: "thunder", b: "storm", result: "thunderstorm", color: "#4338ca" },
        { a: "sand", b: "storm", result: "sandstorm", color: "#d97706" },
        { a: "earth", b: "quake", result: "earthquake", color: "#78350f" },
        { a: "water", b: "fall", result: "waterfall", color: "#0891b2" },
        { a: "rain", b: "drop", result: "raindrop", color: "#0ea5e9" },
        { a: "tear", b: "drop", result: "teardrop", color: "#2563eb" },
        { a: "eye", b: "brow", result: "eyebrow", color: "#78350f" },
        { a: "eye", b: "lash", result: "eyelash", color: "#1e293b" },
        { a: "eye", b: "ball", result: "eyeball", color: "#475569" },
        { a: "finger", b: "print", result: "fingerprint", color: "#4f46e5" },
        { a: "foot", b: "print", result: "footprint", color: "#0d9488" },
        { a: "blue", b: "print", result: "blueprint", color: "#1d4ed8" },
        { a: "head", b: "line", result: "headline", color: "#334155" },
        { a: "dead", b: "line", result: "deadline", color: "#dc2626" },
        { a: "time", b: "line", result: "timeline", color: "#059669" },
        { a: "home", b: "work", result: "homework", color: "#7c3aed" },
        { a: "class", b: "work", result: "classwork", color: "#2563eb" },
        { a: "team", b: "work", result: "teamwork", color: "#16a34a" },
        { a: "fire", b: "work", result: "firework", color: "#f59e0b" },
        { a: "bed", b: "room", result: "bedroom", color: "#8b5cf6" },
        { a: "bath", b: "room", result: "bathroom", color: "#06b6d4" },
        { a: "living", b: "room", result: "living room", color: "#10b981" },
        { a: "dining", b: "room", result: "dining room", color: "#d97706" },
        { a: "play", b: "ground", result: "playground", color: "#22c55e" },
        { a: "back", b: "ground", result: "background", color: "#475569" },
        { a: "under", b: "ground", result: "underground", color: "#1e293b" },
        { a: "up", b: "stairs", result: "upstairs", color: "#6366f1" },
        { a: "down", b: "stairs", result: "downstairs", color: "#0284c7" },
        { a: "in", b: "side", result: "inside", color: "#0d9488" },
        { a: "out", b: "side", result: "outside", color: "#16a34a" },
        { a: "every", b: "where", result: "everywhere", color: "#9333ea" },
        { a: "some", b: "where", result: "somewhere", color: "#3b82f6" },
        { a: "no", b: "where", result: "nowhere", color: "#64748b" },
        { a: "any", b: "body", result: "anybody", color: "#ec4899" },
        { a: "some", b: "body", result: "somebody", color: "#f97316" },
        { a: "every", b: "body", result: "everybody", color: "#eab308" },
        { a: "sun", b: "glasses", result: "sunglasses", color: "#1e293b" },
        { a: "eye", b: "glasses", result: "eyeglasses", color: "#0284c7" },
        { a: "door", b: "bell", result: "doorbell", color: "#d97706" },
        { a: "blue", b: "bell", result: "bluebell", color: "#3b82f6" },
        { a: "clock", b: "work", result: "clockwork", color: "#b45309" },
        { a: "net", b: "work", result: "network", color: "#0891b2" },
        { a: "pass", b: "word", result: "password", color: "#4f46e5" },
        { a: "key", b: "word", result: "keyword", color: "#059669" },
        { a: "cross", b: "word", result: "crossword", color: "#7c3aed" },
        { a: "back", b: "bone", result: "backbone", color: "#334155" },
        { a: "wish", b: "bone", result: "wishbone", color: "#f59e0b" },
        { a: "camp", b: "site", result: "campsite", color: "#15803d" },
        { a: "web", b: "site", result: "website", color: "#2563eb" },
        { a: "light", b: "house", result: "lighthouse", color: "#eab308" },
        { a: "green", b: "house", result: "greenhouse", color: "#16a34a" },
        { a: "tree", b: "house", result: "treehouse", color: "#854d0e" },
        { a: "ware", b: "house", result: "warehouse", color: "#475569" },
        { a: "snow", b: "man", result: "snowman", color: "#0284c7" },
        { a: "fire", b: "man", result: "fireman", color: "#dc2626" },
        { a: "post", b: "man", result: "postman", color: "#2563eb" },
        { a: "fisher", b: "man", result: "fisherman", color: "#0891b2" },
        { a: "super", b: "hero", result: "superhero", color: "#e11d48" },
        { a: "super", b: "star", result: "superstar", color: "#facc15" },
        { a: "super", b: "market", result: "supermarket", color: "#10b981" },
        { a: "book", b: "store", result: "bookstore", color: "#8b5cf6" },
        { a: "drug", b: "store", result: "drugstore", color: "#0d9488" },
        { a: "rain", b: "forest", result: "rainforest", color: "#15803d" },
        { a: "sea", b: "shore", result: "seashore", color: "#0284c7" },
        { a: "sea", b: "shell", result: "seashell", color: "#f43f5e" },
        { a: "egg", b: "shell", result: "eggshell", color: "#d97706" },
        { a: "nut", b: "shell", result: "nutshell", color: "#78350f" },
        { a: "moon", b: "beam", result: "moonbeam", color: "#6366f1" },
        { a: "sun", b: "beam", result: "sunbeam", color: "#eab308" },
        { a: "star", b: "light", result: "starlight", color: "#a855f7" },
        { a: "flash", b: "light", result: "flashlight", color: "#f59e0b" },
        { a: "spot", b: "light", result: "spotlight", color: "#ef4444" },
        { a: "sky", b: "scraper", result: "skyscraper", color: "#0369a1" },
        { a: "wind", b: "mill", result: "windmill", color: "#0d9488" },
        { a: "saw", b: "mill", result: "sawmill", color: "#92400e" },
        { a: "earth", b: "worm", result: "earthworm", color: "#78350f" },
        { a: "book", b: "worm", result: "bookworm", color: "#7c3aed" },
        { a: "ring", b: "worm", result: "ringworm", color: "#be123c" },
        { a: "honey", b: "bee", result: "honeybee", color: "#eab308" },
        { a: "bumble", b: "bee", result: "bumblebee", color: "#f59e0b" },
        { a: "lady", b: "bug", result: "ladybug", color: "#dc2626" },
        { a: "bed", b: "bug", result: "bedbug", color: "#991b1b" },
        { a: "hum", b: "bird", result: "hummingbird", color: "#059669" },
        { a: "mocking", b: "bird", result: "mockingbird", color: "#4f46e5" },
        { a: "blue", b: "jay", result: "bluejay", color: "#2563eb" },
        { a: "black", b: "bird", result: "blackbird", color: "#1e293b" },
        { a: "wood", b: "pecker", result: "woodpecker", color: "#92400e" },
        { a: "bull", b: "frog", result: "bullfrog", color: "#16a34a" },
        { a: "tree", b: "frog", result: "treefrog", color: "#059669" },
        { a: "grey", b: "hound", result: "greyhound", color: "#475569" },
        { a: "blood", b: "hound", result: "bloodhound", color: "#991b1b" },
        { a: "watch", b: "dog", result: "watchdog", color: "#334155" },
        { a: "bull", b: "dog", result: "bulldog", color: "#78350f" },
        { a: "wild", b: "cat", result: "wildcat", color: "#d97706" },
        { a: "bob", b: "cat", result: "bobcat", color: "#b45309" },
        { a: "pole", b: "cat", result: "polecat", color: "#4b5563" },
        { a: "race", b: "horse", result: "racehorse", color: "#dc2626" },
        { a: "war", b: "horse", result: "warhorse", color: "#7f1d1d" },
        { a: "work", b: "horse", result: "workhorse", color: "#475569" },
        { a: "thunder", b: "bolt", result: "thunderbolt", color: "#4338ca" },
        { a: "light", b: "bolt", result: "lightbolt", color: "#eab308" },
        { a: "cross", b: "road", result: "crossroad", color: "#334155" },
        { a: "rail", b: "road", result: "railroad", color: "#1e293b" },
        { a: "high", b: "way", result: "highway", color: "#0284c7" },
        { a: "sub", b: "way", result: "subway", color: "#0f766e" },
        { a: "path", b: "way", result: "pathway", color: "#16a34a" },
        { a: "side", b: "walk", result: "sidewalk", color: "#64748b" },
        { a: "cat", b: "walk", result: "catwalk", color: "#ec4899" },
        { a: "moon", b: "walk", result: "moonwalk", color: "#6366f1" },
        { a: "head", b: "ache", result: "headache", color: "#dc2626" },
        { a: "tooth", b: "ache", result: "toothache", color: "#e11d48" },
        { a: "stomach", b: "ache", result: "stomachache", color: "#ea580c" },
        { a: "heart", b: "beat", result: "heartbeat", color: "#f43f5e" },
        { a: "drum", b: "beat", result: "drumbeat", color: "#d97706" },
        { a: "up", b: "beat", result: "upbeat", color: "#10b981" }
    ],

    // Stage 2: Big Bubble + Small Bubble -> Shows result & pops (+20 pts)
    bigEliminations: {
        "ice": ["fire", "sun", "water", "wind"],
        "born": ["new", "life", "baby", "day"],
        "smog": ["wind", "rain", "air", "smoke"],
        "brunch": ["breakfast", "lunch", "morning", "day"],
        "motel": ["motor", "road", "highway", "stay"],
        "spork": ["spoon", "fork", "food", "eat"],
        "chortle": ["chuckle", "laugh", "snort", "joy"],
        "podcast": ["ipod", "broadcast", "mic", "audio"],
        "whiteboard": ["school", "classroom", "pen", "chalk"],
        "ballpen": ["paper", "notebook", "ink", "school"],
        "paper napkin": ["water", "food", "table", "paper"],
        "toilet paper": ["water", "bathroom", "paper", "clean"],
        "mud": ["water", "rain", "earth", "sun"],
        "lava": ["water", "ice", "earth", "fire"],
        "notebook": ["pen", "school", "book", "paper"],
        "padlock": ["lock", "key", "door", "safe"],
        "inkpad": ["ink", "paper", "pen", "stamp"],
        "airport": ["air", "sky", "plane", "way"],
        "schoolbag": ["school", "book", "notebook", "bag"],
        "bonfire": ["water", "wind", "fire", "wood"],
        "rainbow": ["sun", "rain", "sky", "bow"],
        "sunflower": ["earth", "water", "sun", "flower"],
        "bookshelf": ["book", "school", "shelf", "read"],
        "backpack": ["school", "book", "bag", "pack"],
        "classroom": ["school", "board", "book", "class"],
        "snowball": ["fire", "sun", "snow", "ball"],
        "chalkboard": ["school", "classroom", "chalk", "board"]
    },

    // Stage 3: Big Bubble + Big Bubble -> Shows mega blast result & pops (+50 pts)
    bigComboPairs: [
        ["ice", "lava"],
        ["smog", "rainbow"],
        ["brunch", "ice cream"],
        ["whiteboard", "classroom"],
        ["whiteboard", "chalkboard"],
        ["ballpen", "notebook"],
        ["mud", "lava"],
        ["paper napkin", "toilet paper"],
        ["schoolbag", "backpack"],
        ["schoolbag", "notebook"],
        ["backpack", "notebook"],
        ["bookshelf", "classroom"],
        ["bonfire", "snowball"],
        ["rainbow", "sunflower"],
        ["airport", "backpack"],
        ["sunrise", "sunset"],
        ["moonlight", "sunshine"],
        ["thunderstorm", "rainbow"]
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
        if (document.getElementById('combimental-container')) return;

        const mobile = this.isMobile();
        const dangerTop = mobile ? 68 : 86;
        const floorBottom = mobile ? 70 : 32;
        const floorHeight = mobile ? 14 : 16;

        const container = document.createElement('div');
        container.id = 'combimental-container';
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
            <div id="cbb-hud" style="display: flex; justify-content: space-between; align-items: center; padding: ${hudPadding}; font-size: ${hudFontSize}; font-weight: 800; background: #ffffff; border-bottom: 2px solid #e2e8f0; gap: 8px;">
                <div id="cbb-score" style="white-space: nowrap; color: #0f172a;">SCORE: 0</div>
                <div id="cbb-selected-hint" style="font-size: ${mobile ? '12px' : '15px'}; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 4px 12px; border-radius: 999px; border: 1px solid #bfdbfe; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: ${mobile ? '130px' : '260px'};">
                    Tap settled bubbles
                </div>
                <div id="cbb-level" style="white-space: nowrap; color: #0f172a;">LEVEL: 1</div>
                <div style="display: flex; gap: 6px;">
                    <button id="cbb-pause-btn" style="padding: ${btnPadding}; font-size: ${btnFontSize}; background: #f39c12; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; touch-action: manipulation;">Pause</button>
                    <button id="cbb-exit-btn" style="padding: ${btnPadding}; font-size: ${btnFontSize}; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; touch-action: manipulation;">Exit</button>
                </div>
            </div>
            <div id="cbb-playfield" style="position: relative; width: 100%; height: calc(100dvh - ${mobile ? '62px' : '78px'}); overflow: hidden; background: #ffffff; touch-action: none;">
                <!-- Clean Black Box Enclosure -->
                <div id="cbb-chamber-box" style="position: absolute; top: ${dangerTop}px; bottom: ${floorBottom + floorHeight}px; left: ${mobile ? '16%' : '20%'}; right: ${mobile ? '4%' : '4%'}; border-left: 3px solid #000000; border-right: 3px solid #000000; background: #ffffff; pointer-events: none; z-index: 2;"></div>

                <!-- Top Danger Line -->
                <div id="cbb-danger-line" style="position: absolute; top: ${dangerTop}px; left: ${mobile ? '16%' : '20%'}; right: ${mobile ? '4%' : '4%'}; border-top: 3px solid #000000; pointer-events: none; z-index: 5; transition: border-color 0.2s;">
                    <span style="position: absolute; right: 6px; top: -19px; font-size: 11px; font-weight: 800; color: #000000; letter-spacing: 0.5px;">DANGER LINE</span>
                </div>

                <!-- Left Character Sprite Zone -->
                <div id="cbb-mascot-zone" style="position: absolute; bottom: ${mobile ? '104px' : '72px'}; left: ${mobile ? '6px' : '28px'}; width: ${mobile ? '56px' : '130px'}; display: flex; flex-direction: column; align-items: center; pointer-events: none; z-index: 4;">
                    <div id="cbb-mascot-emoji" style="font-size: ${mobile ? '40px' : '70px'}; transition: transform 0.2s;">👩‍🏫</div>
                </div>

                <!-- Black Ground Platform Base -->
                <div id="cbb-floor" style="position: absolute; bottom: ${floorBottom}px; left: ${mobile ? '16%' : '20%'}; right: ${mobile ? '4%' : '4%'}; height: ${floorHeight}px; background: #000000; border-top: 3px solid #000000; border-radius: 0 0 6px 6px; pointer-events: none; z-index: 4;"></div>
            </div>
        `;
        document.body.appendChild(container);

        if (!document.getElementById('cbb-wiggle-style')) {
            const style = document.createElement('style');
            style.id = 'cbb-wiggle-style';
            style.textContent = `
                @keyframes cbbBubbleWiggle {
                    0%   { transform: scale(1.12, 0.86); }
                    25%  { transform: scale(0.92, 1.09) rotate(-3deg); }
                    50%  { transform: scale(1.06, 0.94) rotate(3deg); }
                    75%  { transform: scale(0.98, 1.02) rotate(-1.5deg); }
                    100% { transform: scale(1, 1) rotate(0deg); }
                }
                .cbb-wiggle-anim {
                    animation: cbbBubbleWiggle 0.42s ease-out;
                }
                @keyframes cbbPrePopPulse {
                    0%   { transform: scale(1); }
                    50%  { transform: scale(1.24); }
                    100% { transform: scale(0.2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        const playfield = document.getElementById('cbb-playfield');
        playfield.addEventListener('pointerdown', (e) => {
            if (!this.isGameRunning || this.isPaused) return;
            if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;

            let bestBubble = null;
            let bestDist = Infinity;

            for (let i = 0; i < this.bubbles.length; i++) {
                const b = this.bubbles[i];
                if (b.popping) continue;
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
        gameOverModal.id = 'cbb-game-over-modal';
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
                <div id="cbb-final-score" style="font-size: 42px; font-weight: bold; color: #2c3e50; margin-bottom: 24px;">0</div>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="cbb-play-again-btn" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Play Again</button>
                    <button id="cbb-go-exit-btn" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Main Menu</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameOverModal);

        document.getElementById('cbb-play-again-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            document.getElementById('combimental-container').style.display = 'block';
            this.lockZoom();
            this.startGame();
        });

        document.getElementById('cbb-go-exit-btn').addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            this.unlockZoom();
        });

        document.getElementById('cbb-exit-btn').addEventListener('click', () => this.endGameManually());
        document.getElementById('cbb-pause-btn').addEventListener('click', () => this.togglePause());
    },

    showInstructions(onStartCallback) {
        this.init();

        let modal = document.getElementById('cbb-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'cbb-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;
                background: rgba(0,0,0,0.7); z-index: 10000; display: flex;
                align-items: center; justify-content: center;
                user-select: none; -webkit-user-select: none; touch-action: manipulation;
            `;
            modal.innerHTML = `
                <div style="background: #fff; color: #333; padding: 28px; border-radius: 12px; width: 470px; max-width: 92%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                    <h2 style="margin-top: 0; color: #2c3e50;">Combimental Bubble Blast University</h2>
                    <p style="font-size: 14px; line-height: 1.55; color: #475569; text-align: left;">
                        Combine two <strong>settled</strong> word bubbles inside the box to form blended or compound words before bubbles reach the top <strong>Danger Line</strong>!
                        <br><br>• <strong>Word 1 + Word 2 = Combined Bubble (+10 pts):</strong> e.g., <em>wind + water = ice</em>, <em>new + born = born</em>.
                        <br>• <strong>Combined + Matching Word = Pop! (+20 pts):</strong> Reveals the result right on the bubble before it pops!
                        <br>• <strong>Combined + Combined = Mega Pop! (+50 pts):</strong> Shows the mega result before blasting both bubbles!
                        <br>• Level advances every <strong>200 points</strong>!
                    </p>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                        <button id="cbb-start-game-btn" style="padding: 10px 26px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">GAME</button>
                        <button id="cbb-cancel-modal-btn" style="padding: 10px 26px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">CANCEL</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('cbb-start-game-btn').addEventListener('click', () => {
                modal.style.display = 'none';
                document.getElementById('combimental-container').style.display = 'block';
                this.lockZoom();
                this.startGame();
                if (onStartCallback) onStartCallback();
            });

            document.getElementById('cbb-cancel-modal-btn').addEventListener('click', () => {
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
        this.recentWords = [];
        this.isGameRunning = true;
        this.isPaused = false;
        this.spawnTimer = 0;
        this.dangerGraceFrames = 0;

        document.getElementById('cbb-pause-btn').textContent = 'Pause';
        document.getElementById('cbb-pause-btn').style.background = '#f39c12';

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'none';

        const pauseOverlay = document.getElementById('cbb-pause-overlay');
        if (pauseOverlay) pauseOverlay.remove();

        const playfield = document.getElementById('cbb-playfield');
        playfield.querySelectorAll('.cbb-bubble-node').forEach(el => el.remove());

        this.updateHUD();
        this.updateHint("Tap settled bubbles");
        this.seedStarterBubbles();

        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.lastTime = performance.now();
        this.animationFrameLoop(this.lastTime);
    },

    getPlayZoneBounds() {
        const playfield = document.getElementById('cbb-playfield');
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
        const starterWords = ["wind", "water", "new", "born", "smoke", "fog", "white"];
        const usableW = Math.max(60, rightBound - leftBound - r * 2);
        const step = usableW / Math.max(1, starterWords.length - 1);

        starterWords.forEach((word, idx) => {
            const x = leftBound + r + idx * step;
            const y = floorY - r;
            const b = this.createBubble(word, false, x, y);
            b.settled = true;
            b.vy = 0;
            this.recentWords.push(word);
            this.triggerBubbleWiggle(b);
        });
    },

    triggerBubbleWiggle(bubble) {
        if (!bubble || !bubble.element || bubble.popping) return;
        bubble.element.classList.remove('cbb-wiggle-anim');
        void bubble.element.offsetWidth;
        bubble.element.classList.add('cbb-wiggle-anim');
    },

    pickSmartNextWord() {
        const smallOnBoard = this.bubbles.filter(b => !b.isBig && !b.popping).map(b => b.word);
        const bigOnBoard = this.bubbles.filter(b => b.isBig && !b.popping).map(b => b.word);
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

        const filtered = candidatePool.filter(w => !this.recentWords.includes(w));
        const chosen = filtered.length > 0
            ? filtered[Math.floor(Math.random() * filtered.length)]
            : candidatePool[Math.floor(Math.random() * candidatePool.length)];

        this.recentWords.push(chosen);
        if (this.recentWords.length > 8) this.recentWords.shift();
        return chosen;
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
        const playfield = document.getElementById('cbb-playfield');
        const radius = isBig ? this.getBigRadius() : this.getSmallRadius();
        const textColor = this.getWordAccentColor(word, isBig);

        const el = document.createElement('div');
        el.className = 'cbb-bubble-node';
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
            will-change: left, top, transform, opacity;
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
            popping: false,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.04,
            swayAmp: 0.4,
            element: el
        };

        this.bubbles.push(bubbleObj);
        return bubbleObj;
    },

    handleBubbleTap(bubble) {
        if (!bubble.settled || bubble.popping) {
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
                return {
                    type: 'ELIMINATE_BIG_SMALL',
                    resultLabel: `${bigB.word} + ${smallB.word} → ${bigB.word}`,
                    points: 20
                };
            }
            return null;
        }

        if (b1.isBig && b2.isBig) {
            const isCombo = this.bigComboPairs.some(([w1, w2]) =>
                (w1 === b1.word && w2 === b2.word) ||
                (w1 === b2.word && w2 === b1.word)
            );
            if (isCombo) {
                return {
                    type: 'ELIMINATE_BIG_BIG',
                    resultLabel: `${b1.word} + ${b2.word}`,
                    points: 50
                };
            }
            return null;
        }

        return null;
    },

    revealResultBeforePop(bubble, labelText, accentColor, onDone) {
        if (!bubble || !bubble.element) {
            if (onDone) onDone();
            return;
        }
        bubble.popping = true;
        bubble.settled = false;
        bubble.element.textContent = labelText;
        bubble.element.style.background = 'radial-gradient(circle at 30% 28%, #ffffff 0%, #fef08a 75%, #fde047 100%)';
        bubble.element.style.borderColor = accentColor;
        bubble.element.style.color = '#0f172a';
        bubble.element.style.zIndex = 30;
        bubble.element.style.transform = 'scale(1.18)';

        setTimeout(() => {
            if (bubble && bubble.element) {
                bubble.element.style.animation = 'cbbPrePopPulse 0.22s ease-in forwards';
            }
            setTimeout(() => {
                this.removeBubble(bubble);
                if (onDone) onDone();
            }, 220);
        }, 460);
    },

    executeCombination(b1, b2, result) {
        const targetX = b2.x;
        const targetY = b2.y;

        this.score += result.points;
        this.level = Math.floor(this.score / 200) + 1;
        this.updateHUD();
        this.celebrateMascot();

        if (result.type === 'MERGE_TO_BIG') {
            this.removeBubble(b1);
            this.removeBubble(b2);
            this.createFloatingPop(targetX, targetY - 20, `${result.newWord.toUpperCase()}! +10`, '#2563eb');
            const bigBubble = this.createBubble(result.newWord, true, targetX, targetY);
            bigBubble.settled = true;
            bigBubble.vy = 0;
            this.triggerBubbleWiggle(bigBubble);
        } else if (result.type === 'ELIMINATE_BIG_SMALL') {
            const bigB = b1.isBig ? b1 : b2;
            const smallB = b1.isBig ? b2 : b1;
            this.removeBubble(smallB);
            this.createFloatingPop(bigB.x, bigB.y - 28, `${result.resultLabel.toUpperCase()} (+20)`, '#059669');
            this.revealResultBeforePop(bigB, bigB.word.toUpperCase(), '#059669', () => {
                this.createBurstRing(targetX, targetY, '#10b981');
            });
        } else if (result.type === 'ELIMINATE_BIG_BIG') {
            this.createFloatingPop(targetX, targetY - 30, `MEGA: ${result.resultLabel.toUpperCase()} (+50)`, '#d97706');
            this.revealResultBeforePop(b1, b1.word.toUpperCase(), '#d97706', () => {
                this.createBurstRing(b1.x, b1.y, '#f59e0b');
            });
            this.revealResultBeforePop(b2, b2.word.toUpperCase(), '#d97706', () => {
                this.createBurstRing(b2.x, b2.y, '#f59e0b');
            });
        }

        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            if (!b.popping) {
                b.settledFrames = 0;
                if (b.vy < 1.1) b.vy = 1.1;
            }
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
        const mascot = document.getElementById('cbb-mascot-emoji');
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
        const playfield = document.getElementById('cbb-playfield');
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
        const playfield = document.getElementById('cbb-playfield');
        if (!playfield) return;
        const pop = document.createElement('div');
        pop.textContent = text;
        pop.style.cssText = `
            position: absolute; left: ${Math.max(20, x - 75)}px; top: ${Math.max(20, y)}px;
            color: ${color}; font-weight: 900; font-size: 15px;
            text-shadow: 0 2px 6px rgba(255,255,255,0.95);
            pointer-events: none; z-index: 35;
            transition: transform 0.65s ease-out, opacity 0.65s ease-out;
        `;
        playfield.appendChild(pop);
        requestAnimationFrame(() => {
            pop.style.transform = 'translateY(-28px)';
            pop.style.opacity = '0';
        });
        setTimeout(() => pop.remove(), 660);
    },

    stepPhysics() {
        const { leftBound, rightBound, floorY } = this.getPlayZoneBounds();
        const floatSpeed = Math.min(2.2, 1.2 + (this.level - 1) * 0.12);

        for (let i = 0; i < this.bubbles.length; i++) {
            const b = this.bubbles[i];
            if (b.popping) continue;

            const prevX = b.x;
            const prevY = b.y;

            const touchingFloor = (b.y + b.radius) >= (floorY - 1.5);
            const supportedBelow = this.bubbles.some((other, idx) => {
                if (idx === i || other.popping) return false;
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

        for (let iter = 0; iter < 5; iter++) {
            for (let i = 0; i < this.bubbles.length; i++) {
                if (this.bubbles[i].popping) continue;
                for (let j = i + 1; j < this.bubbles.length; j++) {
                    if (this.bubbles[j].popping) continue;
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
            if (b.popping) continue;

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

        const dangerLineEl = document.getElementById('cbb-danger-line');
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
        const pauseBtn = document.getElementById('cbb-pause-btn');
        const playfield = document.getElementById('cbb-playfield');

        if (this.isPaused) {
            pauseBtn.textContent = 'Resume';
            pauseBtn.style.background = '#27ae60';
            this.bubbles.forEach(b => b.element.style.visibility = 'hidden');

            let pauseOverlay = document.getElementById('cbb-pause-overlay');
            if (!pauseOverlay) {
                pauseOverlay = document.createElement('div');
                pauseOverlay.id = 'cbb-pause-overlay';
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

            const pauseOverlay = document.getElementById('cbb-pause-overlay');
            if (pauseOverlay) pauseOverlay.style.display = 'none';
        }
    },

    updateHUD() {
        document.getElementById('cbb-score').textContent = `SCORE: ${this.score}`;
        document.getElementById('cbb-level').textContent = `LEVEL: ${this.level}`;
    },

    updateHint(msg) {
        const hintEl = document.getElementById('cbb-selected-hint');
        if (hintEl) hintEl.textContent = msg;
    },

    triggerGameOver() {
        this.isGameRunning = false;
        this.unlockZoom();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'block';

        const playfield = document.getElementById('cbb-playfield');
        if (playfield) {
            playfield.querySelectorAll('.cbb-bubble-node').forEach(el => el.remove());
            const pauseOverlay = document.getElementById('cbb-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
        }

        document.getElementById('combimental-container').style.display = 'none';
        document.getElementById('cbb-final-score').textContent = this.score;
        document.getElementById('cbb-game-over-modal').style.display = 'flex';
    },

    endGameManually() {
        this.isGameRunning = false;
        this.unlockZoom();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        const dashExitBtn = document.getElementById('exit-to-welcome-btn');
        if (dashExitBtn) dashExitBtn.style.display = 'block';

        const playfield = document.getElementById('cbb-playfield');
        if (playfield) {
            playfield.querySelectorAll('.cbb-bubble-node').forEach(el => el.remove());
            const pauseOverlay = document.getElementById('cbb-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
        }

        document.getElementById('combimental-container').style.display = 'none';
    }
};
