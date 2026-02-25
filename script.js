let timer;
let seconds = 0, minutes = 0, hours = 0, milliseconds = 0;
let running = false;
let laps = [];
let lapCount = 0;

const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const millisecondsEl = document.getElementById("milliseconds");
const statusIndicator = document.getElementById("status");
const statusText = statusIndicator.querySelector(".status-text");
const stopwatchEl = document.querySelector(".stopwatch");
const lapsContainer = document.getElementById("lapsContainer");
const lapsList = document.getElementById("lapsList");
const lapsCount = document.getElementById("lapsCount");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");

function updateDisplay() {
  hoursEl.textContent = hours < 10 ? "0" + hours : hours;
  minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
  secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
  millisecondsEl.textContent = milliseconds < 10 ? "0" + milliseconds : milliseconds;
}

function formatTime(h, m, s, ms) {
  return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}.${ms < 10 ? "0" + ms : ms}`;
}

function setStatus(status) {
  statusIndicator.className = "status-indicator " + status;
  stopwatchEl.className = "stopwatch " + status;
  
  switch(status) {
    case "running":
      statusText.textContent = "Running";
      break;
    case "paused":
      statusText.textContent = "Paused";
      break;
    default:
      statusText.textContent = "Ready";
  }
}

function startTimer() {
  if (!running) {
    running = true;
    setStatus("running");
    
    startBtn.disabled = true;
    stopBtn.disabled = false;
    lapBtn.disabled = false;
    
    timer = setInterval(() => {
      milliseconds += 10;
      
      if (milliseconds >= 100) {
        milliseconds = 0;
        seconds++;
      }
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
      
      updateDisplay();
    }, 10);
  }
}

function stopTimer() {
  running = false;
  clearInterval(timer);
  setStatus("paused");
  
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function addLap() {
  if (running) {
    lapCount++;
    const lapTime = formatTime(hours, minutes, seconds, milliseconds);
    
    let prevTotal = 0;
    if (laps.length > 0) {
      const lastLap = laps[laps.length - 1];
      prevTotal = lastLap.totalMs;
    }
    
    const currentTotalMs = (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + milliseconds;
    const lapMs = currentTotalMs - prevTotal;
    
    const lapObj = {
      number: lapCount,
      time: lapTime,
      totalMs: currentTotalMs,
      lapMs: lapMs
    };
    
    laps.push(lapObj);
    
    lapsContainer.classList.add("visible");
    lapsCount.textContent = lapCount;
    
    renderLaps();
  }
}

function renderLaps() {
  if (laps.length === 0) {
    lapsList.innerHTML = "";
    return;
  }
  
  const lapTimes = laps.map(l => l.lapMs);
  const bestLap = Math.min(...lapTimes);
  const worstLap = Math.max(...lapTimes);
  
  let html = "";
  
  for (let i = laps.length - 1; i >= 0; i--) {
    const lap = laps[i];
    let className = "lap-item";
    
    if (laps.length > 1) {
      if (lap.lapMs === bestLap) className += " best";
      else if (lap.lapMs === worstLap) className += " worst";
    }
    
    const lapDuration = formatTime(
      Math.floor(lap.lapMs / 3600000),
      Math.floor((lap.lapMs % 3600000) / 60000),
      Math.floor((lap.lapMs % 60000) / 1000),
      Math.floor((lap.lapMs % 1000) / 10)
    );
    
    html += `
      <div class="${className}">
        <span class="lap-number">Lap ${lap.number}</span>
        <span class="lap-time">${lapDuration}</span>
      </div>
    `;
  }
  
  lapsList.innerHTML = html;
}

function resetTimer() {
  running = false;
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  hours = 0;
  milliseconds = 0;
  laps = [];
  lapCount = 0;
  
  updateDisplay();
  setStatus("");
  
  startBtn.disabled = false;
  stopBtn.disabled = true;
  lapBtn.disabled = true;
  
  lapsContainer.classList.remove("visible");
  lapsCount.textContent = "0";
  lapsList.innerHTML = "";
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
lapBtn.addEventListener("click", addLap);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
