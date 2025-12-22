// ===============================
// GLOBALS
// ===============================
let score = 0;
let highestScore = 0;
let gameRunning = false;
let userId = "";

let snake = [];
let snakeLength = 6;

// ===============================
// ELEMENTS
// ===============================
const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const startScreen = document.getElementById("start-screen");
const scoreBoard = document.getElementById("score-board");
const game = document.getElementById("game");

const scoreEl = document.getElementById("score");
const highestScoreEl = document.getElementById("highest-score");

// ===============================
// LOGIN
// ===============================
document.getElementById("login-btn").addEventListener("click", () => {
  userId = document.getElementById("user-id").value.trim();

  if (!userId) {
    document.getElementById("login-error").innerText = "Enter ID";
    return;
  }

  loginScreen.style.display = "none";
  loadHighestScore();
  showDashboard();
});

// ===============================
// DASHBOARD
// ===============================
function showDashboard() {
  dashboard.style.display = "flex";
  startScreen.style.display = "none";
  scoreBoard.style.display = "none";
  game.style.display = "none";

  highestScoreEl.innerText = highestScore;
}

document.getElementById("play-btn").addEventListener("click", () => {
  dashboard.style.display = "none";
  startScreen.style.display = "flex";
});

// ===============================
// START GAME
// ===============================
document.getElementById("start-btn").addEventListener("click", () => {
  startScreen.style.display = "none";
  scoreBoard.style.display = "block";
  game.style.display = "block";
  startNewGame();
});

// ===============================
// GAME START
// ===============================
function startNewGame() {
  score = 0;
  scoreEl.innerText = score;
  gameRunning = true;

  document.querySelectorAll(".snake").forEach(e => e.remove());
  createSnake(window.innerWidth / 2, window.innerHeight / 2);
}

// ===============================
// CREATE SNAKE
// ===============================
function createSnake(x, y) {
  snake = [];

  for (let i = 0; i < snakeLength; i++) {
    const part = document.createElement("div");
    part.className = "snake";
    part.style.left = x + "px";
    part.style.top = y + "px";
    part.style.background = `rgba(0,255,204,${1 - i * 0.1})`;

    game.appendChild(part);
    snake.push({ el: part, x, y });
  }
}

// ===============================
// MOVE SNAKE WITH CURSOR
// ===============================
document.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;

  let x = e.clientX;
  let y = e.clientY;

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  snake[0].x = x;
  snake[0].y = y;

  snake.forEach(s => {
    s.el.style.left = s.x + "px";
    s.el.style.top = s.y + "px";
  });
});

// ===============================
// SCORE UPDATE (CALL WHEN FOOD EATEN)
// ===============================
function updateScore() {
  score++;
  scoreEl.innerText = score;
}

// ===============================
// EXIT GAME (Q)
// ===============================
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "q" && gameRunning) {
    endGame();
  }
});

// ===============================
// END GAME
// ===============================
function endGame() {
  gameRunning = false;

  if (score > highestScore) {
    highestScore = score;
    saveHighestScore();
  }

  showDashboard();
}

// ===============================
// STORAGE
// ===============================
function loadHighestScore() {
  const saved = localStorage.getItem(`snake_highscore_${userId}`);
  highestScore = saved ? parseInt(saved) : 0;
}

function saveHighestScore() {
  localStorage.setItem(`snake_highscore_${userId}`, highestScore);
}
