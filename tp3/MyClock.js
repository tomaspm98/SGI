class MyClock {
    /**
     * Creates an instance of MyClock.
     */
    constructor() {
        this.startTime = 0;
        this.pauseTime = 0;
        this.timePaused = 0;
        this.isRunning = false;
    }

    /**
     * Starts the clock.
     */
    start() {
        if (!this.isRunning) {
            this.startTime = performance.now();
            this.pauseTime = 0;
            this.timePaused = 0;
            this.isRunning = true;
        }
    }

    /**
     * Pauses the clock.
     */
    pause() {
        if (this.isRunning) {
            this.pauseTime = performance.now();
            this.isRunning = false;
        }
    }

    /**
     * Resumes the clock after being paused.
     */
    resume() {
        if (!this.isRunning) {
            this.timePaused += performance.now() - this.pauseTime;
            this.isRunning = true;
        }
    }

    /**
     * Gets the elapsed time in milliseconds.
     * @returns {number} The elapsed time.
     * @throws {Error} If the clock is not running.
     */
    getElapsedTime() {
        if (this.isRunning) {
            return performance.now() - this.startTime - this.timePaused
        } else {
            throw new Error("Clock is not running")
        }
    }

    /**
     * Resets the clock to its initial state.
     */
    reset() {
        this.startTime = 0;
        this.pauseTime = 0;
        this.timePaused = 0;
        this.isRunning = false;
    }
}

export {MyClock}