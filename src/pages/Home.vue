<template>
  <div class="home">
    <!-- 粒子动画背景 Canvas -->
    <canvas ref="canvas" class="canvas-bg"></canvas>

    <!-- 页面内容层 -->
    <div class="content">

      <!-- 系统信息卡片（运行状态与技术栈） -->
     <div class="time-card">
      <div class="time-China">
        <span class="city">CN 北京时间</span>
        <span class="time">{{ beijingTime }}</span>
      </div>
      <div class="system-runTime">
        <span class="city">系统已稳定运行</span>
        <span class="time">{{ runTime }}</span>
      </div>
      <div class="time-Korea">
        <span class="city">KR 首尔时间</span>
        <span class="time">{{ seoulTime }}</span>
      </div>
     </div>

      <!-- 个人信息卡片 -->
      <div class="profile-card">
        <!-- 左侧: 头像区域 -->
        <div class="profile-left">
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <img src="/images/firstPhoto.jpg" alt="头像" class="avatar-img" />
            </div>
            <h1 class="name">北极星.天赐</h1>
          </div>
        </div>

        <!-- 右侧: 文字内容区域 -->
        <div class="profile-right">
          <h1>终究平凡不平庸</h1>
          <p class="subtitle">「在慢慢写代码,也在慢慢生活」</p>
          <p class="desc">
            暂时没啥特别的东西,就是想慢慢记录一些东西。<br />
          </p>
        </div>
      </div>

      <!-- 链接区 -->
      <p class="link-title">链接区</p>
      <div class="links">
        <router-link to="/union" class="btn">
          <i class="fas fa-university"></i> 建国大学中国留学生学生会官网 →
        </router-link>
        <router-link to="/projects" class="btn">
          <i class="fas fa-laptop-code"></i> 看看我做的东西 →
        </router-link>
      </div>

      
 

    </div>
  </div>
</template>

<script setup>
/**
 * Home 页面组件
 * 功能: 个人主页 + Canvas 粒子连线动画背景 + 个人信息卡片 + 多时区及系统运行时间
 * 技术: Vue 3 Composition API + 原生 Canvas 2D
 */

import { ref, onMounted, onBeforeUnmount } from 'vue'

// ==================== 配置常量 ====================
/** 粒子数量 */
const PARTICLE_COUNT = 60
/** 连线最大距离阈值(超过此距离不绘制连线) */
const LINE_MAX_DISTANCE = 120
/** 粒子运动速度范围 */
const PARTICLE_SPEED = 0.8
/** 粒子半径范围 */
const PARTICLE_RADIUS_MIN = 1
const PARTICLE_RADIUS_MAX = 3
/** 连线粗细 */
const LINE_WIDTH = 0.6
/** 防抖延迟(毫秒) */
const RESIZE_DEBOUNCE_DELAY = 200

// ==================== 响应式引用 ====================
/** Canvas DOM 引用 */
const canvas = ref(null)

// ==================== 状态变量 ====================
/** Canvas 2D 上下文 */
let ctx = null
/** 画布宽度 */
let width = 0
/** 画布高度 */
let height = 0
/** 粒子数组 */
let particles = []
/** 动画帧 ID,用于清理 */
let animationFrameId = null
/** 防抖定时器 ID */
let resizeTimer = null

// ==================== 粒子类定义 ====================
/**
 * 创建单个粒子对象
 * @returns {Object} 粒子配置对象
 */
function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * PARTICLE_SPEED,
    vy: (Math.random() - 0.5) * PARTICLE_SPEED,
    radius: Math.random() * (PARTICLE_RADIUS_MAX - PARTICLE_RADIUS_MIN) + PARTICLE_RADIUS_MIN,
    color: `rgba(170, 204, 255,${Math.random() * 0.5 + 0.3})`,
  }
}

// ==================== 核心功能函数 ====================

/**
 * 初始化 Canvas 尺寸并适配窗口
 */
function resizeCanvas() {
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width
  canvas.value.height = height
}

/**
 * 初始化所有粒子
 */
function initParticles() {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle())
  }
}

/**
 * 绘制粒子之间的连线
 */
