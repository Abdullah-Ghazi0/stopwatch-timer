
// -------------StopWatch ... Getting Elements 

const toggleBtn = document.querySelector('#st-toggle');
const resetBtn = document.querySelector('#st-reset');
const lapBtn = document.querySelector("#st-lapBtn");
const display = document.querySelector('#st-timeDisplay');
const lapsList = document.querySelector(".laps");


//-------------Defaults

const displayTime = {
    "min" : "00",
    "sec" : "00.0"
}

let laps = []

let state;
let startTime;
let pauseTime;

toggleBtn.addEventListener('click', (e) => {
    if (!state) {
        startStopwatch()
        e.target.textContent = "Pause";
    }else {
        pauseStopWatch();
        e.target.textContent = "Resume";
    }
    
})

resetBtn.addEventListener('click', () => {
    pauseStopWatch();

    startTime = undefined;
    displayTime.min = "00"
    displayTime.sec = "00.0"
    toggleBtn.textContent = "Start"

    laps = [];
    lapsList.replaceChildren();
    updateUI();
})

lapBtn.addEventListener("click", createLaps)


function startStopwatch() {
    if (!startTime) {
        startTime = Date.now()
    } else {
        let resumeTime = Date.now()
        startTime = startTime + (resumeTime - pauseTime)
    }
        state = setInterval(()=> {
        let timeDiff = Date.now() - startTime;

        updateTime(timeDiff);

        updateUI();
    }, 100)
}

function pauseStopWatch() {
    pauseTime = Date.now()
    clearInterval(state);
    state = undefined;
}

function createLaps() {
    if (!state) return;

    newLapTime = Date.now() - startTime;
     
    newLapDiff = laps.length ? newLapTime - laps.at(-1).lapTime : newLapTime;

    newlap = {
        'lapTime' : newLapTime,
        'lapDiff' : newLapDiff
    }
    laps.push(newlap);
    updateLapsUI();
}

function formateTime(ms) {
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
    let formatedSec = sec.toFixed(1).padStart(4,  '0');

    return [formatedhour, formatedMin, formatedSec]
}

function updateTime(ms) {
    let [formatedhour, formatedMin, formatedSec] = formateTime(ms);

    displayTime.min = formatedMin;
    displayTime.sec = formatedSec;

}

function updateLapsUI() {
    const {lapTime, lapDiff} = laps.at(-1);
    let [formatedhour, min_fLapTime, sec_fLapTime] = formateTime(lapTime);
    let [formatedhourDiff, min_fLapDiff, sec_fLapDiff] = formateTime(lapDiff);

    const newLapRecord = document.createElement("div");
    newLapRecord.textContent = `#${ laps.length }             ${min_fLapDiff}:${sec_fLapDiff}            ${ min_fLapTime }:${ sec_fLapTime }`;

    lapsList.append(newLapRecord);
}

function updateUI() {
    const {min, sec} = displayTime;
    display.textContent = `${ min }:${sec }`
}

updateUI()







// Timer Input
const hourInput = document.querySelector('#hour');
const minInput = document.querySelector("#min");
const secInput = document.querySelector("#sec");

// Timer buttons
const timerToggle = document.querySelector('#timer-toggle');
const timerResetBtn = document.querySelector('#timer-reset');

let timerLimit;
let timerState;
let timerPausedAt;
let timerResumedAt;

function validateInput() {
    let hourValue = Number(hourInput.value);
    let minValue = Number(minInput.value);
    let secValue = Number(secInput.value);

    if (secValue < 0) {
        secValue = '00';
    } else if (secValue >= 60) {
        minIncValue = Math.floor(secValue / 60);
        secValue = secValue % 60;
        minValue += minIncValue;
    }

    if (minValue < 0) {
        minValue = '00';
    } else if (minValue >= 60) {
        hourIncValue = Math.floor(minValue / 60);
        minValue = minValue % 60;
        hourValue === 12 ? minValue = 59 : hourValue += hourIncValue;
    }

    if (hourValue < 0) {
        hourValue = '00';
    }else if (hourValue > 12) {
        hourValue = 12;
    }
    
    hourInput.value = String(hourValue).padStart(2, '0');
    minInput.value = String(minValue).padStart(2, '0');
    secInput.value = String(secValue).padStart(2, '0');
}

hourInput.addEventListener('blur', validateInput);
minInput.addEventListener('blur', validateInput);
secInput.addEventListener('blur', validateInput);

timerToggle.addEventListener('click', () => {
    if (!timerLimit) {
        startTimer();
    }else if (!timerState) {
        resumeTimer()
    }else {
        pauseTimer();
    }
    if (timerLimit) timerToggle.textContent = (!timerState) ? "Resume" : "Pause";
    
})

timerResetBtn.addEventListener('click', ()=> {
    timerReset();
})

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

    timerState = setInterval(countDown, 500)
}

function countDown() {
    let currentTime = timerLimit - Date.now();
    let [formatedhour, formatedMin, formatedSec] = formateTime(currentTime);
    formatedSec = formatedSec.slice(0,  -2);

    hourInput.value = formatedhour;
    minInput.value = formatedMin;
    secInput.value = formatedSec;


    if (currentTime < 500) {
        timerReset();
    }
}

function pauseTimer() {
    clearInterval(timerState);
    timerState = undefined;
    timerPausedAt = Date.now();
}

function resumeTimer() {
    timerResumedAt = Date.now();
    timerLimit += timerResumedAt - timerPausedAt;
    timerState = setInterval(countDown, 500);
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

    timerToggle.textContent = "Start";
}