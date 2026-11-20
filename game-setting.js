// ==========================================
// SHARED SITE SIDEBAR & GAME SETTINGS
// ==========================================

const GameSettings = {
    storageKey: 'lacasamonde_game_settings_v1',
    state: {
        muted: false,
        sensitivityEnabled: true,
        sensitivityLevel: 50, // 0, 25, 50, 75, 100
        lastActiveLevel: 50
    },
    listeners: [],

    load() {
        try {
            const saved = JSON.parse(localStorage.getItem(this.storageKey) || 'null');
            if (saved && typeof saved === 'object') {
                this.state = { ...this.state, ...saved };
            }
        } catch (_) {}
        return this.state;
    },

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (_) {}
        this.notify();
    },

    onChange(fn) {
        if (typeof fn === 'function') this.listeners.push(fn);
    },

    notify() {
        this.listeners.forEach(fn => fn({ ...this.state }));
    },

    isMuted() {
        return Boolean(this.state.muted);
    },

    getEffectiveSensitivity() {
        if (!this.state.sensitivityEnabled) return 0;
        return Number(this.state.sensitivityLevel) || 0;
    },

    // Converts 0/25/50/75/100% into extra tap-zone padding around a target element
    getSensitivityPadding(rect) {
        const pct = this.getEffectiveSensitivity();
        const factor = (pct / 100) * 0.65; // up to +65% forgiving reach on each side at 100%
        return {
            padX: rect.width * factor,
            padY: Math.max(10, rect.height * (factor * 1.15))
        };
    },

    initUI() {
        this.load();

        const sidebar = document.getElementById('site-sidebar');
        const backdrop = document.getElementById('site-sidebar-backdrop');
        const openBtn = document.getElementById('site-sidebar-toggle');
        const closeBtn = document.getElementById('site-sidebar-close');
        const copyBtn = document.getElementById('sidebar-copy-email');
        const volBtn = document.getElementById('sidebar-volume-toggle');
        const volStatus = document.getElementById('sidebar-volume-status');
        const sensToggleBtn = document.getElementById('sidebar-sensitivity-toggle');
        const sensSlider = document.getElementById('sidebar-sensitivity-slider');
        const sensValue = document.getElementById('sidebar-sensitivity-value');
        const sensDesc = document.getElementById('sidebar-sensitivity-desc');

        if (!sidebar) return;

        const setOpen = (isOpen) => {
            sidebar.style.right = isOpen ? '0px' : '-320px';
            if (backdrop) backdrop.style.display = isOpen ? 'block' : 'none';
        };

        if (openBtn) openBtn.addEventListener('click', () => setOpen(true));
        if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
        if (backdrop) backdrop.addEventListener('click', () => setOpen(false));

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const email = 'lacasamonde@gmail.com';
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(email).catch(() => {});
                }
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
            });
        }

        const renderUI = () => {
            if (volBtn) {
                volBtn.textContent = this.state.muted ? 'OFF' : 'ON';
                volBtn.style.background = this.state.muted ? '#ef4444' : '#22c55e';
                volBtn.style.color = this.state.muted ? '#ffffff' : '#052e16';
            }
            if (volStatus) {
                volStatus.textContent = this.state.muted ? 'Volume Muted' : 'Volume On';
            }

            if (sensSlider) {
                sensSlider.value = String(this.state.sensitivityLevel);
                sensSlider.disabled = !this.state.sensitivityEnabled;
                sensSlider.style.opacity = this.state.sensitivityEnabled ? '1' : '0.45';
            }

            if (sensToggleBtn) {
                sensToggleBtn.textContent = this.state.sensitivityEnabled ? 'ACTIVE' : 'OFF';
                sensToggleBtn.style.background = this.state.sensitivityEnabled ? '#38bdf8' : '#475569';
                sensToggleBtn.style.color = this.state.sensitivityEnabled ? '#082f49' : '#f1f5f9';
            }

            const effective = this.getEffectiveSensitivity();
            if (sensValue) sensValue.textContent = `${effective}%`;
            if (sensDesc) {
                sensDesc.textContent = !this.state.sensitivityEnabled
                    ? 'Sensitivity assist turned off'
                    : effective === 0
                        ? 'Exact visual pill hit only'
                        : `${effective}% hit-zone assist`;
            }
        };

        if (volBtn) {
            volBtn.addEventListener('click', () => {
                this.state.muted = !this.state.muted;
                this.save();
                renderUI();
            });
        }

        if (sensToggleBtn) {
            sensToggleBtn.addEventListener('click', () => {
                if (this.state.sensitivityEnabled) {
                    if (this.state.sensitivityLevel > 0) {
                        this.state.lastActiveLevel = this.state.sensitivityLevel;
                    }
                    this.state.sensitivityEnabled = false;
                } else {
                    this.state.sensitivityEnabled = true;
                    if (this.state.sensitivityLevel === 0) {
                        this.state.sensitivityLevel = this.state.lastActiveLevel || 50;
                    }
                }
                this.save();
                renderUI();
            });
        }

        if (sensSlider) {
            sensSlider.addEventListener('input', (e) => {
                const val = Number(e.target.value);
                this.state.sensitivityLevel = val;
                if (val > 0) {
                    this.state.sensitivityEnabled = true;
                    this.state.lastActiveLevel = val;
                }
                this.save();
                renderUI();
            });
        }

        renderUI();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GameSettings.initUI();
});
