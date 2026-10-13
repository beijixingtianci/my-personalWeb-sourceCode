<template>
  <div class="ai-chat-card" :class="themeClass" :style="cssVars">
    <!-- 标题栏 -->
    <div class="chat-header">
      <div class="header-left">
        <div class="status-dot"></div>
        <span class="header-title">{{ botName }}</span>
      </div>
      <span class="header-hint">
        {{ source === 'student' ? '关于校园生活，问它就知道 ✨' : '关于我的一切，问它就知道 ✨' }}
      </span>
    </div>

    <!-- 消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-row"
        :class="msg.sender"
      >
        <!-- AI 头像 -->
        <div v-if="msg.sender === 'bot'" class="avatar-bot">
          <img v-if="isImageAvatar(botAvatar)" :src="botAvatar" alt="AI" />
          <span v-else>{{ botAvatar }}</span>
        </div>
        <!-- 消息气泡 -->
        <div class="bubble" :class="msg.sender">
          <span v-html="msg.content"></span>
        </div>
        <!-- 用户头像 -->
        <div v-if="msg.sender === 'user'" class="avatar-user">
          <img v-if="isImageAvatar(userAvatar)" :src="userAvatar" alt="你" />
          <span v-else>{{ userAvatar }}</span>
        </div>
      </div>

      <!-- 打字中指示器 -->
      <div v-if="isTyping" class="message-row bot">
        <div class="avatar-bot">
          <img v-if="isImageAvatar(botAvatar)" :src="botAvatar" alt="AI" />
          <span v-else>{{ botAvatar }}</span>
        </div>
        <div class="bubble bot typing-indicator">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- 快捷回复 -->
    <div class="quick-replies" v-if="messages.length <= 1">
      <button
        v-for="q in currentQuickQuestions"
        :key="q"
        class="quick-btn"
        @click="sendQuickReply(q)"
      >
        {{ q }}
      </button>
    </div>

    <!-- 输入框 -->
    <div class="chat-input-bar">
      <input
        v-model="inputText"
        type="text"
        class="chat-input"
        :placeholder="source === 'student' ? '输入你想了解的...' : '输入你想问的...'"
        @keyup.enter="sendMessage"
        :disabled="isTyping"
      />
      <button
        class="send-btn"
        @click="sendMessage"
        :disabled="!inputText.trim() || isTyping"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * AI 对话组件（可复用版）
 * 功能: 调用 Render 后端 /api/chat → 智谱 GLM-4-Flash 真实对话
 * 技术: Vue 3 Composition API + fetch
 * 特性: 支持多页面复用，根据 source 自动切换亮/暗主题
 */

import { ref, computed, nextTick, onMounted } from 'vue'

// ==================== Props 配置 ====================
const props = defineProps({
  /** 来源标识：personal | student（未来可扩展：'xxx'） */
  source: {
    type: String,
    default: 'personal',
    validator: (v) => ['personal', 'student'].includes(v)
  },
  /** 主题（可选，不传则根据 source 自动判断） */
  theme: {
    type: String,
    default: '',  // 空字符串表示自动判断
    validator: (v) => ['', 'dark', 'light'].includes(v)
  },
  /** 主题色（十六进制，控制按钮、头像边框等） */
  primaryColor: {
    type: String,
    default: '#667eea'  // 原来的极光青
  },
  /** AI 助手名称 */
  botName: {
    type: String,
    default: 'AI 小秘书'
  },
  /** AI 头像（图片路径如 '/images/logo.jpg'，或 Emoji 如 '🤖'） */
  botAvatar: {
    type: String,
    default: '/images/firstPhoto.jpg'
  },
  /** 用户头像（图片路径或 Emoji） */
  userAvatar: {
    type: String,
    default: '👤'
  }
})

// ==================== 后端配置 ====================
/** Render 后端 base URL */
const API_BASE = 'https://my-personalweb-backend.onrender.com'

// ==================== 计算属性 ====================

/**
 * 将十六进制主题色转为 RGB 字符串
 * 供 CSS 的 rgba() 使用，如：rgba(var(--primary-rgb), 0.3)
 */
const primaryRGB = computed(() => {
  const hex = props.primaryColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
})

/** 注入到根元素的 CSS 变量 */
const cssVars = computed(() => ({
  '--primary': props.primaryColor,
  '--primary-rgb': primaryRGB.value
}))

/**
 * 主题判断（核心逻辑）
 * 优先级：theme prop > source 自动推断 > 默认 dark
 * ✅ 未来扩展：新页面只需在 themeMap 里加一行
 */
