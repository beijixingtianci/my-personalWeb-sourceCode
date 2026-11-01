<template>
  <use-particles />

  <div v-if="post" class="post-page">
    <div class="post-inner">
      <RouterLink to="/blog" class="back-link">← 返回博客列表</RouterLink>

      <h1 class="post-title">{{ post.title }}</h1>
      <p class="post-meta">{{ post.date }}</p>
      <div class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="post-tag"># {{ tag }}</span>
      </div>


      <component v-if="postComp" :is="postComp" :embedded="true" />
      <div v-else class="post-content">{{ post.content }}</div>
    </div>
  </div>

  <div v-else class="post-page">
    <div class="post-inner">
      <RouterLink to="/blog" class="back-link">← 返回博客列表</RouterLink>
      <p>找不到这篇文章</p>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts'
import UseParticles from '../components/UseParticles.vue'

const route = useRoute()

const post = computed(() => {
  const id = Number(route.params.id)
  return posts.find(p => p.id === id)
})

// 交互式文章组件（Vite 懒加载：posts.js 里 component 写组件名即可）
const articleModules = import.meta.glob('./articles/*.vue')
const postComp = computed(() => {
  const name = post.value?.component
  if (!name) return null
  const loader = articleModules[`./articles/${name}.vue`]
  return loader ? markRaw(defineAsyncComponent(loader)) : null
})
</script>

<style scoped>
.post-page {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 100px 20px 40px;
  background: linear-gradient(180deg, #0a0e22 0%, #0c1130 45%, #0a0e22 100%);
}

/* 方案 B：照片只留顶部一段，向下渐隐成纯色，不挡正文 */
.post-page::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 340px;
  z-index: 0;
  pointer-events: none;
  background: url('/images/background.jpg') center 30% / cover no-repeat;
  filter: brightness(0.55) saturate(0.8);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
}

.post-inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
}

.back-link {
  color: #a1f2ea;
  text-decoration: none;
  font-size: 14px;
}

.post-title {
  font-size: 30px;
  color: #fff;
  margin: 24px 0 8px;
}

.post-meta {
  color: #cbd5e1;
  font-size: 14px;
  margin: 0 0 12px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 30px;
}

.post-tag {
  font-size: 12px;
  color: #534AB7;
  background: #EEEDFE;
  padding: 2px 10px;
  border-radius: 10px;
}

.post-content {
  white-space: pre-wrap;
  line-height: 1.8;
  color: #e2e8f0;
}
</style>
