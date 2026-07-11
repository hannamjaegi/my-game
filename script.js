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

let startTime, endTime;

/* 🎯 타겟 종류 */
const targets = [
  { name: "normal", img: "images/normal.png", score: 1 },

  { name: "diamond", img: "images/diamond.png", score: 5 },

  { name: "gold", img: "images/gold.png", effect: "double" },

  { name: "creeper", img: "images/creeper.png", score: -5 },

  { name: "emerald", img: "images/emerald.png", effect: "random" }
];

/* 🧮 수학 문제 생성 */
function generateMath() {
  const a = Math.floor(Math.random() * 900) + 100;
  const b = Math.floor(Math.random() * 900) + 100;
  mathQuestion.innerText = `${a} + ${b} = ?`;
  return a + b;
}

let correctAnswer;

/* 시작 */
function startMath() {
  mathScreen.style.display = "block";
  correctAnswer = generateMath();
}

/* 제출 */
function submitAnswer() {
  if (parseInt(mathAnswer.value) === correctAnswer) {
    mathScreen.style.display = "none";

    if (!gameStarted) {
      startGame();
    } else {
      endGame();
    }
  }
}

/* 🎮 게임 시작 */
function startGame() {
  gameStarted = true;
  startTime = Date.now();

  const interval = setInterval(() => {
    time--;
    timerEl.innerText = "시간: " + time;

    spawnTarget();

    if (time <= 0) {
      clearInterval(interval);
      startMath(); // 끝 문제
    }
  }, 1000);
}

/* 🎯 타겟 생성 */
function spawnTarget() {
  const t = targets[Math.floor(Math.random() * targets.length)];

  const el = document.createElement("img");
  el.src = t.img;
  el.className = "target";

  el.style.left = Math.random() * (window.innerWidth - 80) + "px";
  el.style.top = Math.random() * (window.innerHeight - 80) + "px";

  el.onclick = () => handleClick(t, el);

  game.appendChild(el);

  setTimeout(() => el.remove(), 2000);
}

/* 클릭 처리 */
function handleClick(t, el) {
  el.remove();

  combo++;

  if (t.effect === "double") {
    doubleScore = true;
    buffEl.style.display = "block";
    combo += 2;
    return;
  }

  if (t.name === "creeper") {
    score -= doubleScore ? 10 : 5;
    shake();
    return;
  }

  if (t.effect === "random") {
    if (Math.random() < 0.5) {
      score += 10;
      el.classList.add("firework");
    } else {
      score -= 3;
      flash();
    }
    return;
  }

  let gain = t.score;
  if (doubleScore) gain *= 2;

  score += gain;

  scoreEl.innerText = "점수: " + score;

  /* 콤보 전설급 */
  if (combo >= 10) {
    shake();
    combo = 0;
  }
}

/* 📳 화면 흔들림 */
function shake() {
  document.body.classList.add("shake");
  setTimeout(() => {
    document.body.classList.remove("shake");
  }, 300);
}

/* ⚡ 번개 */
function flash() {
  document.body.classList.add("lightning");
  setTimeout(() => {
    document.body.classList.remove("lightning");
  }, 200);
}

/* 🎉 종료 */
function endGame() {
  endTime = Date.now();
  const total = (endTime - startTime) / 1000;

  alert(`게임 끝!\n점수: ${score}\n걸린 시간: ${total}초`);
}

/* 시작 시 수학 문제 */
startMath();
