const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const buffEl = document.getElementById("buff");
const blind = document.getElementById("blind");

const mathScreen = document.getElementById("mathScreen");
const mathQuestion = document.getElementById("mathQuestion");
const mathAnswer = document.getElementById("mathAnswer");

let score = 0;
let time = 60;
let combo = 0;
let doubleScore = false;
let gameStarted = false;

let correctAnswer;

/* 🎯 이미지 경로 (네 폴더 기준) */
const targets = [
  { name: "mole", img: "images/mole.png", score: 1 },
  { name: "diamond", img: "images/diamond.png", score: 5 },
  { name: "gold", img: "images/gold.png", effect: "double" },
  { name: "creeper", img: "images/creeper.png", score: -5 },
  { name: "emerald", img: "images/emerald.png", effect: "random" },
  { name: "silverfish", img: "images/silverfish.png", effect: "trap" }
];

/* 🧮 수학 */
function generateMath() {
  const a = Math.floor(Math.random() * 900) + 100;
  const b = Math.floor(Math.random() * 900) + 100;
  mathQuestion.innerText = `${a} + ${b} = ?`;
  return a + b;
}

function startMath() {
  mathScreen.style.display = "flex";
  correctAnswer = generateMath();
}

function submitAnswer() {
  if (parseInt(mathAnswer.value) === correctAnswer) {
    mathScreen.style.display = "none";

    if (!gameStarted) startGame();
    else endGame();
  }
}

/* 🎮 게임 시작 */
function startGame() {
  gameStarted = true;

  const loop = setInterval(() => {
    time--;
    timerEl.innerText = "시간: " + time;

    spawnTarget();

    if (time <= 0) {
      clearInterval(loop);
      startMath();
    }
  }, 1000);
}

/* 🎯 랜덤 생성 */
function spawnTarget() {
  const t = targets[Math.floor(Math.random() * targets.length)];

  const el = document.createElement("img");
  el.src = t.img;
  el.className = "target";

  el.style.left = Math.random() * (window.innerWidth - 80) + "px";
  el.style.top = Math.random() * (window.innerHeight - 80) + "px";

  el.onclick = () => clickTarget(t, el);

  game.appendChild(el);

  setTimeout(() => el.remove(), 2000);
}

/* 클릭 처리 */
function clickTarget(t, el) {
  el.remove();

  combo++;

  if (t.name === "gold") {
    doubleScore = true;
    buffEl.style.display = "block";
    combo += 2;
    return;
  }

  if (t.name === "creeper") {
    score -= doubleScore ? 10 : 5;
    shake();
  }

  else if (t.name === "silverfish") {
    combo = 0;
    score -= 1;
    blind.classList.add("blind-active");
    setTimeout(() => blind.classList.remove("blind-active"), 2000);
  }

  else if (t.name === "emerald") {
    if (Math.random() < 0.5) {
      score += 10;
    } else {
      score -= 3;
      flash();
    }
  }

  else {
    let gain = t.score;
    if (doubleScore) gain *= 2;
    score += gain;
  }

  scoreEl.innerText = "점수: " + score;

  if (combo >= 10) {
    shake();
    combo = 0;
  }
}

/* 효과 */
function shake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 300);
}

function flash() {
  document.body.classList.add("lightning");
  setTimeout(() => document.body.classList.remove("lightning"), 200);
}

/* 종료 */
function endGame() {
  alert(`끝! 점수: ${score}`);
}

/* 시작 */
startMath();
