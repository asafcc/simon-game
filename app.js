const red = document.querySelector(".red");
const blue = document.querySelector(".blue");
const green = document.querySelector(".green");
const yellow = document.querySelector(".yellow");
const audio = document.querySelector("#audio");
const playBtn = document.querySelector(".start");
const scoreEl = document.querySelector("#score");

const timer = document.querySelector("#timer");

const colors = ["red", "green", "blue", "yellow"];

//colors Element array
colorsElements = [red, blue, green, yellow];

let gameOn = true;
let time;
//Currect Colors
let colorsList = [];
let clickedColors = [];

let score = 0;

//add new random color to list
function addRandomColor() {
  const randomColor = colors[Math.floor(Math.random() * 4)];
  colorsList.push(randomColor);
}

//color string to the colored panel element
function colorToElement(color) {
  if (color === "red") {
    return red;
  } else if (color === "blue") {
    return blue;
  } else if (color === "green") {
    return green;
  } else return yellow;
}

//play array panel
function playPanel(color) {
  timer.innerHTML = "00:00";
  return new Promise((resolve, reject) => {
    colorEl = colorToElement(color);
    colorEl.classList.add("on");
    audio.src = `./sounds/${color}.mp3`;
    audio.play();
    setTimeout(() => {
      colorEl.classList.remove("on");
      setTimeout(() => {
        resolve();
      }, 300);
    }, 1250);
  });
}

function userTurn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, time);
  });
}

const main = async () => {
  while (gameOn) {
    //add new random color to list and increase the array's size
    addRandomColor();
    currectColors = [...colorsList];
    clickedColors = [];

    //remove pointer cursor
    colorsElements.forEach((el) => {
      el.style.cursor = "auto";
      el.removeEventListener("click", addToGuessList);
    });
    //play the random  colors list
    for (const color of colorsList) {
      await playPanel(color);
    }

    time = colorsList.length < 3 ? 3500 : 2500 * colorsList.length;
    calcSec = time / 1000;
    intervalID = setInterval(() => {
      let sec = Math.floor(calcSec % 60);
      sec = sec < 10 ? `0${sec}` : sec;
      let min = Math.floor(calcSec / 60);
      min = min < 10 ? `0${min}` : min;
      timer.innerHTML = `${min}:${sec}`;
      calcSec--;
      if (calcSec < 0) {
        clearInterval(intervalID);
      }
    }, 1000);
    timer.innerHTML = "00:00";
    alert("Your Turn!");

    //add event listeners to panels and pointer cusor
    colorsElements.forEach((colorEl) => {
      colorEl.style.cursor = "pointer";
      colorEl.addEventListener("click", addToGuessList);
    });

    await userTurn().catch((err) => {
      if (currectColors.length !== 0) {
        gameOn = false;
        audio.src = `./sounds/lose.mp3`;
        audio.play();
        alert("Time Out!");
        colorsElements.forEach((el) => {
          el.style.cursor = "auto";
          el.removeEventListener("click", addToGuessList);
        });
      }
    });
  }
};

//add color to guess list and glow panel and audio
function addToGuessList(e) {
  e.target.classList.add("on");
  colorName = e.target.classList[0];
  audio.src = `./sounds/${colorName}.mp3`;
  audio.play();
  setTimeout(() => {
    e.target.classList.remove("on");
  }, 1100);
  if (currectColors[0] === colorName) {
    score++;
    scoreEl.innerHTML = score;
    currectColors.shift();
    console.log("yey");
  } else {
    clearInterval(intervalID);
    gameOn = false;
    audio.src = `./sounds/lose.mp3`;
    audio.play();
    alert("LOSER!");
    score = 0;
    scoreEl.innerHTML = score;
    colorsElements.forEach((el) => {
      el.style.cursor = "auto";
      el.removeEventListener("click", addToGuessList);
    });
  }
}

playBtn.addEventListener("click", () => {
  timer.innerHTML = "00:00";
  score = 0;
  scoreEl.innerHTML = score;
  gameOn = true;
  colorsList = [];
  main();
});
