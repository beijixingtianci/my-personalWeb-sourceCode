<template>
  <div class="music-section">
    <div class="player-card">
      <!-- 左侧：封面 + 歌曲信息 -->
      <div class="album-side">
        <div class="cover-wrapper" :class="{ playing: isPlaying }">
          <img :src="currentSong.cover" alt="封面" class="cover-img" />
        </div>
        <div class="song-info">
          <h3 class="song-name">{{ currentSong.title }}</h3>
          <p class="song-artist">{{ currentSong.artist }}</p>
        </div>
      </div>

      <!-- 右侧：播放器 + 歌词 -->
      <div class="player-side">
        <!-- 进度条 -->
        <div class="progress-row">
          <span class="time-label">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" @click="seekTo">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="time-label">{{ formatTime(duration) }}</span>
        </div>

        <!-- 控制按钮 -->
        <div class="controls">
          <button class="ctrl-btn" @click="prevSong" title="上一首">⏮</button>
          <button class="play-btn" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="ctrl-btn" @click="nextSong" title="下一首">⏭</button>
        </div>

        <!-- 歌词区域 -->
        <div class="lyrics-box" ref="lyricsBox">
          <p
            v-for="(line, i) in parsedLyrics"
            :key="i"
            class="lyric-line"
            :class="{ active: activeLyricIdx === i }"
          >
            {{ line.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// ==================== 歌曲列表 ====================
const songs = [
  {
    title: 'SoundHelix Song 1',
    artist: 'T. Schürger',
    cover: '/images/background.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    lrc: `[00:00.00]
[00:05.00]♪ 前奏 ♪
[00:15.00]SoundHelix 示例音乐
[00:22.00]由 T. Schürger 创作
[00:30.00]用于演示音乐播放器
[00:40.00]♪ 间奏 ♪
[00:50.00]免费音乐素材
[01:00.00]♪ 尾奏 ♪`
  },
  {
    title: 'SoundHelix Song 2',
    artist: 'T. Schürger',
    cover: '/images/background.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lrc: `[00:00.00]
[00:05.00]♪ 第二首 ♪
[00:15.00]另一段示例旋律
[00:25.00]感受不同的节拍
[00:35.00]♪ 间奏 ♪
[00:45.00]音乐让生活更美好
[01:00.00]♪ 结束 ♪`
  }
]

// ==================== 状态 ====================
const currentIndex = ref(0)
const currentSong = computed(() => songs[currentIndex.value])
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const lyricsBox = ref(null)

let audio = null
const parsedLyrics = ref([])
const activeLyricIdx = ref(-1)

// ==================== 计算属性 ====================
const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

// ==================== 歌词解析 ====================
function parseLrc(lrcStr) {
  const lines = lrcStr.split('\n')
  const result = []
  for (const line of lines) {
    const match = line.match(/$$(\d+):(\d+)\.(\d+)$$(.*)/)
    if (match) {
      const time = parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3]) / 100
      const text = match[4].trim()
      if (text) result.push({ time, text })
    }
  }
  return result
}

// ==================== 播放控制 ====================
function togglePlay() {
  if (!audio) return
  if (isPlaying.value) {
    audio.pause()
  } else {
    audio.play()
  }
  isPlaying.value = !isPlaying.value
}

function switchSong(index) {
  currentIndex.value = index
  if (audio) audio.pause()
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  activeLyricIdx.value = -1
  parsedLyrics.value = parseLrc(currentSong.value.lrc)
  // 延迟加载新歌
  setTimeout(() => {
    if (!audio) return
    audio.src = currentSong.value.src
    audio.play().then(() => { isPlaying.value = true }).catch(() => {})
  }, 200)
}

function prevSong() {
  const idx = (currentIndex.value - 1 + songs.length) % songs.length
  switchSong(idx)
}

function nextSong() {
  const idx = (currentIndex.value + 1) % songs.length
  switchSong(idx)
}

function seekTo(e) {
  if (!audio || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  audio.currentTime = ratio * duration.value
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ==================== 歌词高亮 ====================
function updateLyrics() {
  let newIdx = -1
  for (let i = parsedLyrics.value.length - 1; i >= 0; i--) {
    if (currentTime.value >= parsedLyrics.value[i].time) {
      newIdx = i
      break
    }
  }
  if (newIdx !== activeLyricIdx.value) {
    activeLyricIdx.value = newIdx
    nextTick(() => {
      if (lyricsBox.value && newIdx >= 0) {
        const el = lyricsBox.value.children[newIdx]
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  audio = new Audio()
  audio.src = currentSong.value.src
  parsedLyrics.value = parseLrc(currentSong.value.lrc)

  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
    updateLyrics()
  })
  audio.addEventListener('loadedmetadata', () => {
    duration.value = audio.duration
  })
  audio.addEventListener('ended', nextSong)
})

onBeforeUnmount(() => {
  if (audio) {
    audio.pause()
    audio.removeEventListener('timeupdate', () => {})
    audio.removeEventListener('ended', nextSong)
    audio = null
  }
})
</script>

<style scoped>
/* ==================== 外层容器 ==================== */
.music-section {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-bottom: 2rem;
}

.music-title {
  color: #aef9ee;
  font-size: 1.5rem;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  text-align: center;
  width: 100%;
}

.music-title::after {
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

/* ==================== 播放器卡片 ==================== */
.player-card {
  display: flex;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(161, 242, 234, 0.15);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.player-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.12);
}

/* ==================== 左侧：封面区 ==================== */
.album-side {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cover-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(161, 242, 234, 0.3);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.cover-wrapper.playing {
  border-color: rgba(161, 242, 234, 0.6);
  box-shadow: 0 6px 30px rgba(161, 242, 234, 0.2);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 6px 30px rgba(161, 242, 234, 0.2); }
  50% { box-shadow: 0 6px 40px rgba(161, 242, 234, 0.35); }
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  text-align: center;
}

.song-name {
  color: #fff;
  font-size: 1.1rem;
  margin: 0 0 0.3rem;
}

.song-artist {
  color: #a1f2ea;
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.8;
}

/* ==================== 右侧：播放器 ==================== */
.player-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

/* 进度条 */
.progress-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.time-label {
  color: #a1f2ea;
  font-size: 0.8rem;
  font-family: monospace;
  min-width: 36px;
}

.progress-bar {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a1f2ea, #64b5f6);
  border-radius: 3px;
  transition: width 0.15s linear;
}

.progress-bar:hover {
  height: 7px;
}

/* 控制按钮 */
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.ctrl-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.4rem;
  transition: color 0.2s, transform 0.2s;
}

.ctrl-btn:hover {
  color: #a1f2ea;
  transform: scale(1.15);
}

.play-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #a1f2ea;
  background: rgba(161, 242, 234, 0.1);
  color: #a1f2ea;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.play-btn:hover {
  background: rgba(161, 242, 234, 0.25);
  transform: scale(1.08);
}

/* ==================== 歌词区域 ==================== */
.lyrics-box {
  flex: 1;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 1rem 0.8rem;
  scroll-behavior: smooth;
}

.lyric-line {
  text-align: center;
  padding: 0.4rem 0.5rem;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.9rem;
  transition: all 0.3s;
  line-height: 1.6;
}

.lyric-line.active {
  color: #a1f2ea;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(161, 242, 234, 0.4);
}

/* 歌词滚动条 */
.lyrics-box::-webkit-scrollbar {
  width: 4px;
}
.lyrics-box::-webkit-scrollbar-track {
  background: transparent;
}
.lyrics-box::-webkit-scrollbar-thumb {
  background: rgba(161, 242, 234, 0.25);
  border-radius: 2px;
}

/* ==================== 响应式 ==================== */
@media (max-width: 640px) {
  .player-card {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .album-side {
    flex: none;
  }

  .cover-wrapper {
    width: 140px;
    height: 140px;
  }

  .lyrics-box {
    max-height: 160px;
  }
}
</style>
