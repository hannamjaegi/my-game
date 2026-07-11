let score = 0;
let time = 90;
let difficulty = "normal";

let doubleNext = false;

let startTime = 0;
let endTime = 0;

let phase = "start"; // start → math1 → game → math2 → result

function startMath1() {
  phase = "math1";
  startTime = Date.now();
  showMath();
}

function startMath2() {
  phase = "math2";
  showMath();
}

function finishMath() {
  if (phase === "math1") {
    startGame();
  } else {
    endTime = Date.now();
    finishAll();
  }
}

function handleClick(type) {
  let delta = 0;

  if (type === "mole") delta = 1;
  if (type === "diamond") delta = 3;

  if (type === "creeper") {
    delta = -3;
    playSound("explosion"); // doom
  }

  if (type === "silverfish") {
    delta = -1;
    playSound("bad");
  }

  if (type === "emerald") {
    if (Math.random() < 0.5) {
      delta = 5;
      playSound("firework");
    } else {
      delta = -5;
      playSound("thunder");
    }
  }

  if (type === "gold") {
    doubleNext = true;
    showDoubleUI(); // ⭐ 화면 표시
    return;
  }

  // ⭐ 2배 적용 (득점/감점 둘 다)
  if (doubleNext) {
    delta *= 2;
    doubleNext = false;
    hideDoubleUI();
  }

  score += delta;
  updateUI();
}

game.onclick = () => {
  let delta = -1;

  if (doubleNext) {
    delta *= 2;
    doubleNext = false;
    hideDoubleUI();
  }

  score += delta;
  updateUI();
};

function calculateFinalScore() {
  const totalTime = (endTime - startTime) / 1000;

  // 시간 빠를수록 보너스
  let timeBonus = Math.max(0, 60 - totalTime);

  return score + Math.floor(timeBonus);
}

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
  return "킹갓제너럴엠퍼럴레전드발롱도르5개월드컵5회출전및연속득점리빙레전두한반두축신두못말리는신짱두급";
}

async function saveScore(finalScore) {
  const { db, addDoc, collection } = window.fb;

  await addDoc(collection(db, "scores"), {
    email: user.email,
    score: finalScore,
    difficulty: difficulty,
    time: Date.now()
  });
}

async function loadLeaderboard() {
  const { db, collection, query, where, orderBy, limit, getDocs } = window.fb;

  const q = query(
    collection(db, "scores"),
    where("difficulty", "==", difficulty),
    orderBy("score", "desc"),
    limit(10)
  );

  const snap = await getDocs(q);

  let html = `<h3>${difficulty} 랭킹</h3>`;

  snap.forEach(doc => {
    const d = doc.data();
    html += `<div>${d.email} : ${d.score}</div>`;
  });

  document.getElementById("leaderboard").innerHTML = html;
}
function finishAll() {
  const finalScore = calculateFinalScore();
  const grade = getGrade(finalScore);

  saveScore(finalScore);
  loadLeaderboard();

  document.getElementById("resultScreen").innerHTML = `
    <h2>결과</h2>
    <div>최종 점수: ${finalScore}</div>
    <div>등급: ${grade}</div>
    <button onclick="restart()">계속하기</button>
  `;
}
function restart() {
  location.reload();
}
