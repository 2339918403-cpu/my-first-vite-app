(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=parseInt(localStorage.getItem(`dodgeHighScore`)||`0`),t=document.querySelector(`#app`),n=()=>{t.innerHTML=`
    <div class="game-container">
      <div class="home-screen">
        <h1 class="game-title">🎮 60秒躲避挑战</h1>
        <p class="game-subtitle">坚持60秒，躲避所有障碍物！</p>
        
        <div class="high-score">
          <span class="high-score-label">🏆 最高纪录</span>
          <span class="high-score-value">${e}秒</span>
        </div>
        
        <div class="button-group">
          <button class="game-button btn-primary" id="startGameBtn">开始游戏</button>
          <button class="game-button btn-secondary" id="viewRulesBtn">游戏规则</button>
        </div>
      </div>
    </div>
  `,document.getElementById(`startGameBtn`)?.addEventListener(`click`,()=>{i()}),document.getElementById(`viewRulesBtn`)?.addEventListener(`click`,()=>{r()})},r=()=>{t.innerHTML=`
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
  `,document.getElementById(`backToHomeBtn`)?.addEventListener(`click`,()=>{n()})},i=()=>{t.innerHTML=`
    <div class="game-container">
      <div class="game-screen">
        <div class="game-header">
          <div class="game-timer">⏱️ 时间: <span id="gameTimer">0</span>秒</div>
          <div class="game-score">🏁 分数: <span id="gameScore">0</span></div>
        </div>
        <canvas id="gameCanvas" class="game-canvas" width="500" height="500"></canvas>
      </div>
    </div>
  `,o()},a=r=>{let a=r>e;a&&(e=r,localStorage.setItem(`dodgeHighScore`,e.toString())),t.innerHTML=`
    <div class="game-container">
      <div class="game-over-screen">
        <h2 class="game-over-title">💥 游戏结束</h2>
        
        <div class="final-score">
          <span class="final-score-label">生存时间</span>
          <span class="final-score-value">${r}秒</span>
        </div>
        
        ${a?`<div class="new-record">🎉 新纪录！</div>`:``}
        
        <div class="button-group">
          <button class="game-button btn-primary" id="restartGameBtn">再来一局</button>
          <button class="game-button btn-secondary" id="backHomeBtn">返回主页</button>
        </div>
      </div>
    </div>
  `,document.getElementById(`restartGameBtn`)?.addEventListener(`click`,()=>{i()}),document.getElementById(`backHomeBtn`)?.addEventListener(`click`,()=>{n()})},o=()=>{let e=document.getElementById(`gameCanvas`).getContext(`2d`),t=document.getElementById(`gameTimer`),n=document.getElementById(`gameScore`),r={x:500/2-30/2,y:450},i=[],o={},s=0,c=0,l=60,u,d=0,f=[`#e94560`,`#ff6b6b`,`#ffa502`,`#ff4757`,`#c0392b`],p=()=>{let e=f[Math.floor(Math.random()*f.length)],t=3+s/600;i.push({x:Math.random()*470,y:-30,speed:t,color:e})},m=(e,t,n)=>e.x<t.x+n&&e.x+n>t.x&&e.y<t.y+n&&e.y+n>t.y,h=f=>{d||=f;let g=(f-d)/16.67;d=f,e.clearRect(0,0,500,500),e.fillStyle=`rgba(255, 255, 255, 0.05)`;for(let t=0;t<500;t+=50)e.fillRect(t,0,25,500);(o.ArrowLeft||o.KeyA)&&(r.x=Math.max(0,r.x-5*g)),(o.ArrowRight||o.KeyD)&&(r.x=Math.min(470,r.x+5*g)),(o.ArrowUp||o.KeyW)&&(r.y=Math.max(0,r.y-5*g)),(o.ArrowDown||o.KeyS)&&(r.y=Math.min(470,r.y+5*g)),e.fillStyle=`#00ff88`,e.beginPath(),e.arc(r.x+30/2,r.y+30/2,30/2,0,Math.PI*2),e.fill(),e.shadowColor=`#00ff88`,e.shadowBlur=15,c+=g,c>=l&&(p(),c=0,l=Math.max(30,60-s/10));for(let t=i.length-1;t>=0;t--){let n=i[t];if(n.y+=n.speed*g,e.fillStyle=n.color,e.shadowColor=n.color,e.shadowBlur=10,e.beginPath(),e.arc(n.x+30/2,n.y+30/2,30/2,0,Math.PI*2),e.fill(),m(r,n,30)){cancelAnimationFrame(u),a(Math.floor(s));return}n.y>500&&i.splice(t,1)}if(e.shadowBlur=0,s+=g/60,t.textContent=Math.floor(s).toString(),n.textContent=Math.floor(s*10).toString(),s>=60){cancelAnimationFrame(u),a(60);return}u=requestAnimationFrame(h)};window.addEventListener(`keydown`,e=>{o[e.code]=!0}),window.addEventListener(`keyup`,e=>{o[e.code]=!1}),u=requestAnimationFrame(h)};n();