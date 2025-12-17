// ------------------ LOGIN LOGIC ------------------
const loginBtn = document.getElementById("login-btn");
const loginScreen = document.getElementById("login-screen");
const loginError = document.getElementById("login-error");

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const game = document.getElementById("game");
const scoreBoard = document.getElementById("score-board");

const USERS = {
  "rishabh1": { pass: "1234", color: "linear-gradient(45deg, #00ffcc, #00ffaa)" },
  "virti": { pass: "1234", color: "linear-gradient(45deg, #ff66ff, #ff00ff)" }
};

let selectedColor = USERS["rishabh1"].color; // default
let snake = [];
let mouseX = 200, mouseY = 200;
let score = 0;
let currentUser = "";
let gameRunning = false;

// ------------------ LOGIN CHECK ------------------
loginBtn.addEventListener("click", () => {
  const id = document.getElementById("user-id").value;
  const pass = document.getElementById("user-pass").value;

  if (USERS[id] && USERS[id].pass === pass) {
    selectedColor = USERS[id].color;
    currentUser = id;
let currentUser = "";
let selectedColor = "";
let score = 0;

loginBtn.addEventListener("click", () => {
  const id = userId.value;
  const pass = userPass.value;

  if (USERS[id] && USERS[id].pass === pass) {
    currentUser = id;
    selectedColor = USERS[id].color;

    loginScreen.style.display = "none";
    document.getElementById("dashboard").style.display = "flex";

    loadDashboard();
  } else {
    loginError.innerText = "Invalid ID or Password";
  }
});
function loadDashboard() {
  const tableBody = document.querySelector("#score-table tbody");
  tableBody.innerHTML = "";

  let scores = JSON.parse(localStorage.getItem("scores")) || {};

  let highestScore = 0;
  let topPlayer = "";

  for (let user in scores) {
    if (scores[user] > highestScore) {
      highestScore = scores[user];
      topPlayer = user;
    }
  }

  Object.keys(USERS).forEach(user => {
    let tr = document.createElement("tr");

    let userScore = scores[user] || 0;
    let status = user === topPlayer ? "👑 Highest" : "";

    tr.innerHTML = `
      <td>${user}</td>
      <td>${userScore}</td>
      <td class="${user === topPlayer ? "highest" : ""}">${status}</td>
    `;

    tableBody.appendChild(tr);
  });
}
function saveScore() {
  let scores = JSON.parse(localStorage.getItem("scores")) || {};
  scores[currentUser] = score;
  localStorage.setItem("scores", JSON.stringify(scores));
}
score++;
saveScore();
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "q") {
    endGame();
  }
});

function endGame() {
  alert(`Game Over! Score: ${score}`);
  saveScore();

  game.style.display = "none";
  scoreBoard.style.display = "none";
  document.getElementById("dashboard").style.display = "flex";

  loadDashboard();
}

    // Load previous high score for this user
    score = parseInt(localStorage.getItem(`score_${currentUser}`)) || 0;
    document.getElementById("score").textContent = score;

    loginScreen.style.display = "none";
    startScreen.style.display = "flex"; // show start screen
  } else {
    loginError.textContent = "❌ Invalid ID or Password";
  }
});

// ------------------ FULLSCREEN & START GAME ------------------
startBtn.addEventListener("click", async () => {
  await document.documentElement.requestFullscreen();
  startScreen.style.display = "none";
  game.style.display = "block";
  scoreBoard.style.display = "block";
  initSnakeGame();
  gameRunning = true;
});

// ------------------ SNAKE GAME LOGIC ------------------
const food = document.getElementById("food");
const scoreEl = document.getElementById("score");
const glow = document.querySelector(".cursor-glow");

function initSnakeGame() {
  // Clear previous snake if any
  snake.forEach(p => game.removeChild(p.el));
  snake = [];

  // Initial snake
  for (let i = 0; i < 10; i++) {
    const part = document.createElement("div");
    part.className = "snake";
    part.style.background = selectedColor;
    game.appendChild(part);
    snake.push({ x: mouseX, y: mouseY, el: part });
  }

  // Place food randomly
  placeFood();

  // Track cursor
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Glow follows cursor
    glow.style.left = `${mouseX - 15}px`;
    glow.style.top = `${mouseY - 15}px`;
    glow.style.background = selectedColor.replace("linear-gradient", "radial-gradient(circle,") + ", transparent)";
  });

  // Track Q key to end game
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "q" && gameRunning) {
      endGame();
    }
  });

  // Start game loop
  requestAnimationFrame(gameLoop);
}

// ------------------ GAME FUNCTIONS ------------------
function placeFood() {
  food.style.left = Math.random() * (window.innerWidth - 20) + "px";
  food.style.top = Math.random() * (window.innerHeight - 20) + "px";
}

function gameLoop() {
  if (!gameRunning) return; // stop loop if game ended

  // Move body
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x += (snake[i - 1].x - snake[i].x) * 0.3;
    snake[i].y += (snake[i - 1].y - snake[i].y) * 0.3;
  }

  // Head follows cursor
  snake[0].x += (mouseX - snake[0].x) * 0.4;
  snake[0].y += (mouseY - snake[0].y) * 0.4;

  // Draw snake
  snake.forEach(p => {
    p.el.style.left = p.x + "px";
    p.el.style.top = p.y + "px";
  });

  checkFoodCollision();
  requestAnimationFrame(gameLoop);
}

// Food collision
function checkFoodCollision() {
  const head = snake[0];
  const fx = food.offsetLeft;
  const fy = food.offsetTop;

  const dist = Math.hypot(head.x - fx, head.y - fy);

  if (dist < 18) {
    score++;
    scoreEl.textContent = score;

    // Save score for current user
    localStorage.setItem(`score_${currentUser}`, score);

    growSnake();
    placeFood();
  }
}

// Grow snake
function growSnake() {
  const last = snake[snake.length - 1];
  const part = document.createElement("div");
  part.className = "snake";
  part.style.background = selectedColor;
  game.appendChild(part);
  snake.push({ x: last.x, y: last.y, el: part });
}

// ------------------ END GAME ------------------
function endGame() {
  alert(`Game Over! 🐍 Your score for ${currentUser}: ${score}`);
  gameRunning = false;

  // Hide game & score, show start screen
  game.style.display = "none";
  scoreBoard.style.display = "none";
  startScreen.style.display = "flex";

  // Reset snake
  snake.forEach(p => game.removeChild(p.el));
  snake = [];
}