function drawLines() {
  const particleCount = particles.length
  for (let i = 0; i < particleCount; i++) {
    const p1 = particles[i]
    for (let j = i + 1; j < particleCount; j++) {
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distSquared = dx * dx + dy * dy
      const maxDistSquared = LINE_MAX_DISTANCE * LINE_MAX_DISTANCE
      if (distSquared < maxDistSquared) {
        const dist = Math.sqrt(distSquared)
        const opacity = 1 - dist / LINE_MAX_DISTANCE
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(108, 140, 255,${opacity})`
        ctx.lineWidth = LINE_WIDTH
        ctx.stroke()
      }
    }
  }
}

/**
 * 更新单个粒子位置并处理边界碰撞
 */
function updateParticle(particle) {
  particle.x += particle.vx
  particle.y += particle.vy
  if (particle.x - particle.radius < 0 || particle.x + particle.radius > width) {
    particle.vx = -particle.vx
  }
  if (particle.y - particle.radius < 0 || particle.y + particle.radius > height) {
    particle.vy = -particle.vy
  }
}

/**
 * 绘制单个粒子圆点
 */
function drawParticle(particle) {
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
  ctx.fillStyle = particle.color
  ctx.fill()
}

/**
 * 动画主循环
 */
function animate() {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, width, height)
  for (const particle of particles) {
    updateParticle(particle)
    drawParticle(particle)
  }
  drawLines()
  animationFrameId = requestAnimationFrame(animate)
}

/**
 * 处理窗口大小变化(带防抖优化)
 */
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resizeCanvas()
    initParticles()
  }, RESIZE_DEBOUNCE_DELAY)
}

// ==================== 时区与系统运行时间 ====================
/** 北京时间 (UTC+8) */
const beijingTime = ref('')
/** 首尔时间 (UTC+9) */
const seoulTime = ref('')
/** 系统运行时间（从组件挂载开始计时） */
const runTime = ref('0天0小时0分钟')
/** 时区更新定时器ID */
let timezoneInterval = null
/** 系统运行时间更新定时器ID（每分钟更新一次） */
let runTimer = null
/** 固定部署时间戳（毫秒）—— 请根据实际部署时间修改 */
const DEPLOY_TIME = new Date('2026-05-07T00:00:00+08:00').getTime()

// ==================== 时区与运行时间更新函数 ====================
/** 更新北京时间与首尔时间（每秒） */
function updateTimezones() {
  const now = new Date()    
  // 北京时间 UTC+8
  const beijingDate = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  // 首尔时间 UTC+9
  const seoulDate = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const format = (date) => date.toISOString().slice(11, 19) // HH:MM:SS
  beijingTime.value = format(beijingDate)
  seoulTime.value = format(seoulDate)
}

/** 更新系统运行时间（从组件挂载开始计时，每分钟更新） */
function updateRunTime() {

  const elapsedSeconds = Math.floor((Date.now() - DEPLOY_TIME) / 1000)
  const days = Math.floor(elapsedSeconds / 86400)
  const hours = Math.floor((elapsedSeconds % 86400) / 3600)
  
  if (days === 0 && hours === 0) {
    runTime.value = '小于1小时'
  } else if (days === 0) {
    runTime.value = `${hours}小时`
  } else {
    runTime.value = `${days}天${hours}小时`
  }
}

// ==================== 生命周期钩子 ====================
onMounted(() => {

  // 粒子动画初始化
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  initParticles()
  animate()
  window.addEventListener('resize', handleResize)

  // 双时区初始化（每秒更新）
  updateTimezones()
  timezoneInterval = setInterval(updateTimezones, 1000)

  // 系统运行时间初始化（每分钟更新一次，减少性能开销）
  updateRunTime()
  runTimer = setInterval(updateRunTime, 60000)

  console.log('Home 组件已挂载,粒子动画已启动,时区及运行时间计时器已启动')
  console.log(`画布尺寸: ${width}x${height}, 粒子数量: ${PARTICLE_COUNT}`)
})

onBeforeUnmount(() => {
  // 停止动画循环
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
  // 清除防抖定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }
  // 清除时区定时器
  if (timezoneInterval) {
    clearInterval(timezoneInterval)
    timezoneInterval = null
  }
  // 清除运行时间定时器
  if (runTimer) {
    clearInterval(runTimer)
    runTimer = null
  }
  // 清理引用和状态
  ctx = null
  particles = []

  console.log('🧹 Home 组件资源已清理')
})
</script>

<style scoped>
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.home {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.canvas-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: max(8rem, env(safe-area-inset-top));
  padding-bottom: max(2rem, env(safe-area-inset-bottom));
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
  box-sizing: border-box;
}

/* ==================== 时间卡片 ==================== */

.time-card {
  max-width: 900px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 32px;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.time-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.time-China,
.system-runTime,
.time-Korea {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.city {
  font-size: 1rem;
  color: #a1f2ea;
  font-weight: 500;
  letter-spacing: 1px;
}

.time {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  font-family: monospace;
  letter-spacing: 2px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* ==================== 个人信息卡片 ==================== */

.profile-card {
  max-width: 900px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 32px;
  padding: 2rem 2rem 2rem 10rem;
  display: flex;
  align-items: center;
  gap: 10rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 3rem;
  margin-top: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.profile-left {
  flex-shrink: 0;
  text-align: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.name {
  font-size: 1.3rem;
  color: white;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.profile-right {
  flex: 1;
  text-align: left;
}

.profile-right h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  font-weight: 700;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.1rem;
  color: #a1f2ea;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-weight: 500;
}

.desc {
  color: #e0f2fe;
  line-height: 1.8;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  font-size: 0.95rem;
  margin: 0;
}

/* ==================== 链接区 ==================== */

.link-title {
  color: #aef9ee;
  font-size: 1.5rem;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.link-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #aef9ee, transparent);
  border-radius: 2px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 280px;
  max-width: 90%;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 40px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  color: white;
}

/* ==================== 响应式：平板 768px ==================== */

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .profile-right {
    text-align: center;
  }

  .profile-right h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .avatar-circle {
    width: 100px;
    height: 100px;
  }
}

/* ==================== 响应式：手机 640px（时间卡片） ==================== */

@media (max-width: 640px) {
  .time-card {
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem;
  }

  .time {
    font-size: 1.5rem;
  }
}

/* ==================== 响应式：小手机 480px ==================== */

@media (max-width: 480px) {
  .profile-card {
    padding: 1rem;
    border-radius: 24px;
  }

  .profile-right h1 {
    font-size: 1.6rem;
  }

  .desc {
    font-size: 0.9rem;
  }

  .btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 0.95rem;
  }

  .links {
    gap: 20px;
  }
}
</style>