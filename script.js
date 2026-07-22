(() => {
  const canvas = document.querySelector('#game-canvas');
  const ctx = canvas.getContext('2d');
  const startButton = document.querySelector('#start-game');
  const pauseButton = document.querySelector('#pause-game');
  const message = document.querySelector('#game-message');
  const timeScore = document.querySelector('#time-score');
  const lengthScore = document.querySelector('#length-score');
  const levelScore = document.querySelector('#level-score');
  const enemyScore = document.querySelector('#enemy-score');
  const highScore = document.querySelector('#high-score');
  const cols = 24;
  const rows = 16;
  const cell = canvas.width / cols;
  const baseTick = 140;
  const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  let snake;
  let food;
  let enemies;
  let direction;
  let nextDirection;
  let timer;
  let startedAt;
  let level;
  let gameRunning = false;
  let paused = false;
  let high = Number(localStorage.getItem('justin-snake-high-score') || 0);
  highScore.textContent = high;

  const same = (a, b) => a.x === b.x && a.y === b.y;
  const randomCell = () => ({ x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) });
  const occupied = (spot) => snake.some((part) => same(part, spot)) || enemies.some((enemy) => same(enemy, spot));

  function openCell() {
    let spot = randomCell();
    let attempts = 0;
    while (occupied(spot) && attempts < 200) { spot = randomCell(); attempts += 1; }
    return spot;
  }

  function resetGame() {
    snake = [{ x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }];
    direction = directions.right;
    nextDirection = direction;
    level = 1;
    enemies = [{ x: 5, y: 4 }];
    food = openCell();
    renderHud(0);
    draw();
  }

  function renderHud(seconds) {
    timeScore.textContent = seconds;
    lengthScore.textContent = snake.length;
    levelScore.textContent = level;
    enemyScore.textContent = enemies.length;
  }

  function setDirection(name) {
    const candidate = directions[name];
    if (!candidate || (candidate.x + direction.x === 0 && candidate.y + direction.y === 0)) return;
    nextDirection = candidate;
  }

  function startGame() {
    window.clearInterval(timer);
    resetGame();
    startedAt = Date.now();
    gameRunning = true;
    paused = false;
    startButton.textContent = 'Restart game';
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';
    message.hidden = true;
    timer = window.setInterval(tick, baseTick);
  }

  function endGame() {
    gameRunning = false;
    paused = false;
    window.clearInterval(timer);
    pauseButton.disabled = true;
    pauseButton.textContent = 'Pause';
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    const score = seconds + snake.length;
    if (score > high) { high = score; highScore.textContent = high; localStorage.setItem('justin-snake-high-score', String(high)); }
    message.innerHTML = `<strong>GAME OVER</strong><span>Score: ${score}</span><span>Press restart to try again</span>`;
    message.hidden = false;
  }

  function moveEnemies() {
    enemies = enemies.map((enemy) => {
      const choices = Object.values(directions).filter((move) => {
        const next = { x: enemy.x + move.x, y: enemy.y + move.y };
        return next.x >= 0 && next.x < cols && next.y >= 0 && next.y < rows && !same(next, snake[0]);
      });
      const move = choices[Math.floor(Math.random() * choices.length)] || directions.right;
      return { x: enemy.x + move.x, y: enemy.y + move.y };
    });
  }

  function tick() {
    if (!gameRunning || paused) return;
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some((part) => same(part, head)) || enemies.some((enemy) => same(enemy, head))) { endGame(); return; }
    snake.unshift(head);
    if (same(head, food)) food = openCell(); else snake.pop();
    const nextLevel = Math.floor(seconds / 30) + 1;
    while (level < nextLevel) { level += 1; enemies.push(openCell()); }
    moveEnemies();
    if (enemies.some((enemy) => snake.some((part) => same(enemy, part)))) { endGame(); return; }
    renderHud(seconds);
    draw();
  }

  function drawCell(spot, color, inset = 2) { ctx.fillStyle = color; ctx.fillRect(spot.x * cell + inset, spot.y * cell + inset, cell - inset * 2, cell - inset * 2); }
  function draw() {
    ctx.fillStyle = '#1b1b1b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < cols; x += 1) { for (let y = 0; y < rows; y += 1) { if ((x + y) % 2 === 0) { ctx.fillStyle = '#202020'; ctx.fillRect(x * cell, y * cell, cell, cell); } } }
    drawCell(food, '#ffd447', 3);
    enemies.forEach((enemy) => { drawCell(enemy, '#ff4d3d', 2); ctx.fillStyle = '#151515'; ctx.fillRect(enemy.x * cell + 8, enemy.y * cell + 8, 4, 4); });
    snake.forEach((part, index) => drawCell(part, index === 0 ? '#b9ef75' : '#39bdf0', 2));
  }

  document.addEventListener('keydown', (event) => {
    const keyMap = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
    if (event.key === ' ' || event.key === 'p' || event.key === 'P') { event.preventDefault(); togglePause(); return; }
    if (keyMap[event.key]) { event.preventDefault(); setDirection(keyMap[event.key]); }
  });
  document.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('pointerdown', () => setDirection(button.dataset.direction)));
  startButton.addEventListener('click', startGame);
  function togglePause() {
    if (!gameRunning) return;
    paused = !paused;
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
    message.innerHTML = '<strong>PAUSED</strong><span>Press Pause, P, or Space to resume</span>';
    message.hidden = !paused;
  }
  pauseButton.addEventListener('click', togglePause);
  resetGame();
})();
