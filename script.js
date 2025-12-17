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

// LOGIN CHECK
loginBtn.addEventListener("click", () => {
  const id = document.getElementById("user-id").value;
  const pass = document.getElementById("user-pass").value;

  if (USERS[id] && USERS[id].pass === pass) {
    selectedColor = USERS[id].color;
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
});

// ------------------ SNAKE GAME LOGIC ------------------
const food = document.getElementById("food");
const scoreEl = document.getElementById("score");
const glow = document.querySelector(".cursor-glow");

function initSnakeGame() {
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

  // Start game loop
  requestAnimationFrame(gameLoop);
}

// ------------------ GAME FUNCTIONS ------------------
function placeFood() {
  food.style.left = Math.random() * (window.innerWidth - 20) + "px";
  food.style.top = Math.random() * (window.innerHeight - 20) + "px";
}

function gameLoop() {
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

