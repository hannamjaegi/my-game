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
let difficulty = "normal";

let correctAnswer;

/* 🎯 타겟 */
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

/* 시작 버튼 */
function startGameButton() {
  startMath();
}

/* 수학 시작 */
function startMath() {
  mathScreen.style.display = "flex";
  correctAnswer = generateMath();
}

/* 제출 */
function submitAnswer() {
  if (parseInt(mathAnswer.value) === correctAnswer) {
    mathScreen.style.display = "none";
    countdown();
  }
}

/* ⏳ 카운트다운 */
function countdown() {
  let count = 3;

  const counter = document.createElement("div");
  counter.style.position = "fixed";
  counter.style.top = "50%";
  counter.style.left = "50%";
  counter.style.transform = "translate(-50%, -50%)";
  counter.style.fontSize = "80px";
  counter.style.color = "white";
  document.body.appendChild(counter);

  const interval = setInterval(() => {
    counter.innerText = count;
    count--;

    if (count < 0) {
      clearInterval(interval);
      counter.remove();
      startGame();
    }
  }, 1000);
}

/* 🎮 게임 시작 */
function startGame() {
  gameStarted = true;

  let spawnRate = 1000;

  if (difficulty === "hard") spawnRate = 700;
  if (difficulty === "impossible") spawnRate = 400;

  const loop = setInterval(() => {
    time--;
    timerEl.innerText = "시간: " + time;

    spawnTarget();

    if (time <= 0) {
      clearInterval(loop);
      startMath();
    }
  }, spawnRate);
}

/* 🎯 생성 */
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

/* 클릭 */
function clickTarget(t, el) {
  el.remove();

  combo++;

  if (t.name === "gold") {
    doubleScore = true;
    buffEl.style.display = "block";
    buffEl.innerText = "🔥 2배 활성화!";
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
    showCombo("콤보 초기화!");
    blind.classList.add("blind-active");
    setTimeout(() => blind.classList.remove("blind-active"), 2000);
  }

  else if (t.name === "emerald") {
    if (Math.random() < 0.5) {
      score += 10;
      showCombo("🔥 대박 +10!");
    } else {
      score -= 3;
      showCombo("⚡ -3...");
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
    showCombo("🔥 전설 콤보!");
    shake();
    combo = 0;
  }
}

/* ❌ 허공 클릭 */
game.addEventListener("click", (e) => {
  if (e.target === game) {
    combo = 0;
    showCombo("콤보 끊김!");
  }
});

/* 콤보 텍스트 */
function showCombo(text) {
  const el = document.createElement("div");
  el.innerText = text;

  el.style.position = "fixed";
  el.style.top = "40%";
  el.style.left = "50%";
  el.style.transform = "translateX(-50%)";
  el.style.fontSize = "30px";
  el.style.color = "yellow";

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 1000);
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

/* 🎮 난이도 */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = document.getElementById("difficultyInput")?.value;

    if (input === "ronaldo7") {
      difficulty = "impossible";
      alert("😈 불가능 난이도 해금!");
    }
  }
});

/* 종료 */
function endGame() {
  alert(`끝! 점수: ${score}`);
}
