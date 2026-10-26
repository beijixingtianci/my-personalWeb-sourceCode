<template>
  <div class="blog-page">
    <use-particles />

    <div class="blog-inner">
      <h1 class="blog-title">博客</h1>
      <p class="blog-sub">记录学习和生活</p>

      <div class="blog-grid">
        <RouterLink v-for="post in posts" :key="post.id" :to="'/blog/' + post.id" class="blog-card">
          <div class="blog-cover"
            :style="{ background: post.cover ? 'url(' + post.cover + ') center/cover' : '#534AB7' }"></div>
          <div class="blog-info">
            <h2 class="blog-card-title">{{ post.title }}</h2>
            <p class="blog-date">{{ post.date }}</p>
            <div class="blog-tags">
              <span v-for="tag in post.tags" :key="tag" class="blog-tag"># {{ tag }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { posts } from '../data/posts'
import UseParticles from '../components/UseParticles.vue'
</script>

<style scoped>
.blog-page {
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

.blog-inner{
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
}

.blog-title {
  font-size: 28px;
  color: #fff;
}

.blog-sub {
  color: #cbd5e1;
  margin-bottom: 30px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.blog-card {
  display: block;
  text-decoration: none;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.blog-card:hover {
  transform: translateY(-4px);
}

.blog-cover {
  height: 140px;
}

.blog-info {
  padding: 16px;
}

.blog-card-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px;
}

.blog-date {
  color: #999;
  font-size: 13px;
  margin: 0 0 10px;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.blog-tag {
  font-size: 12px;
  color: #534AB7;
  background: #EEEDFE;
  padding: 2px 10px;
  border-radius: 10px;
}
</style>