const themeClass = computed(() => {
  // 第一优先级：显式传了 theme prop（如 theme="light"）
  if (props.theme) return props.theme
  
  // 第二优先级：根据 source 自动推断
  const themeMap = {
    'student': 'light',    // 学生会网站 → 亮色主题
    'personal': 'dark',    // 个人网站 → 暗色主题
    // TODO: 未来扩展新页面，在这里加一行即可，如：
    // 'club': 'light',
    // 'admin': 'dark',
  }
  return themeMap[props.source] || 'dark'  // 默认暗色
})

/** 根据 source 返回不同的快捷问题列表 */
const currentQuickQuestions = computed(() => {
  if (props.source === 'student') {
    return ['如何提交TOPIK成绩？', '选课如何操作？', '如何加入学生会？', '如何让AI鹅秘书更加智能？', '联系方式？']
  }
  // 默认个人网站的问题
  return ['你是谁？', '你能做什么？', '在做什么项目？', '怎么联系？', '学校和专业？']
})

/** 根据 source 返回不同的欢迎语 */
const welcomeMessage = computed(() => {
  if (props.source === 'student') {
    return (
      `你好！我是 ${props.botName} <br/><br/>` +
      '你可以问我关于校园生活的问题，比如：<br/>' +
      '&emsp;🔹 如何提交TOPIK成绩？<br/>' +
      '&emsp;🔹 选课如何操作？<br/>' +
      '&emsp;🔹 如何加入学生会？<br/><br/>' +
      '也可以直接打字输入，或者点击下方的快捷按钮~'
    )
  }
  return (
    `你好！我是 ${props.botName} 🤖<br/><br/>` +
    '你可以问我关于他的任何事情，比如：<br/>' +
    '&emsp;🔹 他是谁？<br/>' +
    '&emsp;🔹 你能做什么？<br/>' +
    '&emsp;🔹 在做什么项目？<br/><br/>' +
    '也可以直接打字输入，或者点击下方的快捷按钮~'
  )
})

// ==================== 工具函数 ====================

/** 判断头像是否是图片路径（以 / 或 http 开头） */
function isImageAvatar(avatar) {
  return avatar && (avatar.startsWith('/') || avatar.startsWith('http'))
}

/** 自动滚动到消息底部 */
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// ==================== 响应式状态 ====================
/** 消息列表 */
const messages = ref([])
/** 用户输入内容 */
const inputText = ref('')
/** 是否正在"打字"（模拟延迟） */
const isTyping = ref(false)
/** 消息容器 DOM 引用（用于自动滚动） */
const messagesContainer = ref(null)

// ==================== 核心函数 ====================

/**
 * 发送用户消息，调用后端 /api/chat → 智谱 GLM-4-Flash
 */
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isTyping.value) return

  // 添加用户消息气泡
  messages.value.push({ sender: 'user', content: text })
  inputText.value = ''
  isTyping.value = true
  scrollToBottom()

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: text,
        source: props.source  // ✅ 告诉后端用哪套预设问答
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    messages.value.push({ sender: 'bot', content: data.reply })
  } catch (err) {
    // 网络错误或后端异常时显示友好提示
    messages.value.push({
      sender: 'bot',
      content: '抱歉，AI 助手暂时无法响应 😅<br/>可能是网络问题，稍后再试试吧~'
    })
    console.error('AI chat error:', err)
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

/** 快捷回复按钮点击 */
function sendQuickReply(question) {
  inputText.value = question
  sendMessage()
}

// ==================== 初始化 ====================
onMounted(() => {
  // 发送欢迎消息（根据 source 显示不同内容）
  messages.value.push({
    sender: 'bot',
    content: welcomeMessage.value
  })
  scrollToBottom()
})
</script>

<style scoped>
/* ==================== CSS 变量定义（暗色默认值） ==================== */
.ai-chat-card {
  /* --- 布局 --- */
  max-width: 600px;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  margin-top: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* --- 暗色主题变量（默认） --- */
  --card-bg: rgba(255, 255, 255, 0.08);
  --card-border: rgba(255, 255, 255, 0.15);
  --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  --header-bg: rgba(255, 255, 255, 0.06);
  --header-border: rgba(255, 255, 255, 0.1);
  --title-color: #fff;
  --hint-color: rgba(255, 255, 255, 0.45);
  --scrollbar-thumb: rgba(var(--primary-rgb), 0.3);
  --avatar-bot-bg: rgba(var(--primary-rgb), 0.15);
  --avatar-bot-border: rgba(var(--primary-rgb), 0.2);
  --avatar-user-border: rgba(255, 255, 255, 0.3);
  --bubble-bot-bg: rgba(var(--primary-rgb), 0.12);
  --bubble-bot-color: #e0f2fe;
  --bubble-bot-border: rgba(var(--primary-rgb), 0.15);
  --bubble-user-bg: rgba(102, 126, 234, 0.35);
  --bubble-user-color: #fff;
  --bubble-user-border: rgba(102, 126, 234, 0.3);
  --typing-dot: var(--primary);
  --quick-border: rgba(255, 255, 255, 0.75);
  --quick-bg: rgba(var(--primary-rgb), 0.08);
  --quick-color: rgba(255, 255, 255, 0.75);
  --quick-hover-bg: rgba(var(--primary-rgb), 0.2);
  --quick-hover-border: rgba(var(--primary-rgb), 0.5);
  --input-bar-bg: rgba(255, 255, 255, 0.04);
  --input-bar-border: rgba(255, 255, 255, 0.08);
  --input-bg: rgba(255, 255, 255, 0.06);
  --input-border: rgba(255, 255, 255, 0.15);
  --input-color: #fff;
  --input-placeholder: rgba(255, 255, 255, 0.35);
  --input-focus-border: rgba(var(--primary-rgb), 0.5);
  --input-focus-bg: rgba(255, 255, 255, 0.1);
  --send-bg: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary), #333 20%) 100%);
  --send-color: #fff;
  --send-shadow: 0 4px 12px color-mix(in srgb, var(--primary), transparent 60%);

  /* --- 应用变量 --- */
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
}

