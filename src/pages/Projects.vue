<template>
  <div class="projects-page">
    <!-- 粒子背景 Canvas -->
    <canvas ref="canvas" class="canvas-bg"></canvas>

    <!-- 页面内容层 -->
    <div class="content">
      <div class="container">
        <h1 class="page-title">我的技术栈</h1>
        <div class="skills">
          <span>HTML / CSS</span>
          <span>JavaScript</span>
          <span>Vue</span>
          <span>C / C++</span>
          <span>Java</span>
          <span>Python</span>
          <span>MySQL</span>
          <span>Android / Kotlin</span>
        </div>

        <h1 class="page-title">我的项目</h1>
        <p class="page-subtitle">点击下方卡片查看项目 -> github仓库</p>
        <div class="projects-grid">
          <div v-for="project in projects" :key="project.id" class="project-card" @click="openLink(project.url)">
            <div class="card-img">
              <img :src="project.image" alt="project image">
            </div>
            <div class="card-content">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="technologies-tags">
                <span v-for="tech in project.technologies" :key="tech" class="tag">{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ==================== 粒子配置 ====================
const PARTICLE_COUNT = 60
const LINE_MAX_DISTANCE = 120
const PARTICLE_SPEED = 0.8
const PARTICLE_RADIUS_MIN = 1
const PARTICLE_RADIUS_MAX = 3
const LINE_WIDTH = 0.6
const RESIZE_DEBOUNCE_DELAY = 200

const canvas = ref(null)
let ctx = null
let width = 0, height = 0
let particles = []
let animationFrameId = null
let resizeTimer = null

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * PARTICLE_SPEED,
    vy: (Math.random() - 0.5) * PARTICLE_SPEED,
    radius: Math.random() * (PARTICLE_RADIUS_MAX - PARTICLE_RADIUS_MIN) + PARTICLE_RADIUS_MIN,
    color: `rgba(170, 204, 255, ${Math.random() * 0.5 + 0.3})`,
  }
}

function resizeCanvas() {
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width
  canvas.value.height = height
}

function initParticles() {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle())
  }
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distSq = dx * dx + dy * dy
      const maxDistSq = LINE_MAX_DISTANCE * LINE_MAX_DISTANCE
      if (distSq < maxDistSq) {
        const dist = Math.sqrt(distSq)
        const opacity = 1 - dist / LINE_MAX_DISTANCE
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(108, 140, 255, ${opacity})`
        ctx.lineWidth = LINE_WIDTH
        ctx.stroke()
      }
    }
  }
}

function updateParticle(p) {
  p.x += p.vx
  p.y += p.vy
  if (p.x - p.radius < 0 || p.x + p.radius > width) p.vx = -p.vx
  if (p.y - p.radius < 0 || p.y + p.radius > height) p.vy = -p.vy
}

function drawParticle(p) {
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
  ctx.fillStyle = p.color
  ctx.fill()
}

function animate() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  for (const p of particles) {
    updateParticle(p)
    drawParticle(p)
  }
  drawLines()
  animationFrameId = requestAnimationFrame(animate)
}

function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resizeCanvas()
    initParticles()
  }, RESIZE_DEBOUNCE_DELAY)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  initParticles()
  animate()
  window.addEventListener('resize', handleResize)
  console.log('✅ Projects 组件粒子背景已启动')
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
  if (resizeTimer) clearTimeout(resizeTimer)
  ctx = null
  particles = []
  console.log('🧹 Projects 组件粒子资源已清理')
})

// ==================== 项目数据和方法 ====================
const projects = [
  {
    id: 1,
    title: '建国大学中国留学生学生会官网',
    description: '这是我为建国大学中国留学生学生会开发的官方网站。基于 Vue.js + Node.js 的全栈管理系统。前端部署于 GitHub Pages，后端托管于 Render，数据库采用 Supabase。提供了活动信息、成员介绍等',
    technologies: ['Vue.js', 'Node.js', 'Express', 'Supabase', 'Render'],
    image: '/images/proj_1.png',
    url: 'https://github.com/beijixingtianci/beijixingtianci.github.io'
  },
  {
    id: 2,
    title: '三国杀',
    description: '团体项目，使用unity开发的三国杀游戏，包含基本的游戏逻辑和界面设计',
    technologies: ['Unity', 'C#'],
    image: '/images/proj_2.png',
    url: 'https://github.com/Neodranka/ThreeKingdom_Cardgame'
  }
]

function openLink(url) {
  if (url) window.open(url, '_blank')
}
</script>

<style scoped>
/* 页面容器与粒子层 */
.projects-page {
  position: relative;
  min-height: 100vh;
  background: transparent;  /* 让粒子背景显现 */
  overflow-x: hidden;
  background-image: url('/images/background.jpg');  /* 背景图片路径 */
  background-size: cover;   /* 背景图片覆盖整个屏幕 */
  background-position: center;    /* 背景图片居中 */
  background-attachment: fixed;   /* 背景图片固定在视口 */
}

.canvas-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  padding: 50px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面标题样式（与整体风格搭配） */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: white;
  text-shadow: 0 2px 5px rgba(0,0,0,0.3);
  margin-top: 100px;
  margin-bottom: 1rem;
}

.page-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #000608;
  margin-bottom: 2rem;
}

/* 技术栈标签 */
.skills {
  margin: 1rem 0 3rem;
  text-align: center;
}
.skills span {
  display: inline-block;
  margin: 5px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border-radius: 30px;
  font-size: 0.85rem;
  color: #e0f2fe;
  border: 1px solid rgba(255,255,255,0.2);
}

/* 项目网格 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.card-img {
  width: 100%;
  height: 180px;
  overflow: hidden;
}
.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.2rem;
}
.card-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  color: white;
}
.card-content p {
  color: #cbd5e6;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}
.technologies-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  background: rgba(255, 255, 255, 0.2);
  color: #e0f2fe;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

/* 响应式 */
@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .content {
    padding: 30px 0;
  }
  .page-title {
    font-size: 1.8rem;
  }
}
</style>