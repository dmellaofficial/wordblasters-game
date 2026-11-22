animationFrameLoop(timestamp) {
        if (!this.isGameRunning) return;

        const elapsed = Math.max(8, Math.min(34, timestamp - this.lastTime || 16));
        this.lastTime = timestamp;

        if (!this.isPaused) {
            this.spawnTimer += elapsed;
            const spawnIntervalMs = Math.max(2600, 5000 - (this.level - 1) * 180);

            if (this.spawnTimer >= spawnIntervalMs) {
                this.spawnTimer = 0;
                this.spawnFallingBubble();
            }

            this.stepPhysics();
        }

        this.animationFrameId = requestAnimationFrame((ts) => this.animationFrameLoop(ts));
    },
