<template>
  <canvas ref="canvas" class="canvas-bg"></canvas>
</template>

<script setup>
// Canvas 粒子连线动画背景 
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

// ==================== 生命周期钩子 ====================
onMounted(() => {

  // 粒子动画初始化
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  initParticles()
  animate()
  window.addEventListener('resize', handleResize)

  console.log('✅ 粒子背景已启动')
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
  // 清理引用和状态
  ctx = null
  particles = []

  console.log('🧹 粒子背景资源已清理')
})
</script>

<style scoped>
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
</style>