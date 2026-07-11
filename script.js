// ==========================
// 기본 요소
// ==========================

const game=document.getElementById("game");
const scoreText=document.getElementById("score");
const timerText=document.getElementById("timer");

const mathScreen=document.getElementById("mathScreen");
const mathQuestion=document.getElementById("mathQuestion");
const mathAnswer=document.getElementById("mathAnswer");

const startScreen=document.getElementById("startScreen");
const gameScreen=document.getElementById("gameScreen");

const resultScreen=document.getElementById("resultScreen");
const finalScoreText=document.getElementById("finalScore");
const gradeText=document.getElementById("grade");

const doubleMessage=document.getElementById("doubleMessage");


// ==========================
// 게임 변수
// ==========================

let difficulty="normal";
let score=0;
let time=90;

let gameTimer=null;

let correctAnswer=0;

let firstMathTime=0;
let secondMathTime=0;

let mathStartTime=0;

let gameStarted=false;

let gameEnded=false;

let doubleNext=false;

let currentUser=null;

let targetInterval=null;


// ==========================
// 난이도 시작
// ==========================

window.startGameButton=function(){

difficulty=document.getElementById("difficultyInput").value.trim().toLowerCase();

if(difficulty==="ronaldo7"){
difficulty="impossible";
}

if(!["easy","normal","hard","impossible"].includes(difficulty)){
difficulty="normal";
}

startScreen.classList.add("hidden");

startMath();

};


// ==========================
// 수학 문제
// ==========================

function startMath(){

mathScreen.classList.remove("hidden");

let a=Math.floor(Math.random()*900)+100;
let b=Math.floor(Math.random()*900)+100;

correctAnswer=a+b;

mathQuestion.innerText=`${a} + ${b} = ?`;

mathAnswer.value="";

mathStartTime=Date.now();

}



// ==========================
// 수학 제출
// ==========================

window.submitAnswer=function(){

let answer=Number(mathAnswer.value);

if(answer!==correctAnswer){
alert("틀렸습니다!");
return;
}


let resultTime=(Date.now()-mathStartTime)/1000;


if(!gameStarted){

firstMathTime=resultTime;

mathScreen.classList.add("hidden");

startCountdown();

}

else{

secondMathTime=resultTime;

mathScreen.classList.add("hidden");

finishGame();

}


};



// ==========================
// 카운트다운 준비
// ==========================

function startCountdown(){

let count=document.getElementById("countdown");
let text=document.getElementById("countNumber");

count.classList.remove("hidden");


let number=5;

text.innerText=number;


let cd=setInterval(()=>{

number--;

text.innerText=number;


if(number<=0){

clearInterval(cd);

count.classList.add("hidden");

startGame();

}

},1000);

}
// ==========================
// 게임 시작
// ==========================

function startGame(){

gameScreen.classList.remove("hidden");

score=0;
time=90;

gameStarted=true;
gameEnded=false;

doubleNext=false;

updateScore();


timerText.innerText=`시간 : ${time}`;


let speed={
easy:1200,
normal:900,
hard:600,
impossible:350
};


targetInterval=setInterval(()=>{

spawnTarget();

},speed[difficulty]);



gameTimer=setInterval(()=>{

time--;

timerText.innerText=`시간 : ${time}`;


if(time<=0){

clearInterval(gameTimer);

clearInterval(targetInterval);

endGame();

}

},1000);



}





// ==========================
// 타겟 생성
// ==========================

function spawnTarget(){

if(gameEnded)return;


const target=document.createElement("div");

target.className="target";



let types=[

"mole",
"diamond",
"emerald",
"gold",
"creeper",
"silverfish"

];


let type=types[Math.floor(Math.random()*types.length)];


target.classList.add(type);



target.dataset.type=type;



let x=Math.random()*(window.innerWidth-80);
let y=Math.random()*(window.innerHeight-150)+70;


target.style.left=x+"px";
target.style.top=y+"px";





target.addEventListener("click",()=>{

hitTarget(target);


});



target.addEventListener("touchstart",(e)=>{

e.preventDefault();

hitTarget(target);


},{passive:false});



game.appendChild(target);





setTimeout(()=>{

if(target.parentNode){

target.remove();

}

},getDisappearTime());



}





// ==========================
// 난이도별 사라지는 시간
// ==========================

function getDisappearTime(){


let time={
easy:2500,
normal:1800,
hard:1200,
impossible:700
};


return time[difficulty];


}





// ==========================
// 타겟 클릭
// ==========================

