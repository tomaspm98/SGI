class MyClock {
    constructor() {
        this.startTime = 0;
        this.pauseTime = 0;
        this.timePaused = 0;
        this.isRunning = false;
    }

    start() {
        if (!this.isRunning) {
            this.startTime = performance.now();
            this.pauseTime = 0;
            this.timePaused = 0;
            this.isRunning = true;
        }
    }

    pause() {
        if (this.isRunning) {
            this.pauseTime = performance.now();
            this.isRunning = false;
        }
    }

    resume() {
        if (!this.isRunning) {
            this.timePaused += performance.now() - this.pauseTime;
            this.isRunning = true;
        }
    }

    getElapsedTime() {
        if (this.isRunning) {
            return performance.now() - this.startTime - this.timePaused
        } else {
            throw new Error("Clock is not running")
        }
    }

    reset() {
        this.startTime = 0;
        this.pauseTime = 0;
        this.timePaused = 0;
        this.isRunning = false;
    }
}

export {MyClock}