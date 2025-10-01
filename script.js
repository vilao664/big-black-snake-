const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");
const restartBtn = document.getElementById("restartBtn");
const crashSound = document.getElementById("crashSound");
const bgMusic = document.getElementById("bgMusic");
const menu = document.getElementById("menu");
const scoreboard = document.querySelector(".scoreboard");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake1 = [];
let snake2 = [];
let dir1 = { x: 1, y: 0 };
let dir2 = { x: -1, y: 0 };
let food = { x: 10, y: 10 };
let score1 = 0;
let score2 = 0;
let gameOver = false;
let hue = 0;
let mode = "solo";

function drawCircle(x, y, color) {
  ctx.beginPath();
  ctx.arc(
    x * gridSize + gridSize / 2,
    y * gridSize + gridSize / 2,
    gridSize / 2.5,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function draw() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 50,
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  gradient.addColorStop(0, `hsl(${hue}, 100%, 30%)`);
  gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 100%, 10%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  hue = (hue + 1) % 360;

  drawCircle(food.x, food.y, "yellow");

  snake1.forEach((seg, i) => drawCircle(seg.x, seg.y, i === 0 ? "#00f" : "#66f"));
  if (mode === "multi") {
    snake2.forEach((seg, i) => drawCircle(seg.x, seg.y, i === 0 ? "#f00" : "#f66"));
  }

  score1Display.textContent = "Cobra Azul: " + score1;
  score2Display.textContent = "Cobra Vermelha: " + score2;
}

function update() {
  if (gameOver) return;

  const head1 = { x: snake1[0].x + dir1.x, y: snake1[0].y + dir1.y };
  if (
    head1.x < 0 || head1.y < 0 || head1.x >= tileCount || head1.y >= tileCount ||
    (mode === "multi" && snake2.some(seg => seg.x === head1.x && seg.y === head1.y)) ||
    snake1.some((seg, i) => i !== 0 && seg.x === head1.x && seg.y === head1.y)
  ) {
    triggerCrashEffect();
    endGame();
    return;
  }

  snake1.unshift(head1);
  if (head1.x === food.x && head1.y === food.y) {
    score1++;
    spawnFood();
  } else {
    snake1.pop();
  }

  if (mode === "multi") {
    const head2 = { x: snake2[0].x + dir2.x, y: snake2[0].y + dir2.y };
    if (
      head2.x < 0 || head2.y < 0 || head2.x >= tileCount || head2.y >= tileCount ||
      snake1.some(seg => seg.x === head2.x && seg.y === head2.y) ||
      snake2.some((seg, i) => i !== 0 && seg.x === head2.x && seg.y === head2.y)
    ) {
      triggerCrashEffect();
      endGame();
      return;
    }

    snake2.unshift(head2);
    if (head2.x === food.x && head2.y === food.y) {
      score2++;
      spawnFood();
    } else {
      snake2.pop();
    }
  }
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function triggerCrashEffect() {
  document.body.classList.add("flash");
  crashSound.currentTime = 0;
  crashSound.play();
  setTimeout(() => {
    document.body.classList.remove("flash");
  }, 300);
}

function endGame() {
  gameOver = true;
  restartBtn.style.display = "inline-block";
}

function restartGame() {
  startGame(mode);
}

function startGame(selectedMode) {
  mode = selectedMode;
  snake1 = [{ x: 5, y: 5 }];
  dir1 = { x: 1, y: 0 };
  score1 = 0;

  if (mode === "multi") {
    snake2 = [{ x: 20, y: 20 }];
    dir2 = { x: -1, y: 0 };
    score2 = 0;
    score2Display.style.display = "block";
  } else {
    snake2 = [];
    score2Display.style.display = "none";
  }

  spawnFood();
  gameOver = false;
  restartBtn.style.display = "none";
  canvas.style.display = "block";
  scoreboard.style.display = "flex";
  menu.style.display = "none";
  bgMusic.volume = 0.5;
  bgMusic.play();
  gameLoop();
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) setTimeout(gameLoop, 120);
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": if (dir1.y === 0) dir1 = { x: 0, y: -1 }; break;
    case "ArrowDown": if (dir1.y === 0) dir1 = { x: 0, y: 1 }; break;
    case "ArrowLeft": if (dir1.x === 0) dir1 = { x: -1, y: 0 }; break;
    case "ArrowRight": if (dir1.x === 0) dir1 = { x: 1, y: 0 }; break;
    case "w": if (dir2.y === 0) dir2 = { x: 0, y: -1 }; break;
    case "s": if (dir2.y === 0) dir2 = { x: 0, y: 1 }; break;
    case "a": if (dir2.x === 0) dir2 = { x: -1, y: 0 }; break;
    case "d": if (dir2.x === 0) dir2 = { x: 1, y: 0 }; break;
  }
});