function hitTarget(target){

if(!target.parentNode)return;


let type=target.dataset.type;


let point=0;



switch(type){



case "mole":

point=1;

break;




case "diamond":

point=3;

break;





case "gold":

doubleNext=true;

showDouble();

point=0;

break;






case "creeper":

point=-3;

playSound("explosion");

break;





case "silverfish":

point=-1;

playSound("bad");

showWeb();

break;





case "emerald":


if(Math.random()<0.5){

point=5;

playSound("firework");


}else{

point=-5;

playSound("thunder");


}


break;


}





// gold 효과 적용
// 단 gold 자체에는 적용 X

if(doubleNext && type!=="gold"){

point*=2;

doubleNext=false;

hideDouble();

}




score+=point;


updateScore();



target.remove();


}







// ==========================
// 허공 클릭
// ==========================

game.addEventListener("click",(e)=>{


if(e.target!==game)return;


// 항상 -1

score--;


// ⭐ gold 효과 유지


updateScore();


});





// 모바일 허공 터치

game.addEventListener("touchstart",(e)=>{


if(e.target!==game)return;


score--;


updateScore();


},{passive:true});








// ==========================
// 점수 UI
// ==========================


function updateScore(){

scoreText.innerText=`점수 : ${score}`;


}







// ==========================
// 금 효과 표시
// ==========================

function showDouble(){

doubleMessage.style.display="block";

}


function hideDouble(){

doubleMessage.style.display="none";

}
// ==========================
// 사운드
// ==========================

function playSound(name){

const sound=document.getElementById(name);

if(!sound)return;

sound.currentTime=0;
sound.play();

}





// ==========================
// web 효과
// ==========================

function showWeb(){

const web=document.getElementById("webEffect");


let x=Math.random()*(window.innerWidth-350);
let y=Math.random()*(window.innerHeight-350);


web.style.left=x+"px";
web.style.top=y+"px";


web.classList.add("webActive");



setTimeout(()=>{

web.classList.remove("webActive");


},1500);


}







// ==========================
// 게임 종료
// ==========================

function endGame(){


gameEnded=true;


game.innerHTML="";


gameScreen.classList.add("hidden");



startMath();



}









// ==========================
// 최종 결과
// ==========================

function finishGame(){


let mathBonus=0;



// 수학 시간이 빠를수록 보너스

let totalMathTime=
firstMathTime+
secondMathTime;



if(totalMathTime<10){

mathBonus=30;

}

else if(totalMathTime<20){

mathBonus=20;

}

else if(totalMathTime<40){

mathBonus=10;

}



let finalScore=
score+mathBonus;



showResult(finalScore);


saveRanking(finalScore);


}








// ==========================
// 등급 시스템
// ==========================


function getGrade(score){



if(difficulty==="impossible"){



if(score<30){

return "PK2번0골급";

}

else if(score<70){

return "발롱강탈급";

}

else if(score<150){

return "챔스우승급";

}

else{

return "사람아니야급";

}


}






else{


if(score<50){

return "벤치급";

}

else if(score<80){

return "국대급";

}

else if(score<120){

return "호날두급";

}

else if(score<170){

return "신두급";

}

else{

return "킹갓제너럴엠퍼럴레전드발롱도르5개월드컵5회출전및연속득점리빙레전두급";

}



}


}









// ==========================
// 결과 화면
// ==========================


function showResult(finalScore){


resultScreen.classList.remove("hidden");


finalScoreText.innerHTML=

`
최종 점수 : ${finalScore}점<br>
수학 시간 : ${(firstMathTime+secondMathTime).toFixed(2)}초
`;



gradeText.innerText=
getGrade(finalScore);



}









// ==========================
// 다시 시작
// ==========================


window.restartGame=function(){


resultScreen.classList.add("hidden");


document.getElementById("rankingScreen")
.classList.add("hidden");


startScreen.classList.remove("hidden");



gameStarted=false;


score=0;


}









// ==========================
// Firebase 로그인
// ==========================


document
.getElementById("loginBtn")
.addEventListener("click",async()=>{


if(!window.firebaseData){

alert("Firebase 연결 오류");

return;

}



try{


const result=
await window.firebaseData.signInWithPopup(

window.firebaseData.auth,

window.firebaseData.provider

);



currentUser=result.user;



document.getElementById("userInfo")
.innerText=
currentUser.email;


}

catch(e){


console.log(e);


}


});









// ==========================
// Firestore 랭킹 저장
// ==========================


async function saveRanking(finalScore){


if(!currentUser)return;


const db=
window.firebaseData.db;


const data={


name:currentUser.email,

score:finalScore,

difficulty:difficulty,

grade:getGrade(finalScore),

time:new Date()


};



// Firestore 연결 후 추가

/*
await addDoc(
collection(db,"ranking"),
data
);
*/


}







// ==========================
// 초기화
// ==========================

window.onload=()=>{


console.log(
"AI 집중력 두더지 게임 시작"
);


};