.ai-chat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

/* ==================== 亮色主题覆盖 ==================== */
.ai-chat-card.light {
  /* --- 基础颜色（已有） --- */
  --card-bg: #ffffff;
  --card-border: rgba(0, 0, 0, 0.08);
  --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  
  --header-bg: #f8f9fa;
  --header-border: rgba(0, 0, 0, 0.06);
  --title-color: #2d3748;
  --hint-color: #718096;
  
  /* ✅ 新增：AI 气泡 — 给一个可见的浅色背景！ */
  --bubble-bot-bg: rgba(231, 76, 60, 0.08);          /* 浅红底 */
  --bubble-bot-color: #374151;                         /* 深灰文字 */
  --bubble-bot-border: rgba(231, 76, 60, 0.15);       /* 可见的边框 */
  
  /* ✅ 新增：AI 头像 */
  --avatar-bot-bg: rgba(231, 76, 60, 0.1);
  --avatar-bot-border: rgba(231, 76, 60, 0.25);
  
  /* --- 用户气泡（已有） --- */
  --bubble-user-bg: var(--primary);                    /* 红色实心 */
  --bubble-user-color: #fff;
  --bubble-user-border: rgba(var(--primary-rgb), 0.3);

  --avatar-user-border: rgba(0, 0, 0, 0.12);
  
  /* ✅ 新增：滚动条 */
  --scrollbar-thumb: rgba(0, 0, 0, 0.15);
  
  /* --- 快捷按钮（已有） --- */
  --quick-border: rgba(var(--primary-rgb), 0.25);
  --quick-bg: rgba(var(--primary-rgb), 0.06);
  --quick-hover-bg: rgba(var(--primary-rgb), 0.12);
  --quick-hover-border: rgba(var(--primary-rgb), 0.4);
  
  /* --- 输入框（已有） --- */
  --input-bar-bg: #f8f9fa;
  --input-bar-border: rgba(0, 0, 0, 0.06);
  --input-bg: #ffffff;
  --input-border: rgba(0, 0, 0, 0.12);
  --input-color: #2d3748;
  --input-placeholder: #a0aec0;
  --input-focus-border: rgba(var(--primary-rgb), 0.5);
  --input-focus-bg: #ffffff;
  
  /* 去掉毛玻璃效果（亮色不需要） */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* ==================== 亮色主题：强制子元素覆盖（绕过CSS变量继承问题） ==================== */
.ai-chat-card.light .bubble.bot {
  background: #fef2f2 !important;
  color: #374151 !important;
  border: 1px solid #fecaca !important;
}
.ai-chat-card.light .bubble.user {
  background: var(--primary) !important;
  color: #ffffff !important;
  border-color: var(--primary) !important;
}
.ai-chat-card.light .chat-header {
  background: #f8f9fa !important;
  border-color: rgba(0, 0, 0, 0.06) !important;
}
.ai-chat-card.light .chat-header .header-title {
  color: #2d3748 !important;
}
.ai-chat-card.light .chat-header .header-hint {
  color: #718096 !important;
}
.ai-chat-card.light .avatar-bot {
  background: rgba(231, 76, 60, 0.1) !important;
  border-color: rgba(231, 76, 60, 0.25) !important;
}
.ai-chat-card.light .avatar-user  {
  border-color: rgba(0, 0, 0, 0.12) !important;
}
.ai-chat-card.light .chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15) !important;
}
.ai-chat-card.light .quick-btn {
  border-color: rgba(231, 76, 60, 0.25) !important;
  background: rgba(231, 76, 60, 0.05) !important;
  color: #e74c3c !important;
}
.ai-chat-card.light .quick-btn:hover {
  background: rgba(231, 76, 60, 0.12) !important;
  border-color: rgba(231, 76, 60, 0.4) !important;
}
.ai-chat-card.light .chat-input-bar {
  background: #f8f9fa !important;
  border-color: rgba(0, 0, 0, 0.06) !important;
}
.ai-chat-card.light .chat-input {
  background: #ffffff !important;
  color: #2d3748 !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
}
.ai-chat-card.light .chat-input::placeholder {
  color: #a0aec0 !important;
}
.ai-chat-card.light .chat-input:focus {
  border-color: rgba(231, 76, 60, 0.5) !important;
  background: #ffffff !important;
}
.ai-chat-card.light .send-btn {
  color: #e74c3c !important;
}

