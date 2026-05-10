// -------------StopWatch

// stopwatch elements
const toggleBtn = document.querySelector('#st-toggle');
const resetBtn = document.querySelector('#st-reset');
const lapBtn = document.querySelector('#st-lapBtn');
const display = document.querySelector('#st-timeDisplay');
const lapsList = document.querySelector('.laps');

// Stopwatch Defaults

const displayTime = {
    min: '00',
    sec: '00.0',
};

let laps = [];

// Stopwatch state

let swIntervalId;
let startTime;
let pauseTime;

// Stopwatch event listeners

toggleBtn.addEventListener('click', stopWatchToggle);

resetBtn.addEventListener('click', stopWatchReset);

lapBtn.addEventListener('click', createLaps);

// stopwatch logic

function stopWatchToggle() {
    if (!swIntervalId) {
        startStopwatch();
        toggleBtn.textContent = 'Pause';
    } else {
        pauseStopWatch();
        toggleBtn.textContent = 'Resume';
    }
}

function stopWatchReset() {
    pauseStopWatch();

    startTime = undefined;
    displayTime.min = '00';
    displayTime.sec = '00.0';
    toggleBtn.textContent = 'Start';

    laps = [];
    lapsList.replaceChildren();
    updateStopwatchUI();
}

function startStopwatch() {
    if (!startTime) {
        startTime = Date.now();
    } else {
        let resumeTime = Date.now();
        startTime = startTime + (resumeTime - pauseTime);
    }
    swIntervalId = setInterval(() => {
        let timeDiff = Date.now() - startTime;

        updateTime(timeDiff);

        updateStopwatchUI();
    }, 100);
}

function pauseStopWatch() {
    if (swIntervalId) pauseTime = Date.now();
    clearInterval(swIntervalId);
    swIntervalId = undefined;
}

function createLaps() {
    if (!swIntervalId) return;

    let newLapTime = Date.now() - startTime;

    let newLapDiff = laps.length ? newLapTime - laps.at(-1).lapTime : newLapTime;

    const newlap = {
        lapTime: newLapTime,
        lapDiff: newLapDiff,
    };
    laps.push(newlap);
    updateLapsUI();
}

function formatTime(ms) {
    let totalSec = ms / 1000;

    let min = Math.floor(Math.floor(totalSec) / 60);
    let sec = totalSec % 60;

    let hour = 0;
    if (ms >= 3600000) {
        hour = Math.floor(min / 60);
        min = min % 60;
    }

    let formatedhour = String(hour).padStart(2, '0');
    let formatedMin = String(min).padStart(2, '0');
    let formatedSec = sec.toFixed(1).padStart(4, '0');

    return [formatedhour, formatedMin, formatedSec];
}

function updateTime(ms) {
    let [formatedhour, formatedMin, formatedSec] = formatTime(ms);

    displayTime.min = formatedMin;
    displayTime.sec = formatedSec;
}

function updateLapsUI() {
    const { lapTime, lapDiff } = laps.at(-1);
    let [formatedhour, min_fLapTime, sec_fLapTime] = formatTime(lapTime);
    let [formatedhourDiff, min_fLapDiff, sec_fLapDiff] = formatTime(lapDiff);

    const newLapRecord = document.createElement('div');
    const newLapId = document.createElement('span');
    const newLapDiff = document.createElement('span');
    const newLapTime = document.createElement('span');

    newLapId.textContent = `#${laps.length}`;
    newLapDiff.textContent = `+${min_fLapDiff}:${sec_fLapDiff}`;
    newLapTime.textContent = `${min_fLapTime}:${sec_fLapTime}`;

    newLapTime.classList.add('lapTime');

    newLapRecord.append(newLapId, newLapTime, newLapDiff);

    lapsList.append(newLapRecord);
}

function updateStopwatchUI() {
    const { min, sec } = displayTime;
    display.textContent = `${min}:${sec}`;
}


// ---------------------------------TIMER---------------------------


// Timer Input
const hourInput = document.querySelector('#hour');
const minInput = document.querySelector('#min');
const secInput = document.querySelector('#sec');

// Timer buttons
const timerToggleBtn = document.querySelector('#timer-toggle');
const timerResetBtn = document.querySelector('#timer-reset');

// Timer Audio
const audio = new Audio('static/audio.mp3');

// Timer State
let timerLimit;
let timerIntervalId;
let timerPausedAt;
let timerResumedAt;


