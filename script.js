// 로딩 확인
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS 로딩 완료");
});

// 요소
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const buffEl = document.getElementById("buff");
const blind = document.getElementById("blind");

const mathScreen = document.getElementById("mathScreen");
const mathQuestion = document.getElementById("mathQuestion");
const mathAnswer = document.getElementById("mathAnswer");

// 상태
let score = 0;
let time = 60;
let combo = 0;
let doubleScore = false;
let difficulty = "normal";
let correctAnswer;
let gameLoop;

// 타겟
const targets = [
  { name: "mole", img: "images/mole.png", score: 1 },
  { name: "diamond", img: "images/diamond.png", score: 5 },
  { name: "gold", img: "images/gold.png", effect: "double" },
  { name: "creeper", img: "images/creeper.png", score: -5 },
  { name: "emerald", img: "images/emerald.png", effect: "random" },
  { name: "silverfish", img: "images/silverfish.png", effect: "trap" }
];

// 시작 버튼
function startGameButton() {
  const input = document.getElementById("difficultyInput").value;

  if (input === "easy" || input === "normal" || input === "hard") {
    difficulty = input;
  }

  if (input === "ronaldo7") {
    difficulty = "impossible";
    alert("😈 불가능 난이도 해금!");
  }

  document.getElementById("startScreen").style.display = "none";
  startMath();
}

// 수학 시작
function startMath() {
  console.log("수학 시작됨");

  mathScreen.style.display = "flex";
  mathAnswer.value = "";

  const a = Math.floor(Math.random() * 900) + 100;
  const b = Math.floor(Math.random() * 900) + 100;
  correctAnswer = a + b;

  mathQuestion.innerText = `${a} + ${b} = ?`;
}

// 제출
function submitAnswer() {
  if (parseInt(mathAnswer.value) === correctAnswer) {
    mathScreen.style.display = "none";
    countdown();
  } else {
    alert("틀림!");
  }
}

// 카운트다운
function countdown() {
  let count = 3;

  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.top = "50%";
  el.style.left = "50%";
  el.style.transform = "translate(-50%, -50%)";
  el.style.fontSize = "80px";
  el.style.color = "white";

  document.body.appendChild(el);

  const interval = setInterval(() => {
    el.innerText = count;
    count--;

    if (count < 0) {
      clearInterval(interval);
      el.remove();
      startGame();
    }
  }, 1000);
}

// 게임 시작
function startGame() {
  score = 0;
  time = 60;
  combo = 0;
  doubleScore = false;

  scoreEl.innerText = "점수: 0";
  timerEl.innerText = "시간: 60";

  let spawnRate = 1000;
  if (difficulty === "hard") spawnRate = 700;
  if (difficulty === "impossible") spawnRate = 400;

  gameLoop = setInterval(() => {
    time--;
    timerEl.innerText = "시간: " + time;

    spawnTarget();

    if (time <= 0) {
      clearInterval(gameLoop);
      endGame();
    }
  }, spawnRate);
}

// 생성
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

// 클릭
function clickTarget(t, el) {
  el.remove();
  combo++;

  if (t.name === "gold") {
    doubleScore = true;
    buffEl.style.display = "block";

    setTimeout(() => {
      doubleScore = false;
      buffEl.style.display = "none";
    }, 5000);

    return;
  }

  if (t.name === "creeper") {
    score -= 5;
  }

  else if (t.name === "silverfish") {
    combo = 0;
    blind.classList.add("blind-active");
    setTimeout(() => blind.classList.remove("blind-active"), 2000);
  }

  else if (t.name === "emerald") {
    score += Math.random() < 0.5 ? 10 : -3;
  }

  else {
    let gain = t.score;
    if (doubleScore) gain *= 2;
    score += gain;
  }

  scoreEl.innerText = "점수: " + score;
}

// 종료
function endGame() {
  alert(`끝! 점수: ${score}`);
  startMath();
}
