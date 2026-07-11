
let score = 0;
let time = 90;
let difficulty = "normal";
let user = null;

// 로그인
function googleLogin() {
  const { auth, provider, signInWithPopup } = window.fb;

  signInWithPopup(auth, provider).then(res => {
    user = res.user;
    document.getElementById("userInfo").innerText = user.email;
  });
}

// 시작
function startGameButton() {
  difficulty = document.getElementById("difficultyInput").value || "normal";
  startGame();
}

// 게임 시작
function startGame() {
  score = 0;
  time = 90;

  document.getElementById("startScreen").style.display = "none";

  const timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = "시간: " + time;

    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// 점수 계산 (테스트용)
document.getElementById("game").onclick = () => {
  score++;
  document.getElementById("score").innerText = "점수: " + score;
};

// 종료
async function endGame() {
  alert("점수: " + score);

  await saveScore();
  await loadLeaderboard();

  showResult();

  document.getElementById("startScreen").style.display = "flex";
}

// 점수 저장
async function saveScore() {
  const { db, collection, addDoc } = window.fb;

  if (!user) return;

  await addDoc(collection(db, "scores"), {
    email: user.email,
    score,
    difficulty,
    time: Date.now()
  });
}

// 랭킹
async function loadLeaderboard() {
  const { db, collection, getDocs, query, orderBy, limit, where } = window.fb;

  const q = query(
    collection(db, "scores"),
    where("difficulty", "==", difficulty),
    orderBy("score", "desc"),
    limit(10)
  );

  const snap = await getDocs(q);

  let html = `<h3>🏆 ${difficulty} 랭킹</h3>`;

  snap.forEach(doc => {
    const d = doc.data();
    html += `<div>${d.email} : ${d.score}</div>`;
  });

  document.getElementById("leaderboard").innerHTML = html;
}

// 등급 시스템
function getGrade(score) {
  if (difficulty === "impossible") {
    if (score < 0) return "PK2번0골급";
    if (score < 10) return "발롱갈탈급";
    if (score < 20) return "챔스우승급";
    return "사람아니야급";
  }

  if (score < 10) return "벤치급";
  if (score < 20) return "국대급";
  if (score < 30) return "호날두급";
  if (score < 40) return "신두급";
  return "킹갓제너럴레전드급";
}

// 결과 화면
function showResult() {
  const grade = getGrade(score);

  document.getElementById("resultScreen").innerHTML = `
    <h2>결과</h2>
    <div>점수: ${score}</div>
    <div>등급: ${grade}</div>
    <button onclick="location.reload()">다시하기</button>
  `;
}
