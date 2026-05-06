
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
        startTimer()
        e.target.textContent = "Pause";
    }else {
        stopTimer();
        e.target.textContent = "Resume";
    }
    
})

resetBtn.addEventListener('click', () => {
    stopTimer();

    startTime = undefined;
    displayTime.min = "00"
    displayTime.sec = "00.0"
    toggleBtn.textContent = "Start"

    laps = [];
    lapsList.replaceChildren();
    updateUI();
})

lapBtn.addEventListener("click", createLaps)


function startTimer() {
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

function stopTimer() {
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

    let formatedMin = String(min).padStart(2, '0');
    let formatedSec = sec.toFixed(1).padStart(4,  '0');

    return [formatedMin, formatedSec]
}

function updateTime(ms) {
    let [formatedMin, formatedSec] = formateTime(ms)

    displayTime.min = formatedMin;
    displayTime.sec = formatedSec;

}

function updateLapsUI() {
    const {lapTime, lapDiff} = laps.at(-1);
    let [min_fLapTime, sec_fLapTime] = formateTime(lapTime);
    let [min_fLapDiff, sec_fLapDiff] = formateTime(lapDiff);

    const newLapRecord = document.createElement("div");
    newLapRecord.textContent = `#${ laps.length }             ${min_fLapDiff}:${sec_fLapDiff}            ${ min_fLapTime }:${ sec_fLapTime }`;

    lapsList.append(newLapRecord);
}

function updateUI() {
    const {min, sec} = displayTime;
    display.textContent = `${ min }:${sec }`
}

updateUI()