/* ==================== 标题栏 ==================== */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--title-color);
  letter-spacing: 0.5px;
}

.header-hint {
  font-size: 0.75rem;
  color: var(--hint-color);
}

/* ==================== 消息区域 ==================== */
.chat-messages {
  padding: 20px 20px 12px;      /* 上下左右都加一点呼吸空间 */
  max-height: 400px;             /* 高度也稍微增加 */
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

/* ==================== 消息行 ==================== */
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;           /* 消息之间更宽松 */
}

.message-row.user {
  flex-direction: row-reverse;
}

/* ==================== 头像 ==================== */
.avatar-bot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--avatar-bot-bg);
  border: 1px solid var(--avatar-bot-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-bot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-user {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--avatar-user-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-user img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==================== 气泡 ==================== */
.bubble {
  max-width: 75%;
  padding: 12px 18px;           /* 气泡内部更宽敞 */
  border-radius: 16px;
  line-height: 1.6;
  font-size: 0.88rem;
  word-break: break-word;
  animation: bubbleIn 0.3s ease;
}

@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bubble.bot {
  background: var(--bubble-bot-bg);
  color: var(--bubble-bot-color);
  border: 1px solid var(--bubble-bot-border);
  border-bottom-left-radius: 4px;
  line-height: 1.7;              /* ← 加上这个！欢迎语长文本更易读 */
}

.bubble.user {
  background: var(--bubble-user-bg);
  color: var(--bubble-user-color);
  border: 1px solid var(--bubble-user-border);
  border-bottom-right-radius: 4px;
}

/* ==================== 打字指示器 ==================== */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--typing-dot);
  animation: typingBounce 1.4s infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* ==================== 快捷回复 ==================== */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;                     /* 按钮间距加大 */
  padding: 4px 20px 14px;        /* 上下也留点空间 */
}

.quick-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--quick-border);
  background: var(--quick-bg);
  color: var(--quick-color);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.quick-btn:hover {
  background: var(--quick-hover-bg);
  border-color: var(--quick-hover-border);
  transform: translateY(-1px);
}

/* ==================== 输入框 ==================== */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--input-bar-bg);
  border-top: 1px solid var(--input-bar-border);
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--input-color);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.chat-input::placeholder {
  color: var(--input-placeholder);
}

.chat-input:focus {
  border-color: var(--input-focus-border);
  background: var(--input-focus-bg);
}

.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--send-bg);
  color: var(--send-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.25s ease;
  flex-shrink: 0;
  box-shadow: var(--send-shadow);
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.08);
}

.send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

/* ==================== 响应式 ==================== */
@media (max-width: 640px) {
  .ai-chat-card {
    border-radius: 20px;
  }

  .chat-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px 16px;
  }

  .header-hint {
    font-size: 0.7rem;
  }

  .chat-messages {
    max-height: 300px;
    padding: 12px 12px 6px;
  }

  .bubble {
    max-width: 85%;
    font-size: 0.84rem;
  }

  .avatar-bot,
  .avatar-user {
    width: 28px;
    height: 28px;
  }

  .avatar-bot {
    font-size: 14px;
  }

  .quick-replies {
    padding: 0 12px 8px;
  }

  .quick-btn {
    font-size: 0.75rem;
    padding: 5px 12px;
  }

  .chat-input-bar {
    padding: 10px 12px;
  }

  .chat-input {
    padding: 8px 12px;
    font-size: 0.84rem;
  }

  .send-btn {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }
}
</style>
