<template>
  <div class="home">
    <!-- 粒子动画背景 Canvas -->
    <use-particles />

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
 * 功能: 个人主页 + 个人信息卡片 + 多时区及系统运行时间
 * 技术: Vue 3 Composition API + 原生 Canvas 2D
 */

import { ref, onMounted, onBeforeUnmount } from 'vue'
import UseParticles from '../components/useParticles.vue'


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

  // 双时区初始化（每秒更新）
  updateTimezones()
  timezoneInterval = setInterval(updateTimezones, 1000)

  // 系统运行时间初始化（每分钟更新一次，减少性能开销）
  updateRunTime()
  runTimer = setInterval(updateRunTime, 60000)

  console.log('Home 组件已挂载,时区及运行时间计时器已启动')
})

onBeforeUnmount(() => {

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