

const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

const mathScreen = document.getElementById("mathScreen");
const mathQuestion = document.getElementById("mathQuestion");
const mathAnswer = document.getElementById("mathAnswer");

let score = 0;
let time = 60;
let gameInterval;
let difficulty = "normal";
let correctAnswer = 0;
let gameEnded = false;

/* 시작 버튼 */
function startGameButton() {
  difficulty = document.getElementById("difficultyInput").value || "normal";

  document.getElementById("startScreen").style.display = "none";
  startMath();
}

/* 수학 문제 */
function startMath() {
  mathScreen.style.display = "flex";

  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);

  correctAnswer = a + b;
  mathQuestion.innerText = `${a} + ${b} = ?`;
}

/* 제출 */
function submitAnswer() {
  if (parseInt(mathAnswer.value) === correctAnswer) {
    mathScreen.style.display = "none";

    if (gameEnded) {
      gameEnded = false;
      document.getElementById("startScreen").style.display = "flex";
      return;
    }

    startGame();
  } else {
    alert("틀림!");
  }
}

/* 게임 시작 */
function startGame() {
  score = 0;
  time = 60;

  updateScoreUI();
  timerEl.innerText = "시간: " + time;

  gameInterval = setInterval(() => {
    time--;
    timerEl.innerText = "시간: " + time;

    if (time <= 10) {
      timerEl.classList.add("low");
    }

    if (time <= 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);

  spawnTarget();
}

/* 타겟 생성 */
function spawnTarget() {
  const target = document.createElement("div");
  target.className = "target";

  target.style.left = Math.random() * (window.innerWidth - 80) + "px";
  target.style.top = Math.random() * (window.innerHeight - 80) + "px";

  target.onclick = () => {
    score++;
    updateScoreUI();
    target.remove();
    spawnTarget();
  };

  game.appendChild(target);
}

/* 점수 UI */
function updateScoreUI() {
  scoreEl.innerText = "점수: " + score;

  scoreEl.classList.add("score-up");
  setTimeout(() => scoreEl.classList.remove("score-up"), 200);
}

/* 게임 종료 */
function endGame() {
  alert("게임 끝! 점수: " + score);

  game.innerHTML = "";
  gameEnded = true;

  startMath();
}
