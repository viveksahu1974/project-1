const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;
let appleX = 5;
let appleY = 5;
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;

const gulpSound = new Audio("gulp.mp3");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");

function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  if (isGameOver()) {
    showGameOverScreen();
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  if (score > 5) speed = 9;
  if (score > 10) speed = 11;

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  if (yVelocity === 0 && xVelocity === 0) return false;

  if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) return true;

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) return true;
  }

  return false;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) snakeParts.shift();

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

function showGameOverScreen() {
  finalScoreElement.textContent = score;
  gameOverScreen.style.display = "block";
}

function restartGame() {
  headX = 10;
  headY = 10;
  snakeParts.length = 0;
  tailLength = 2;
  appleX = 5;
  appleY = 5;
  xVelocity = 0;
  yVelocity = 0;
  inputsXVelocity = 0;
  inputsYVelocity = 0;
  score = 0;
  speed = 7;
  gameOverScreen.style.display = "none";
  drawGame();
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  if (event.keyCode === 38 || event.keyCode === 87) {
    if (inputsYVelocity === 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  if (event.keyCode === 40 || event.keyCode === 83) {
    if (inputsYVelocity === -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  if (event.keyCode === 37 || event.keyCode === 65) {
    if (inputsXVelocity === 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  if (event.keyCode === 39 || event.keyCode === 68) {
    if (inputsXVelocity === -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();