// Timer Input validation
function validateInput() {
    let hourValue = Number(hourInput.value);
    let minValue = Number(minInput.value);
    let secValue = Number(secInput.value);

    if (secValue < 0) {
        secValue = '00';
    } else if (secValue >= 60) {
        let minIncValue = Math.floor(secValue / 60);
        secValue = secValue % 60;
        minValue += minIncValue;
    }

    if (minValue < 0) {
        minValue = '00';
    } else if (minValue >= 60) {
        let hourIncValue = Math.floor(minValue / 60);
        minValue = minValue % 60;
        hourValue === 12 ? (minValue = 59) : (hourValue += hourIncValue);
    }

    if (hourValue < 0) {
        hourValue = '00';
    } else if (hourValue > 12) {
        hourValue = 12;
    }

    hourInput.value = String(hourValue).padStart(2, '0');
    minInput.value = String(minValue).padStart(2, '0');
    secInput.value = String(secValue).padStart(2, '0');
}

// Timer Event listners
hourInput.addEventListener('blur', validateInput);
minInput.addEventListener('blur', validateInput);
secInput.addEventListener('blur', validateInput);

timerToggleBtn.addEventListener('click', timerToggle);

timerResetBtn.addEventListener('click', () => {
    timerReset();
});

// Timer logic

function timerToggle() {
    if (!timerLimit) {
        startTimer();
    } else if (!timerIntervalId) {
        resumeTimer();
    } else {
        pauseTimer();
    }
    if (timerLimit)
        timerToggleBtn.textContent = !timerIntervalId ? 'Resume' : 'Pause';
}

function startTimer() {
    let hours = Number(hourInput.value);
    let hourINms = hours * 60 * 60 * 1000;

    let mins = Number(minInput.value);
    let minINms = mins * 60 * 1000;

    let sec = Number(secInput.value);
    let secINms = sec * 1000;

    let totalTime = hourINms + minINms + secINms;
    if (!totalTime) return;
    timerLimit = Date.now() + totalTime;

    hourInput.readOnly = true;
    minInput.readOnly = true;
    secInput.readOnly = true;

    timerIntervalId = setInterval(countDown, 500);
}

function countDown() {
    let currentTime = timerLimit - Date.now();
    let [formatedhour, formatedMin, formatedSec] = formatTime(currentTime);
    formatedSec = formatedSec.slice(0, -2);

    hourInput.value = formatedhour;
    minInput.value = formatedMin;
    secInput.value = formatedSec;

    if (currentTime <= 0) {
        timerReset();
        audio.load();
        audio.play();
    }
}

function pauseTimer() {
    clearInterval(timerIntervalId);
    timerIntervalId = undefined;
    timerPausedAt = Date.now();
}

function resumeTimer() {
    timerResumedAt = Date.now();
    timerLimit += timerResumedAt - timerPausedAt;
    timerIntervalId = setInterval(countDown, 500);
}

function timerReset() {
    pauseTimer();

    timerLimit = undefined;
    timerPausedAt = undefined;
    timerResumedAt = undefined;

    hourInput.value = '00';
    minInput.value = '00';
    secInput.value = '00';

    hourInput.readOnly = false;
    minInput.readOnly = false;
    secInput.readOnly = false;

    timerToggleBtn.textContent = 'Start';

    audio.pause();
}

// UI

const slider = document.querySelector('.slider');
const navBtns = document.querySelectorAll('.nav-btn');

let currentSlide = 0;

let startX = 0;

function changeSlide(index) {
    navBtns[currentSlide].classList.remove('active');
    currentSlide = index;
    navBtns[currentSlide].classList.add('active');
    slider.style.transform = `translateX(-${index * 100}vw)`;
}

for (const btn of navBtns) {
    btn.addEventListener('click', () => {
        let index = Number(btn.dataset.index);
        changeSlide(index);
    });
}

window.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

window.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;

    const touchDiff = endX - startX;

    if (touchDiff < -70) {
        changeSlide(1);
    } else if (touchDiff > 70) {
        changeSlide(0);
    }
});

window.addEventListener('keydown', (e) => {
    let keyPressed = e.code;
    if (keyPressed === 'Space') {
        e.preventDefault();
        currentSlide === 0 ? stopWatchToggle() : timerToggle();
    } else if (keyPressed === 'Escape') {
        e.preventDefault();
        currentSlide === 0 ? stopWatchReset() : timerReset();
    } else if (keyPressed === 'Enter' && currentSlide === 0) {
        e.preventDefault();
        createLaps();
    } else if (keyPressed === 'ArrowRight' && currentSlide === 0) {
        changeSlide(1);
    } else if (keyPressed === 'ArrowLeft' && currentSlide === 1) {
        changeSlide(0);
    }
});

// Creating Default state
minInput.value = '01';
updateStopwatchUI();
