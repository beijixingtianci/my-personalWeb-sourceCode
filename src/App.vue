<template>
  <div>
    <nav v-if="$route.name !== 'union'" class="navbar">
      <div class="logo">北极星.天赐</div>

      <div class="nav-links" :class="{ open: isOpen }">
        <router-link to="/" exact-active-class="active">首页</router-link>
        <router-link to="/projects" active-class="active">项目</router-link>
        <a href="javascript:void(0)" @click="openQrModal" :class="{ active: $route.name === 'contact' }">联系作者</a>
      </div>

      <div class="menu-btn" @click="toggleMenu">☰</div>
    </nav>

    <router-view />

    <!-- 微信二维码模态框 -->
    <div v-if="showQrModal" class="modal-overlay" @click="closeQrModal">
      <div class="modal-container" @click.stop>
        <button class="modal-close" @click="closeQrModal">&times;</button>
        <h3>扫码联系我</h3>
        <p>扫描下方二维码添加微信</p>
        <img src="/images/QR.png" alt="QrCode" class="qr-code">
        <p class="wechat-id">微信号：<strong>A14949420167</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

.navbar {
  width: 100%;
  padding: 22px 40px;
  box-sizing: border-box;

  /* 1. 背景改为沉浸式：深色半透明 + 毛玻璃模糊 */
  background: rgba(15, 23, 42, 0.6); /* 深蓝黑半透明 */
  backdrop-filter: blur(12px); /* 核心：毛玻璃模糊效果 */
  -webkit-backdrop-filter: blur(12px); /* 兼容 Safari */

  /* 2. 布局 */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 3. 极光边框：底部加一道微光 */
  border-bottom: 1px solid rgba(161, 242, 234, 0.2); /* 极淡的青色边框 */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); /* 增加一点阴影增加层次感 */

  /* 4. 定位：固定在顶部 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100; /* 确保在粒子特效之上，但在模态框之下 */
  transition: all 0.3s ease; /* 平滑过渡 */
}

/* 可选：鼠标悬停时，边框变亮一点点 */
.navbar:hover {
  border-bottom: 1px solid rgba(161, 242, 234, 0.4);
  background: rgba(15, 23, 42, 0.75);
}

.logo {
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(161, 242, 234, 0.5); /* 给Logo加一点点发光 */
}

.nav-links {
  display: flex;
  gap: 20px;
}

a {
  color: #e2e8f0; /* 稍微柔和一点的白色 */
  text-decoration: none;
  transition: 0.3s;
  font-weight: 500;
}

a:hover {
  color: #a1f2ea; /* 悬停变成极光青 */
  text-shadow: 0 0 8px rgba(161, 242, 234, 0.6);
  opacity: 0.7;
}

.active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

.menu-btn {
  display: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

/* 模态框遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #e74c3c;
}

.qr-code {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  margin: 1rem auto;
  display: block;
  border-radius: 12px;
  object-fit: contain;
}

.wechat-id {
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .nav-links {
    position: absolute;
    top: 60px;
    right: 0;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    flex-direction: column;
    width: 200px;
    display: none;
    padding: 20px;
    border-radius: 0 0 12px 12px; /* 底部圆角，更好看 */
    border: 1px solid rgba(161, 242, 234, 0.2); /* 加上和导航栏一样的极光边框 */
  }
  .nav-links.open {
    display: flex;
  }
  .menu-btn {
    display: block;
  }
}
</style>

<script>
export default {
  data() {
    return {
      isOpen: false,
      showQrModal: false
    }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    openQrModal() {
      this.showQrModal = true
      document.body.style.overflow = 'hidden'
    },
    closeQrModal() {
      this.showQrModal = false
      document.body.style.overflow = ''
    }
  }
}
</script>