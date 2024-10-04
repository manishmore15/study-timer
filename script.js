let mainTimer, intervalTimer, breakTimer;
let mainTimerInterval, intervalTimerInterval, breakTimerInterval;
let isMainTimerRunning = false;
let isIntervalTimerRunning = false;
let isBreakTimerRunning = false;
let wasMainTimerPaused = false;
let wasIntervalTimerPaused = false;
let wasBreakTimerPaused = false;

const notificationSound = new Audio('./sound/alarm-beep-34359.mp3');
notificationSound.volume = document.getElementById('volume-control').value;

document.getElementById('volume-control').addEventListener('input', function() {
    const volumeValue = this.value;
    notificationSound.volume = volumeValue;
    document.getElementById('volume-value').textContent = Math.round(volumeValue * 100) + '%';
});

function startTimers() {
    let studyHours = parseInt(document.getElementById("study-hours").value);
    let studyMinutes = parseInt(document.getElementById("study-minutes").value);
    let intervalMinutes = parseInt(document.getElementById("interval-minutes").value);
    let breakMinutes = parseInt(document.getElementById("break-minutes").value);

    mainTimer = (studyHours * 60 * 60) + (studyMinutes * 60);
    intervalTimer = intervalMinutes * 60;
    breakTimer = breakMinutes * 60;

    displayTime(mainTimer, "main-timer");
    displayTime(intervalTimer, "interval-timer");
    displayTime(breakTimer, "break-timer");

    document.getElementById("start-btn").classList.add("hidden");
    document.getElementById("pause-btn").classList.remove("hidden");

    startMainTimer();
    startIntervalTimer();
}

function startMainTimer() {
    if (isMainTimerRunning || isBreakTimerRunning) return;
    isMainTimerRunning = true;
    mainTimerInterval = setInterval(() => {
        if (mainTimer > 0) {
            mainTimer--;
            displayTime(mainTimer, "main-timer");
        } else {
            clearInterval(mainTimerInterval);
            document.getElementById("main-timer").textContent = "Study Complete!";
            isMainTimerRunning = false;
        }
    }, 1000);
}

function startIntervalTimer() {
    if (isIntervalTimerRunning || isBreakTimerRunning) return;
    isIntervalTimerRunning = true;
    intervalTimerInterval = setInterval(() => {
        if (intervalTimer > 0) {
            intervalTimer--;
            displayTime(intervalTimer, "interval-timer");
        } else {
            clearInterval(intervalTimerInterval);
            notificationSound.play(); // Play notification sound after interval
            document.getElementById("stop-sound-btn").classList.remove("hidden");
            isIntervalTimerRunning = false;
            startBreakTimer(); // Start break timer after interval completes
        }
    }, 1000);
}

function startBreakTimer() {
    if (isBreakTimerRunning) return;
    clearInterval(mainTimerInterval);
    clearInterval(intervalTimerInterval);
    isMainTimerRunning = false;
    isIntervalTimerRunning = false;

    isBreakTimerRunning = true;
    breakTimerInterval = setInterval(() => {
        if (breakTimer > 0) {
            breakTimer--;
            displayTime(breakTimer, "break-timer");
        } else {
            clearInterval(breakTimerInterval);
            notificationSound.play(); // Play notification sound after break
            document.getElementById("stop-sound-btn").classList.remove("hidden");
            isBreakTimerRunning = false;

            startMainTimer(); // Resume the main timer
            intervalTimer = parseInt(document.getElementById("interval-minutes").value) * 60; // Reset interval timer
            startIntervalTimer();  // Restart interval after break
        }
    }, 1000);
}

function pauseTimers() {
    if (isMainTimerRunning) {
        clearInterval(mainTimerInterval);
        wasMainTimerPaused = true;
        isMainTimerRunning = false;
    }
    if (isIntervalTimerRunning) {
        clearInterval(intervalTimerInterval);
        wasIntervalTimerPaused = true;
        isIntervalTimerRunning = false;
    }
    if (isBreakTimerRunning) {
        clearInterval(breakTimerInterval);
        wasBreakTimerPaused = true;
        isBreakTimerRunning = false;
    }

    document.getElementById("pause-btn").classList.add("hidden");
    document.getElementById("resume-btn").classList.remove("hidden");
}

function resumeTimers() {
    if (wasMainTimerPaused) {
        startMainTimer();
        wasMainTimerPaused = false;
    }
    if (wasIntervalTimerPaused) {
        startIntervalTimer();
        wasIntervalTimerPaused = false;
    }
    if (wasBreakTimerPaused) {
        startBreakTimer();
        wasBreakTimerPaused = false;
    }

    document.getElementById("resume-btn").classList.add("hidden");
    document.getElementById("pause-btn").classList.remove("hidden");
}

function stopSound() {
    notificationSound.pause();
    notificationSound.currentTime = 0;
    document.getElementById("stop-sound-btn").classList.add("hidden");
}

function displayTime(seconds, elementId) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    document.getElementById(elementId).textContent = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

function resetTimers() {
    clearInterval(mainTimerInterval);
    clearInterval(intervalTimerInterval);
    clearInterval(breakTimerInterval);

    mainTimer = 0;
    intervalTimer = 0;
    breakTimer = 0;

    displayTime(mainTimer, "main-timer");
    displayTime(intervalTimer, "interval-timer");
    displayTime(breakTimer, "break-timer");

    isMainTimerRunning = false;
    isIntervalTimerRunning = false;
    isBreakTimerRunning = false;

    document.getElementById("start-btn").classList.remove("hidden");
    document.getElementById("pause-btn").classList.add("hidden");
    document.getElementById("resume-btn").classList.add("hidden");
    document.getElementById("stop-sound-btn").classList.add("hidden");
}
