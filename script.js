// =========================
// 🎯 기본 변수
// =========================
const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const timerEl = document.getElementById("timer");
const buffEl = document.getElementById("buff");

let score = 0;
let combo = 0;
let time = 60;
let multiplier = 1;
let gameRunning = false;

// =========================
// 🧠 수학 문제
// =========================
function generateMath() {
  const a = Math.floor(Math.random() * 900) + 100;
  const b = Math.floor(Math.random() * 900) + 100;
  return { question: `${a} + ${b}`, answer: a + b };
}

function askMath(callback) {
  const problem = generateMath();

  let input = prompt(problem.question + " = ?");
  if (parseInt(input) === problem.answer) {
    callback();
  } else {
    alert("틀림! 다시!");
    askMath(callback);
  }
}

// =========================
// 🎮 게임 시작
// =========================
function startGame() {
  askMath(() => {
    score = 0;
    combo = 0;
    time = 60;
    multiplier = 1;
    gameRunning = true;

    updateUI();
    spawnLoop();
    timerLoop();
  });
}

// =========================
// ⏱ 타이머
// =========================
function timerLoop() {
  const timer = setInterval(() => {
    time--;
    timerEl.textContent = time;

    if (time <= 0) {
      clearInterval(timer);
      gameRunning = false;

      askMath(() => {
        alert(`게임 끝! 점수: ${score}`);
      });
    }
  }, 1000);
}

// =========================
// 🎯 타겟 종류
// =========================
const targets = [
  { type: "mole", img: "images/mole.png" },
  { type: "diamond", img: "images/diamond.png" },
  { type: "gold", img: "images/gold.png" },
  { type: "creeper", img: "images/creeper.png" },
  { type: "silverfish", img: "images/silverfish.png" },
  { type: "emerald", img: "images/emerald.png" }
];

// =========================
// 🎲 랜덤 타겟 선택
// =========================
function getRandomTarget() {
  const r = Math.random();

  if (r < 0.15) return targets[1]; // diamond
  if (r < 0.3) return targets[2]; // gold
  if (r < 0.45) return targets[3]; // creeper
  if (r < 0.6) return targets[4]; // silverfish
  if (r < 0.75) return targets[5]; // emerald
  return targets[0]; // mole
}

// =========================
// 🐹 타겟 생성 루프
// =========================
function spawnLoop() {
  if (!gameRunning) return;

  const hole = holes[Math.floor(Math.random() * holes.length)];
  const target = getRandomTarget();

  const img = document.createElement("img");
  img.src = target.img;
  img.classList.add("target");
  img.dataset.type = target.type;

  hole.innerHTML = "";
  hole.appendChild(img);

  // 👇 모바일 + PC 클릭 대응
  img.addEventListener("click", () => hitTarget(img));
  img.addEventListener("touchstart", (e) => {
    e.preventDefault();
    hitTarget(img);
  });

  setTimeout(() => {
    hole.innerHTML = "";
  }, 800);

  setTimeout(spawnLoop, 600);
}

// =========================
// 💥 타겟 클릭 처리
// =========================
function hitTarget(target) {
  if (!gameRunning) return;

  const type = target.dataset.type;

  let base = 1;

  switch (type) {
    case "mole":
      base = 1;
      combo++;
      break;

    case "diamond":
      base = 3;
      combo++;
      flashEffect();
      break;

    case "gold":
      multiplier = 2;
      combo++;
      showBuff("2x!");
      screenShake();
      return;

    case "creeper":
      base = multiplier === 2 ? -10 : -5;
      combo = 0;
      screenShake();
      vibrate(200);
      break;

    case "silverfish":
      base = -1;
      combo = 0;
      disturbVision();
      playAnnoyingSound();
      break;

    case "emerald":
      if (Math.random() < 0.5) {
        base = 6;
        fireworkEffect();
      } else {
        base = -3;
        lightningEffect();
      }
      combo++;
      break;
  }

  score += base * multiplier;

  if (multiplier === 2) multiplier = 1;

  // 콤보 전설급 진동
  if (combo >= 20) vibrate(100);

  updateUI();
  target.remove();
}

// =========================
// 🖥 UI 업데이트
// =========================
function updateUI() {
  scoreEl.textContent = score;
  comboEl.textContent = combo;
  timerEl.textContent = time;
}

// =========================
// 🎇 이펙트
// =========================
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 200);
}

function flashEffect() {
  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 150);
}

function fireworkEffect() {
  document.body.classList.add("firework");
  setTimeout(() => document.body.classList.remove("firework"), 300);
}

function lightningEffect() {
  document.body.classList.add("lightning");
  setTimeout(() => document.body.classList.remove("lightning"), 200);
}

function showBuff(text) {
  buffEl.textContent = text;
  buffEl.style.opacity = 1;

  setTimeout(() => {
    buffEl.style.opacity = 0;
  }, 1000);
}

function disturbVision() {
  document.body.classList.add("web");
  setTimeout(() => document.body.classList.remove("web"), 1500);
}

function playAnnoyingSound() {
  const audio = new Audio("sounds/annoying.mp3");
  audio.play();
}

// =========================
// 📳 진동
// =========================
function vibrate(ms) {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

// =========================
// 🚀 시작 버튼 연결
// =========================
document.getElementById("startBtn").addEventListener("click", startGame);
