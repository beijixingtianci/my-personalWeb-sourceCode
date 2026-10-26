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


      <div class="post-content">{{ post.content }}</div>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts'
import UseParticles from '../components/UseParticles.vue'

const route = useRoute()

const post = computed(() => {
  const id = Number(route.params.id)
  return posts.find(p => p.id === id)
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
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
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
