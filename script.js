// USERS
const USERS = {
  rishabh1: { pass: "1234", color: "#00ffcc" },
  virti: { pass: "1234", color: "pink" }
};

// ELEMENTS
const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const game = document.getElementById("game");
const scoreBoard = document.getElementById("score-board");
const scoreEl = document.getElementById("score");
const food = document.getElementById("food");
const glow = document.querySelector(".cursor-glow");

// STATE
let currentUser = "";
let snake = [];
let mouseX = 200, mouseY = 200;
let score = 0;
let running = false;

// LOGIN
document.getElementById("login-btn").onclick = () => {
  const id = document.getElementById("user-id").value;
  const pass = document.getElementById("user-pass").value;

  if (USERS[id] && USERS[id].pass === pass) {
    currentUser = id;
    loginScreen.style.display = "none";
    dashboard.style.display = "flex";
    loadDashboard();
  } else {
    document.getElementById("login-error").innerText = "Invalid ID or Password";
  }
};

// DASHBOARD
function loadDashboard() {
  const body = document.getElementById("score-body");
  body.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("scores")) || {};
  let max = Math.max(...Object.values(scores), 0);

  Object.keys(USERS).forEach(user => {
    const tr = document.createElement("tr");
    const s = scores[user] || 0;
    tr.innerHTML = `
      <td>${user}</td>
      <td>${s}</td>
      <td class="${s === max && s > 0 ? "highest" : ""}">
        ${s === max && s > 0 ? "👑 Highest" : ""}
      </td>`;
    body.appendChild(tr);
  });
}

// START GAME
document.getElementById("start-btn").onclick = async () => {
  await document.documentElement.requestFullscreen();
  dashboard.style.display = "none";
  game.style.display = "block";
  scoreBoard.style.display = "block";
  startGame();
};

// GAME LOGIC
function startGame() {
  score = 0;
  scoreEl.innerText = 0;
  running = true;

  snake.forEach(p => p.el.remove());
  snake = [];

  for (let i = 0; i < 10; i++) {
    let d = document.createElement("div");
    d.className = "snake";
    d.style.background = USERS[currentUser].color;
    game.appendChild(d);
    snake.push({ x: mouseX, y: mouseY, el: d });
  }

  placeFood();
  requestAnimationFrame(loop);
}

// MOUSE
document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  glow.style.left = mouseX - 15 + "px";
  glow.style.top = mouseY - 15 + "px";
  glow.style.background = USERS[currentUser]?.color;
});

// LOOP
function loop() {
  if (!running) return;

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x += (snake[i - 1].x - snake[i].x) * 0.3;
    snake[i].y += (snake[i - 1].y - snake[i].y) * 0.3;
  }

  snake[0].x += (mouseX - snake[0].x) * 0.4;
  snake[0].y += (mouseY - snake[0].y) * 0.4;

  snake.forEach(p => {
    p.el.style.left = p.x + "px";
    p.el.style.top = p.y + "px";
  });

  checkFood();
  requestAnimationFrame(loop);
}

// FOOD
function placeFood() {
  food.style.left = Math.random() * (innerWidth - 20) + "px";
  food.style.top = Math.random() * (innerHeight - 20) + "px";
}

function checkFood() {
  let dx = snake[0].x - food.offsetLeft;
  let dy = snake[0].y - food.offsetTop;
  if (Math.hypot(dx, dy) < 18) {
    score++;
    scoreEl.innerText = score;
    saveScore();
    grow();
    placeFood();
  }
}

function grow() {
  let last = snake[snake.length - 1];
  let d = document.createElement("div");
  d.className = "snake";
  d.style.background = USERS[currentUser].color;
  game.appendChild(d);
  snake.push({ x: last.x, y: last.y, el: d });
}

// SAVE SCORE
function saveScore() {
  let scores = JSON.parse(localStorage.getItem("scores")) || {};
  scores[currentUser] = score;
  localStorage.setItem("scores", JSON.stringify(scores));
}

// PRESS Q TO END
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "q" && running) {
    running = false;
    alert(`Game Over! Score: ${score}`);
    game.style.display = "none";
    scoreBoard.style.display = "none";
    dashboard.style.display = "flex";
    loadDashboard();
  }
});
