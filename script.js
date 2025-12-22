// ===============================
// GLOBAL VARIABLES
// ===============================
let score = 0;
let highestScore = 0;
let gameRunning = false;
let userId = "";

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

  if (userId === "") {
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
// GAME LOGIC
// ===============================
function startNewGame() {
  score = 0;
  scoreEl.innerText = score;
  gameRunning = true;

  document.querySelectorAll(".snake").forEach(e => e.remove());
}

// ===============================
// SCORE UPDATE (CALL WHERE FOOD EATEN)
// ===============================
function updateScore() {
  score++;
  scoreEl.innerText = score;
}

// ===============================
// EXIT GAME (Q KEY)
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
