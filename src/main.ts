import './style.css'

let highScore = parseInt(localStorage.getItem('dodgeHighScore') || '0')

const app = document.querySelector<HTMLDivElement>('#app')!

const renderHomeScreen = () => {
  app.innerHTML = `
    <div class="game-container">
      <div class="home-screen">
        <h1 class="game-title">🎮 60秒躲避挑战</h1>
        <p class="game-subtitle">坚持60秒，躲避所有障碍物！</p>
        
        <div class="high-score">
          <span class="high-score-label">🏆 最高纪录</span>
          <span class="high-score-value">${highScore}秒</span>
        </div>
        
        <div class="button-group">
          <button class="game-button btn-primary" id="startGameBtn">开始游戏</button>
          <button class="game-button btn-secondary" id="viewRulesBtn">游戏规则</button>
        </div>
      </div>
    </div>
  `

  document.getElementById('startGameBtn')?.addEventListener('click', () => {
    renderGameScreen()
  })

  document.getElementById('viewRulesBtn')?.addEventListener('click', () => {
    renderRulesScreen()
  })
}

const renderRulesScreen = () => {
  app.innerHTML = `
    <div class="game-container">
      <div class="rules-screen">
        <h2 class="rules-title">📖 游戏规则</h2>
        
        <div class="rules-content">
          <ul class="rules-list">
            <li>使用 <strong>方向键</strong> 或 <strong>WASD</strong> 控制角色移动</li>
            <li>躲避不断出现的障碍物</li>
            <li>坚持时间越长，得分越高</li>
            <li>碰到障碍物游戏结束</li>
            <li>最高记录会自动保存</li>
          </ul>
        </div>
        
        <button class="back-button" id="backToHomeBtn">返回主页</button>
      </div>
    </div>
  `

  document.getElementById('backToHomeBtn')?.addEventListener('click', () => {
    renderHomeScreen()
  })
}

const renderGameScreen = () => {
  app.innerHTML = `
    <div class="game-container">
      <div class="game-screen">
        <div class="game-header">
          <div class="game-timer">⏱️ 时间: <span id="gameTimer">0</span>秒</div>
          <div class="game-score">🏁 分数: <span id="gameScore">0</span></div>
        </div>
        <canvas id="gameCanvas" class="game-canvas" width="500" height="500"></canvas>
      </div>
    </div>
  `
  
  startGame()
}

const renderGameOverScreen = (score: number) => {
  const isNewRecord = score > highScore
  if (isNewRecord) {
    highScore = score
    localStorage.setItem('dodgeHighScore', highScore.toString())
  }

  app.innerHTML = `
    <div class="game-container">
      <div class="game-over-screen">
        <h2 class="game-over-title">💥 游戏结束</h2>
        
        <div class="final-score">
          <span class="final-score-label">生存时间</span>
          <span class="final-score-value">${score}秒</span>
        </div>
        
        ${isNewRecord ? '<div class="new-record">🎉 新纪录！</div>' : ''}
        
        <div class="button-group">
          <button class="game-button btn-primary" id="restartGameBtn">再来一局</button>
          <button class="game-button btn-secondary" id="backHomeBtn">返回主页</button>
        </div>
      </div>
    </div>
  `

  document.getElementById('restartGameBtn')?.addEventListener('click', () => {
    renderGameScreen()
  })

  document.getElementById('backHomeBtn')?.addEventListener('click', () => {
    renderHomeScreen()
  })
}

const startGame = () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  const timerEl = document.getElementById('gameTimer')!
  const scoreEl = document.getElementById('gameScore')!

  const CANVAS_WIDTH = 500
  const CANVAS_HEIGHT = 500
  const PLAYER_SIZE = 30
  const OBSTACLE_SIZE = 30
  const PLAYER_SPEED = 5
  const INITIAL_OBSTACLE_SPEED = 3

  let player = {
    x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    y: CANVAS_HEIGHT - PLAYER_SIZE - 20
  }

  let obstacles: Array<{ x: number; y: number; speed: number; color: string }> = []
  let keys: { [key: string]: boolean } = {}
  let gameTime = 0
  let obstacleTimer = 0
  let obstacleInterval = 60
  let animationId: number
  let lastTime = 0

  const colors = ['#e94560', '#ff6b6b', '#ffa502', '#ff4757', '#c0392b']

  const createObstacle = () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const speed = INITIAL_OBSTACLE_SPEED + gameTime / 600
    obstacles.push({
      x: Math.random() * (CANVAS_WIDTH - OBSTACLE_SIZE),
      y: -OBSTACLE_SIZE,
      speed,
      color
    })
  }

  const checkCollision = (rect1: { x: number; y: number }, rect2: { x: number; y: number }, size: number) => {
    return (
      rect1.x < rect2.x + size &&
      rect1.x + size > rect2.x &&
      rect1.y < rect2.y + size &&
      rect1.y + size > rect2.y
    )
  }

  const gameLoop = (timestamp: number) => {
    if (!lastTime) lastTime = timestamp
    const deltaTime = (timestamp - lastTime) / 16.67
    lastTime = timestamp

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
      ctx.fillRect(i, 0, 25, CANVAS_HEIGHT)
    }

    if (keys['ArrowLeft'] || keys['KeyA']) {
      player.x = Math.max(0, player.x - PLAYER_SPEED * deltaTime)
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      player.x = Math.min(CANVAS_WIDTH - PLAYER_SIZE, player.x + PLAYER_SPEED * deltaTime)
    }
    if (keys['ArrowUp'] || keys['KeyW']) {
      player.y = Math.max(0, player.y - PLAYER_SPEED * deltaTime)
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      player.y = Math.min(CANVAS_HEIGHT - PLAYER_SIZE, player.y + PLAYER_SPEED * deltaTime)
    }

    ctx.fillStyle = '#00ff88'
    ctx.beginPath()
    ctx.arc(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowColor = '#00ff88'
    ctx.shadowBlur = 15

    obstacleTimer += deltaTime
    if (obstacleTimer >= obstacleInterval) {
      createObstacle()
      obstacleTimer = 0
      obstacleInterval = Math.max(30, 60 - gameTime / 10)
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i]
      obs.y += obs.speed * deltaTime

      ctx.fillStyle = obs.color
      ctx.shadowColor = obs.color
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(obs.x + OBSTACLE_SIZE / 2, obs.y + OBSTACLE_SIZE / 2, OBSTACLE_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()

      if (checkCollision(player, obs, PLAYER_SIZE)) {
        cancelAnimationFrame(animationId)
        renderGameOverScreen(Math.floor(gameTime))
        return
      }

      if (obs.y > CANVAS_HEIGHT) {
        obstacles.splice(i, 1)
      }
    }

    ctx.shadowBlur = 0

    gameTime += deltaTime / 60
    timerEl.textContent = Math.floor(gameTime).toString()
    scoreEl.textContent = Math.floor(gameTime * 10).toString()

    if (gameTime >= 60) {
      cancelAnimationFrame(animationId)
      renderGameOverScreen(60)
      return
    }

    animationId = requestAnimationFrame(gameLoop)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    keys[e.code] = true
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    keys[e.code] = false
  }

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  animationId = requestAnimationFrame(gameLoop)
}

renderHomeScreen()