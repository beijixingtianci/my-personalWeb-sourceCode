<template>
  <div class="convert-page">
    <use-particles />

    <div class="convert-inner">
      <h1 class="convert-title">文件转换</h1>
      <p class="convert-sub">全程在本机浏览器完成，文件不会上传到任何服务器</p>

      <!-- ① 支持格式对照表：一个萝卜一个坑 -->
      <div class="support-box">
        <p class="support-heading">先看这里 · 支持哪些转换</p>
        <div class="support-grid">
          <div class="support-item">
            <div class="support-item-top">
              <span class="support-badge">图片</span>
              <span class="support-desc">任选其一，转成另一种</span>
            </div>
            <div class="support-flow">
              <span class="fmt">PNG</span>
              <span class="fmt">JPG</span>
              <span class="fmt">JPEG</span>
              <span class="fmt">WEBP</span>
            </div>
          </div>
          <div class="support-item">
            <div class="support-item-top">
              <span class="support-badge">数据</span>
              <span class="support-desc">JSON 对象数组 → 表格</span>
            </div>
            <div class="support-flow">
              <span class="fmt">JSON</span>
              <span class="arrow">→</span>
              <span class="fmt">CSV</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ② 三步操作区 -->
      <div class="convert-card">
        <div class="step">
          <span class="step-num">1</span>
          <div class="step-body">
            <p class="step-title">选择要转换的文件</p>
            <label
              for="fileInput"
              class="upload-box"
              :class="{ dragover: isDragOver }"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="onDrop"
            >
              <i class="fas fa-cloud-upload-alt upload-icon"></i>
              <span class="upload-main">{{ fileName || '点击这里选择文件，或把文件拖进来' }}</span>
              <span class="upload-sub">支持上方列出的格式</span>
            </label>

            <button v-if="fileName" class="remove-btn" @click="removeFile">
              <i class="fas fa-trash-alt"></i> 删除这个文件，重新选择
            </button>

            <input id="fileInput" ref="fileInput" type="file" class="hidden-input" @change="onFileChange" />
          </div>
        </div>

        <div class="step" :class="{ muted: !targetList.length }">
          <span class="step-num">2</span>
          <div class="step-body">
            <p class="step-title">选择要转成的格式</p>
            <div v-if="targetList.length" class="options">
              <select id="fmt" v-model="target" class="select">
                <option v-for="t in targetList" :key="t" :value="t">{{ t.toUpperCase() }}</option>
              </select>
              <button class="convert-btn" :disabled="busy" @click="doConvert">
                {{ busy ? '转换中…' : '开始转换' }}
              </button>
            </div>
            <p v-else class="step-placeholder">选好文件后，这里会自动出现可转的格式</p>
          </div>
        </div>

        <div class="step" :class="{ muted: !downloadUrl }">
          <span class="step-num">3</span>
          <div class="step-body">
            <p class="step-title">下载转换结果</p>
            <a v-if="downloadUrl" :href="downloadUrl" :download="outName" class="download">
              <i class="fas fa-download"></i> 下载 {{ outName }}
            </a>
            <p v-else class="step-placeholder">转换完成后，下载链接会出现在这里</p>
          </div>
        </div>

        <p v-if="error" class="err">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UseParticles from '../components/UseParticles.vue'
import { getTargets, runConvert } from '../untils/converters/index.js'

const fileName = ref('')
const targetList = ref([])
const target = ref('')
const busy = ref(false)
const error = ref('')
const downloadUrl = ref('')
const outName = ref('')
const isDragOver = ref(false)
const fileInput = ref(null)

let currentFile = null

function handleFile(file) {
  error.value = ''
  downloadUrl.value = ''
  targetList.value = []
  target.value = ''
  if (!file) return

  currentFile = file
  fileName.value = file.name
  const ext = file.name.split('.').pop().toLowerCase()
  targetList.value = getTargets(ext)
  target.value = targetList.value[0] || ''

  if (!targetList.value.length) {
    error.value = '暂不支持 .' + ext + ' 格式，请看上方支持列表'
  }
}

function removeFile() {
  currentFile = null
  fileName.value = ''
  targetList.value = []
  target.value = ''
  error.value = ''
  outName.value = ''

  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = ''
  }

  // 关键：清空 input 的 value，否则再选同一个文件 @change 不触发
  if (fileInput.value) fileInput.value.value = ''
}

function onFileChange(e) {
  handleFile(e.target.files[0])
}

function onDrop(e) {
  isDragOver.value = false
  handleFile(e.dataTransfer.files[0])
}

async function doConvert() {
  if (!currentFile || !target.value) return
  busy.value = true
  error.value = ''
  try {
    const ext = currentFile.name.split('.').pop().toLowerCase()
    const blob = await runConvert(currentFile, ext, target.value)

    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = URL.createObjectURL(blob)
    outName.value = currentFile.name.replace(/\.[^.]+$/, '') + '.' + target.value
  } catch (err) {
    error.value = err.message || '转换失败'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.convert-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 100px 20px 40px;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.convert-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}
.convert-title { font-size: 28px; color: #fff; margin: 0 0 8px; }
.convert-sub { color: #cbd5e1; margin: 0 0 24px; font-size: 14px; }

.support-box {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.support-heading {
  color: #534AB7;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
}
.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.support-item {
  background: #f6f5fb;
  border-radius: 10px;
  padding: 14px;
}
.support-item-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.support-badge {
  background: #534AB7;
  color: #fff;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
}
.support-desc { color: #777; font-size: 12px; }
.support-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.fmt {
  background: #fff;
  border: 1px solid #ddd;
  color: #444;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
}
.arrow { color: #534AB7; font-weight: 700; }

.convert-card {
  background: #fff;
  border-radius: 12px;
  padding: 8px 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.step { display: flex; gap: 14px; padding: 18px 0; }
.step + .step { border-top: 1px solid #f0f0f0; }
.step.muted { opacity: 0.55; }
.step-num {
  flex: 0 0 26px;
  height: 26px;
  border-radius: 50%;
  background: #534AB7;
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-body { flex: 1; min-width: 0; }
.step-title { color: #333; font-size: 14px; font-weight: 600; margin: 3px 0 12px; }

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 2px dashed #c7c3e8;
  border-radius: 10px;
  padding: 26px 16px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
}
.upload-box:hover, .upload-box.dragover {
  border-color: #534AB7;
  background: #f6f5fb;
}
.upload-icon { font-size: 26px; color: #534AB7; }
.upload-main { color: #444; font-size: 14px; word-break: break-all; }
.upload-sub { color: #999; font-size: 12px; }
.hidden-input { display: none; }

.remove-btn {
  margin-top: 12px;
  padding: 6px 12px;
  border: 1px solid #e0a0a0;
  border-radius: 8px;
  background: #fff;
  color: #c0392b;
  font-size: 13px;
  cursor: pointer;
}
.remove-btn:hover {
  background: #fff5f4;
}

.options { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.convert-btn {
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: #534AB7;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.convert-btn:disabled { opacity: 0.6; cursor: default; }
.step-placeholder { color: #999; font-size: 13px; margin: 0; }
.download {
  display: inline-block;
  color: #534AB7;
  font-size: 15px;
  text-decoration: none;
}
.err { color: #c0392b; font-size: 14px; margin: 12px 0 0; }
</style>
