
// -------------StopWatch ... Getting Elements 

const toggleBtn = document.querySelector('#start-toggle');
const resetBtn = document.querySelector('#reset');
const lapBtn = document.querySelector("#lapBtn");
const display = document.querySelector('#timeDisplay');
const lapsList = document.querySelector(".laps");


//-------------Defaults

let displayTime = {
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
        e.target.textContent = "Stop";
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
    newLapDiff = newLapTime - laps[-1].lapTime;

    newlap = {
        'lapTime' : newLapTime,
        'lapDiff' : newLapDiff
    }
    laps.push(newlap);
}

function updateTime(ms) {
    let totalSec = ms / 1000;

    let min = Math.floor(Math.floor(totalSec) / 60);
    let sec = totalSec % 60;

    let formatedMin = String(min).padStart(2, '0');
    let formatedSec = sec.toFixed(1).padStart(4,  '0');

    displayTime.min = formatedMin;
    displayTime.sec = formatedSec;

}

function updateUI() {
    display.textContent = `${displayTime.min}:${displayTime.sec}`
}

updateUI()